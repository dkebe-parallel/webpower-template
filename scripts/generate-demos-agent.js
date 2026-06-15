// ─── CONFIG ────────────────────────────────────────────────────────────────
const TABLE_NAME = 'Sans Site'
const LIMIT      = 20
const VERTICAL   = 'plombier'
const LANG       = 'fr'
const COUNTRY    = 'France'
// ───────────────────────────────────────────────────────────────────────────

const Anthropic   = require('@anthropic-ai/sdk').default
const Airtable    = require('airtable')
const { Octokit } = require('@octokit/rest')
const fs          = require('fs')
const path        = require('path')

// ─── HELPERS ───────────────────────────────────────────────────────────────

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Strip markdown code fences if the model wraps output despite instructions
function extractJSON(raw) {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/)
  if (fenced) return fenced[1].trim()
  return trimmed
}

// ─── CLIENTS ───────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const airtableBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID)

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

// ─── STAGE 0 — Fetch leads ─────────────────────────────────────────────────

async function fetchLeads() {
  const records = []
  await airtableBase(TABLE_NAME)
    .select({
      filterByFormula: `{statut} = "Lead extrait"`,
      maxRecords: LIMIT,
      fields: [
        'nom', 'telephone', 'email', 'type_email',
        'note_google', 'nb_avis',
        'rue', 'ville', 'code_postal',
        'lien_maps', 'ville_recherche',
        'description_google',
        'review_text_1', 'review_text_2', 'review_text_3',
        'review_tags',
        'photo_url_1', 'photo_url_2',
        'horaires', 'lat', 'lng',
      ],
    })
    .eachPage((page, fetchNext) => {
      records.push(...page)
      fetchNext()
    })
  return records
}

// ─── STAGE 1 — Analysis agent (Opus) ──────────────────────────────────────

async function runAnalysisAgent(f) {
  const rawData = `
NOM: ${f.nom || ''}
VERTICALE: ${VERTICAL}
VILLE: ${f.ville || ''}
CODE POSTAL: ${f.code_postal || ''}
PAYS: ${COUNTRY}
TÉLÉPHONE: ${f.telephone || ''}
EMAIL: ${f.email || ''}
NOTE GOOGLE: ${f.note_google || ''}/5
NOMBRE D'AVIS: ${f.nb_avis || ''}
LIEN MAPS: ${f.lien_maps || ''}
ZONE DE RECHERCHE: ${f.ville_recherche || ''}
ADRESSE: ${f.rue || ''}, ${f.code_postal || ''} ${f.ville || ''}
GPS: ${f.lat || 'N/A'}, ${f.lng || 'N/A'}
HORAIRES: ${f.horaires || 'non renseignés'}
DESCRIPTION GOOGLE: ${f.description_google || 'non renseignée'}
MOTS-CLÉS AVIS: ${f.review_tags || 'non renseignés'}
AVIS CLIENT 1: ${f.review_text_1 || 'non disponible'}
AVIS CLIENT 2: ${f.review_text_2 || 'non disponible'}
AVIS CLIENT 3: ${f.review_text_3 || 'non disponible'}
PHOTO 1: ${f.photo_url_1 || 'non disponible'}
PHOTO 2: ${f.photo_url_2 || 'non disponible'}
`.trim()

  const userPrompt = `Voici toutes les données brutes d'une entreprise artisanale française.
Analyse-les en profondeur et renvoie UNIQUEMENT un objet JSON valide (sans backticks, sans texte avant/après).

DONNÉES:
${rawData}

INSTRUCTIONS:
- real_services: services RÉELLEMENT proposés, déduits de description_google + avis. Max 5, ordre décroissant d'importance. Jamais inventés.
- key_strengths: 3-4 forces RÉELLES basées sur le contenu littéral des avis clients. Citer l'esprit de ce que disent les clients.
- positioning: 1 phrase sur comment cette entreprise doit être positionnée commercialement.
- tone: ton adapté (ex: "proximité artisanale", "professionnel fiable", "artisan de quartier", etc.)
- punchline_angle: le seul angle le plus percutant pour une accroche hero COURTE (pas le titre lui-même, l'angle).
- differentiators: ce qui distingue vraiment cette entreprise (basé sur les données uniquement).
- nearby_cities: 6-8 VRAIES communes proches des coordonnées GPS. Utilise lat/lng pour déterminer la géographie réelle. Pour Eysines (44.88, -0.65) → Mérignac, Le Haillan, Bordeaux, Le Bouscat, Blanquefort, Saint-Médard-en-Jalles, Pessac, Taillan-Médoc. JAMAIS Paris sauf si les coordonnées sont en Île-de-France.
- trust_signals: éléments de confiance concrets (note, nb avis, formulations précises des clients).
- has_certifications: certifications RÉELLES mentionnées (ex: ["RGE"]) ou tableau vide.
- data_quality_notes: ce qui manque dans les données et stratégie de fallback.

JSON ATTENDU:
{
  "real_services": [],
  "key_strengths": [],
  "positioning": "",
  "tone": "",
  "punchline_angle": "",
  "differentiators": [],
  "nearby_cities": [],
  "trust_signals": [],
  "has_certifications": [],
  "data_quality_notes": ""
}`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2000,
    system: "Tu es un consultant expert en marketing local et en analyse d'entreprises artisanales françaises. Tu analyses en profondeur les données d'une entreprise pour en extraire l'essence commerciale. Tu produis uniquement du JSON valide.",
    messages: [{ role: 'user', content: userPrompt }],
  })

  return JSON.parse(extractJSON(message.content[0].text))
}

// ─── STAGE 2 — Generation agent (Sonnet) ──────────────────────────────────

async function runGenerationAgent(f, slug, analysis) {
  const rawData = `
NOM: ${f.nom}
SLUG: ${slug}
VILLE: ${f.ville}
CODE POSTAL: ${f.code_postal || ''}
PAYS: ${COUNTRY}
TÉLÉPHONE: ${f.telephone}
EMAIL: ${f.email || ''}
TYPE EMAIL: ${f.type_email || ''}
NOTE GOOGLE: ${f.note_google}
NOMBRE D'AVIS: ${f.nb_avis}
ADRESSE: ${f.rue}, ${f.code_postal} ${f.ville}
LIEN MAPS: ${f.lien_maps}
HORAIRES: ${f.horaires || ''}
DESCRIPTION GOOGLE: ${f.description_google || ''}
AVIS 1: ${f.review_text_1 || ''}
AVIS 2: ${f.review_text_2 || ''}
AVIS 3: ${f.review_text_3 || ''}
`.trim()

  const analysisBlock = JSON.stringify(analysis, null, 2)

  const userPrompt = `Tu génères la configuration JSON complète d'un site démo pour un artisan français.

━━━ DONNÉES BRUTES ━━━
${rawData}

━━━ ANALYSE STAGE 1 ━━━
${analysisBlock}

━━━ SCHÉMA & RÈGLES STRICTES ━━━

Génère un objet JSON complet respectant EXACTEMENT cette structure et ces contraintes.
Renvoie UNIQUEMENT le JSON valide, sans backticks, sans texte avant ou après.

HERO:
- hero_title: MAX 50 caractères. Accroche commerciale courte et percutante.
  BON: "Votre plombier de confiance à ${f.ville}"
  MAUVAIS: "Plombier à ${f.ville} — prix honnêtes, travail soigné, 5/5 sur Google"
  Utilise l'angle de punchline_angle de l'analyse.
- hero_subtitle: 1 ligne, MAX 120 chars, 2-3 arguments clés tirés des données réelles.
- hero_stats: EXACTEMENT 3 items {value, label}.
  Value = chiffre percutant ("5/5", "100%", "< 2h", etc.).
  Inclure obligatoirement la note Google comme l'une des stats.
  Jamais moins de 3 items.

BADGES:
- badges.certifications: utilise has_certifications de l'analyse. Si vide → [].
- badges.highlight: si certifications vide, une valorisation courte ≤ 20 chars
  PAS déjà affichée dans les stats ou le titre. Ex: "Devis gratuit", "Artisan local".
  Choisir parmi les trust_signals ou differentiators de l'analyse.

REASSURANCE:
- reassurance_items: EXACTEMENT 3 items {title ≤35 chars, subtitle ≤50 chars}.
  Basés sur key_strengths et differentiators.

SERVICES:
- Exactement 5 services (ou moins UNIQUEMENT si real_services en contient moins).
- Utilise les real_services de l'analyse comme base, dans l'ordre.
- Les 2 premiers = featured (grands), desc MAX 130 chars.
- Les 3 suivants = petits, desc MAX 115 chars.
- title: ≤ 30 chars, une seule ligne.
- icon: choisir parmi: zap | droplets | flame | wrench | search | wind
- tag: optionnel, libellé court pour les 2 premiers.
- services_intro: ≤ 100 chars, résume l'offre.

WHY_US:
- 4 items {title ≤25 chars, desc ≤60 chars}.
- Basés sur key_strengths de l'analyse. Jamais inventés.
- why_us_badge: {value, label} — RÈGLES STRICTES:
  · value = UNIQUEMENT une durée courte: "2h", "1h", "30min", "4h". JAMAIS "24h/24", "7j/7", "Rapide" ou toute phrase non-durée.
  · label = TOUJOURS exactement "délai d'intervention" (texte fixe, ne pas varier).
  · Si les données (horaires, avis, description) mentionnent une urgence/réactivité forte → value = "1h". Sinon → value = "2h".
  · CORRECT: {"value": "2h", "label": "délai d'intervention"}
  · INCORRECT: {"value": "24h/24", ...}, {"value": "Rapide", ...}, {"value": "2h", "label": "délai moyen d'intervention"}

SERVICE AREA:
- service_area: liste des communes, séparées par des virgules.
- service_area_cities: 8-9 villes réelles de nearby_cities + ville principale.
  OBLIGATOIREMENT un tableau de CHAÎNES SIMPLES, jamais d'objets.
  CORRECT: ["Bourgvallées", "Saint-Lô", "Villedieu-les-Poêles"]
  INCORRECT: [{"name": "Bourgvallées", "main": true}, {"name": "Saint-Lô"}]
- service_area_map_cities: 5-6 des PLUS GRANDES villes parmi nearby_cities (labels radar).
  OBLIGATOIREMENT un tableau de CHAÎNES SIMPLES, jamais d'objets.
  CORRECT: ["Saint-Lô", "Villedieu-les-Poêles", "Condé-sur-Vire"]
  INCORRECT: [{"name": "Saint-Lô"}, {"name": "Villedieu-les-Poêles"}]
- service_area_stats: EXACTEMENT 3 items {value, label} (communes, note, avis).
- service_area_note: phrase COMMERCIALE ≤ 125 chars. PAS une liste de villes.
  Ex: "Déplacement rapide dans tout le secteur, devis gratuit sans engagement."

REVIEWS (EDGE CASE OBLIGATOIRE):
- Si business.reviews_count est null, 0, ou qu'aucun champ review_text_X n'est renseigné dans les données brutes :
  → Génère "reviews": []
  → Génère content.no_reviews_cta: {
      "eyebrow": string MAX 20 chars, style majuscules — ex: "CONFIANCE", "PROXIMITÉ", "ENGAGEMENT",
      "title": string MAX 45 chars — affirmation confiante sur l'entreprise, PAS sur les avis. Ex: "Un artisan de confiance dans votre secteur",
      "subtitle": string MAX 110 chars — basée sur les VRAIES forces Stage 1 (réactivité, présence locale, qualité, certs si existantes),
      "button_text": string MAX 30 chars — ex: "Demander un devis gratuit"
    }
  RÈGLES CRITIQUES POUR CE BLOC:
  - Ne JAMAIS mentionner "avis", "témoignage", "review", "premier client", ni rien impliquant que l'entreprise est nouvelle.
  - Ne JAMAIS combiner "établi de longue date" ET "soyez parmi les premiers" — contradiction absolue à éviter.
  - Se concentrer sur ce qui EST connu et réel: réactivité, présence locale, services proposés.
  - Si Stage 1 indique que l'entreprise est active depuis des années, s'appuyer dessus SANS jamais évoquer les avis.
  - Ton: section normale et professionnelle — ni excuse, ni demande, juste une affirmation de confiance.
- Si des review_text_X sont disponibles :
  → Les utiliser VERBATIM (jamais paraphrasés). Max 3 reviews.
  → author: prénom + initiale réaliste. location: vraie commune voisine.
  → rating: 5
  → Ne pas générer no_reviews_cta.

CONTACT:
- phone: numéro réel.
- email: email réel si type_email renseigné, sinon "".
- hours: reformater horaires proprement si disponibles (ex: "Lun–Ven 8h–18h · Sam 9h–12h"), sinon "".

FOOTER:
- footer_description: ≤ 205 chars. Spécifique à l'entreprise.

SEO:
- seo_title: ≤ 60 chars, optimisé local.
- meta_description: ≤ 155 chars.

RÈGLES ABSOLUES:
- Tout le contenu en français.
- Ne JAMAIS inventer: années d'expérience, certifications, stats non confirmées.
- Ne JAMAIS utiliser "Paris" si les coordonnées ne sont pas en Île-de-France.
- Respecter CHAQUE limite de caractères (compter).
- Si une donnée manque → fallback intelligent, jamais de contenu vide ou bizarre.
- value_prop: ≤ 280 chars, spécifique à cette entreprise.
- about: 2-3 phrases, basé sur description_google si disponible.

STRUCTURE JSON COMPLÈTE ATTENDUE:
{
  "business": {
    "name": "${f.nom}",
    "slug": "${slug}",
    "city": "${f.ville}",
    "country": "${COUNTRY}",
    "phone": "${f.telephone}",
    "address": "${f.rue}, ${f.code_postal} ${f.ville}",
    "maps_url": "${f.lien_maps}",
    "rating": ${f.note_google},
    "reviews_count": ${f.nb_avis}
  },
  "lang": "${LANG}",
  "images": {},
  "badges": {
    "certifications": [],
    "highlight": ""
  },
  "theme": {
    "palette": {
      "primary": "#1C2B4A",
      "secondary": "#C87941",
      "accent": "#F5F3EE",
      "bg": "#FFFFFF",
      "text": "#1A1A1A",
      "muted": "#6B7280"
    },
    "fonts": {
      "heading": "Schibsted Grotesk",
      "body": "Hanken Grotesk"
    },
    "hero_variant": "split",
    "imagery_mood": "professionnel, artisan local, confiance"
  },
  "layout": {
    "sections_order": ["hero","value_prop","services","why_us","service_area","reviews","contact","footer"],
    "enabled_blocks": []
  },
  "content": {
    "hero_title": "",
    "hero_subtitle": "",
    "hero_stats": [],
    "reassurance_items": [],
    "value_prop": "",
    "services_intro": "",
    "about": "",
    "footer_description": "",
    "services": [],
    "why_us": [],
    "why_us_badge": null,
    "service_area": "",
    "service_area_cities": [],
    "service_area_map_cities": [],
    "service_area_stats": [],
    "service_area_note": "",
    "no_reviews_cta": { "eyebrow": "", "title": "", "subtitle": "", "button_text": "" },
    "reviews_note": "${f.note_google} / 5 sur Google Maps · ${f.nb_avis} avis clients vérifiés",
    "cta_primary": "Appeler maintenant",
    "cta_secondary": "Demander un devis gratuit",
    "contact": {
      "phone": "${f.telephone}",
      "email": "",
      "hours": ""
    },
    "seo_title": "",
    "meta_description": ""
  },
  "reviews": []
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: "Tu es un directeur artistique et copywriter expert en sites web pour artisans français. Tu génères des sites sur mesure, crédibles, qui respectent un cahier des charges strict. Tu produis UNIQUEMENT du JSON valide conforme au schéma fourni, sans texte avant ou après, sans backticks.",
    messages: [{ role: 'user', content: userPrompt }],
  })

  return JSON.parse(extractJSON(message.content[0].text))
}

// ─── STAGE 3 — Stock image selection ──────────────────────────────────────

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return hash
}

function getStockImages(vertical, category) {
  const dir = path.join(process.cwd(), 'public', 'images', 'stock', vertical, category)
  try {
    return fs.readdirSync(dir).filter(f => f.endsWith('.webp')).sort()
  } catch {
    return []
  }
}

function injectImages(jsonData) {
  // Strip any images the model may have set
  jsonData.images = {}
  if (Array.isArray(jsonData.content?.services)) {
    jsonData.content.services = jsonData.content.services.map(s => {
      const { image: _removed, ...rest } = s
      return rest
    })
  }

  const heroImages    = getStockImages(VERTICAL, 'hero')
  const whyUsImages   = getStockImages(VERTICAL, 'why-us')
  const serviceImages = getStockImages(VERTICAL, 'services')
  const h = hashString(jsonData.business.slug)

  if (heroImages.length > 0) {
    jsonData.images.hero = `/images/stock/${VERTICAL}/hero/${heroImages[h % heroImages.length]}`
  }
  if (whyUsImages.length > 0) {
    jsonData.images.why_us = `/images/stock/${VERTICAL}/why-us/${whyUsImages[(h + 1) % whyUsImages.length]}`
  }
  if (serviceImages.length >= 2 && jsonData.content?.services) {
    const idx1 = h % serviceImages.length
    const idx2 = (h + 1) % serviceImages.length
    if (jsonData.content.services[0]) {
      jsonData.content.services[0].image = `/images/stock/${VERTICAL}/services/${serviceImages[idx1]}`
    }
    if (jsonData.content.services[1]) {
      jsonData.content.services[1].image = `/images/stock/${VERTICAL}/services/${serviceImages[idx2]}`
    }
  }

  return jsonData
}

// ─── STAGE 4a — Push JSON to GitHub ───────────────────────────────────────

async function pushToGitHub(slug, jsonData) {
  const path    = `data/businesses/${slug}.json`
  const content = Buffer.from(JSON.stringify(jsonData, null, 2)).toString('base64')
  const owner   = process.env.GITHUB_OWNER
  const repo    = process.env.GITHUB_REPO

  let sha
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path })
    sha = data.sha
  } catch {
    // File doesn't exist yet
  }

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `Agent v2: ${jsonData.business.name}`,
    content,
    ...(sha ? { sha } : {}),
  })
}

// ─── STAGE 4b — Update Airtable record ────────────────────────────────────

async function updateAirtableRecord(recordId, slug) {
  const url_demo = `${process.env.VERCEL_BASE_URL}/demo/${slug}`
  await airtableBase(TABLE_NAME).update(recordId, {
    statut: 'Démo générée',
    url_demo,
  }, { typecast: true })
  return url_demo
}

// ─── MAIN ──────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 WebPower — Agent v2 (deux étages)`)
  console.log(`   Table: ${TABLE_NAME} · Limit: ${LIMIT} · Vertical: ${VERTICAL}\n`)

  let leads
  try {
    leads = await fetchLeads()
  } catch (err) {
    console.error(`✗ Impossible de récupérer les leads Airtable: ${err.message}`)
    process.exit(1)
  }

  if (leads.length === 0) {
    console.log('ℹ Aucun lead avec statut "Lead extrait" trouvé.')
    return
  }

  console.log(`📋 ${leads.length} lead(s) à traiter\n`)

  let success = 0

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i]
    const f = lead.fields
    const nom = f.nom || '(sans nom)'

    try {
      // Slug
      const slug = generateSlug(nom)

      // Stage 1 — Opus analysis
      let analysis
      try {
        analysis = await runAnalysisAgent(f)
        console.log(`   STAGE 1 analysis done for ${nom}`)
      } catch (err) {
        console.log(`✗ ${nom} → STAGE 1 ERROR: ${err.message}`)
        continue
      }

      // Stage 2 — Sonnet generation
      let jsonData
      try {
        jsonData = await runGenerationAgent(f, slug, analysis)
        console.log(`   STAGE 2 generation done for ${nom}`)
      } catch (err) {
        console.log(`✗ ${nom} → STAGE 2 ERROR: ${err.message}`)
        continue
      }

      // Stage 3 — Stock image selection (deterministic by slug hash)
      jsonData = injectImages(jsonData)

      // Stage 4 — Push & update
      await pushToGitHub(slug, jsonData)
      const url_demo = await updateAirtableRecord(lead.id, slug)

      console.log(`✓ ${nom} → ${url_demo}`)
      success++
    } catch (err) {
      console.log(`✗ ${nom} → ERROR: ${err.message}`)
    }

    // 3s delay between leads
    if (i < leads.length - 1) {
      await delay(3000)
    }
  }

  console.log(`\n✅ ${success} démo(s) générée(s) (agent v2) sur ${leads.length} lead(s) traité(s)\n`)
}

main()
