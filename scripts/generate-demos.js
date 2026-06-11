// ─── CONFIG ────────────────────────────────────────────────────────────────
const TABLE_NAME = 'Sans Site'
const LIMIT      = 5
const VERTICAL   = 'plombier'
const LANG       = 'fr'
const COUNTRY    = 'France'
// ───────────────────────────────────────────────────────────────────────────

const Anthropic       = require('@anthropic-ai/sdk').default
const Airtable        = require('airtable')
const { Octokit }     = require('@octokit/rest')

// ─── HELPERS ───────────────────────────────────────────────────────────────

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')   // strip accents
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')      // keep only alphanum, spaces, hyphens
    .trim()
    .replace(/[\s]+/g, '-')            // spaces → hyphens
    .replace(/-{2,}/g, '-')            // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '')           // trim leading/trailing hyphens
    .slice(0, 60)
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── CLIENTS ───────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const airtableBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID)

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

// ─── STEP 1 — Fetch leads from Airtable ───────────────────────────────────

async function fetchLeads() {
  const records = []
  await airtableBase(TABLE_NAME)
    .select({
      filterByFormula: `{statut} = "Lead extrait"`,
      maxRecords: LIMIT,
    })
    .eachPage((page, fetchNext) => {
      records.push(...page)
      fetchNext()
    })
  return records
}

// ─── STEP 3 — Generate JSON via Claude ────────────────────────────────────

async function generateBusinessJSON(lead, slug) {
  const f = lead.fields

  const userPrompt = `
À partir de cette fiche entreprise, génère la configuration complète d'un site démo professionnel.

FICHE:
- nom: ${f.nom}
- verticale: ${VERTICAL}
- ville: ${f.ville}
- pays: ${COUNTRY}
- téléphone: ${f.telephone}
- note Google: ${f.note_google}/5
- nombre d'avis: ${f.nb_avis}
- zone: ${f.ville_recherche}

Génère un objet JSON valide avec exactement cette structure:
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
    "hero_title": "[titre accrocheur pour un plombier à ${f.ville}]",
    "hero_subtitle": "[sous-titre avec 3 arguments clés]",
    "value_prop": "[proposition de valeur principale]",
    "about": "[description de l'entreprise en 2-3 phrases naturelles]",
    "services": [
      {"title": "Dépannage d'urgence", "desc": "[description spécifique]", "icon": "zap"},
      {"title": "Installation sanitaire", "desc": "[description]", "icon": "droplets"},
      {"title": "Chauffage & chaudière", "desc": "[description]", "icon": "flame"},
      {"title": "Rénovation plomberie", "desc": "[description]", "icon": "wrench"},
      {"title": "Détection de fuite", "desc": "[description]", "icon": "search"},
      {"title": "Entretien VMC", "desc": "[description]", "icon": "wind"}
    ],
    "why_us": [
      "[argument 1 fort et spécifique]",
      "[argument 2]",
      "[argument 3]",
      "[argument 4]",
      "[argument 5]"
    ],
    "service_area": "[description de la zone d'intervention incluant ${f.ville} et communes proches]",
    "reviews_note": "${f.note_google} / 5 sur Google Maps · ${f.nb_avis} avis clients vérifiés",
    "cta_primary": "Appeler maintenant",
    "cta_secondary": "Demander un devis gratuit",
    "contact": {
      "phone": "${f.telephone}",
      "email": "",
      "hours": "Lun–Sam 7h–20h · Urgences 24h/24 7j/7"
    },
    "seo_title": "[titre SEO optimisé local ≤60 caractères]",
    "meta_description": "[meta description avec ville et services clés ≤155 caractères]"
  }
}

RÈGLES:
- Tout le contenu en français
- Textes naturels et spécifiques à cette entreprise et sa ville
- Jamais de placeholder ou de texte générique
- Renvoie UNIQUEMENT le JSON valide, rien d'autre
`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: "Tu es un directeur artistique et copywriter expert en sites web pour entreprises locales françaises. Tu génères uniquement du JSON valide, sans texte avant ou après, sans backticks.",
    messages: [{ role: 'user', content: userPrompt }],
  })

  const raw = message.content[0].text.trim()
  return JSON.parse(raw)
}

// ─── STEP 4 — Push JSON to GitHub ─────────────────────────────────────────

async function pushToGitHub(slug, jsonData) {
  const path    = `data/businesses/${slug}.json`
  const content = Buffer.from(JSON.stringify(jsonData, null, 2)).toString('base64')
  const owner   = process.env.GITHUB_OWNER
  const repo    = process.env.GITHUB_REPO

  // Check if file already exists (to get its SHA for update)
  let sha
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path })
    sha = data.sha
  } catch {
    // File doesn't exist yet — that's fine
  }

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `Add demo: ${jsonData.business.name}`,
    content,
    ...(sha ? { sha } : {}),
  })
}

// ─── STEP 5 — Update Airtable record ──────────────────────────────────────

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
  console.log(`\n🚀 WebPower — Génération de démos`)
  console.log(`   Table: ${TABLE_NAME} · Limit: ${LIMIT}\n`)

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

  for (const lead of leads) {
    const nom = lead.fields.nom || '(sans nom)'

    try {
      // STEP 2 — slug
      const slug = generateSlug(nom)

      // STEP 3 — Claude
      const jsonData = await generateBusinessJSON(lead, slug)

      // STEP 4 — GitHub
      await pushToGitHub(slug, jsonData)

      // STEP 5 — Airtable
      const url_demo = await updateAirtableRecord(lead.id, slug)

      console.log(`✓ ${nom} → ${url_demo}`)
      success++
    } catch (err) {
      console.log(`✗ ${nom} → ERROR: ${err.message}`)
    }

    // Rate limit buffer between leads
    if (leads.indexOf(lead) < leads.length - 1) {
      await delay(2000)
    }
  }

  console.log(`\n✅ ${success} démo(s) générée(s) sur ${leads.length} lead(s) traité(s)\n`)
}

main()
