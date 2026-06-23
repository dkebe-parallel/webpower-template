const { createWriteStream } = require('fs')

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY

// Same slug logic as generate-demos-agent.js
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

// Deterministic 4-char alphanumeric code from slug
function hashToCode(slug) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let h = 2166136261
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[h % chars.length]
    h = (h >>> 5) | (h << 27)
    h = h >>> 0
  }
  return code
}

async function airtableFetch(path, options = {}) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  return res.json()
}

async function getAllLeads() {
  const leads = []
  let offset = null
  do {
    const url = `/Sans%20Site?filterByFormula={statut}=%22D%C3%A9mo%20g%C3%A9n%C3%A9r%C3%A9e%22&pageSize=100${offset ? `&offset=${offset}` : ''}`
    const data = await airtableFetch(url)
    if (data.records) leads.push(...data.records)
    offset = data.offset
  } while (offset)
  return leads
}

async function getExistingCodes() {
  const existing = {}
  let offset = null
  do {
    const url = `/Liens%20Courts?pageSize=100${offset ? `&offset=${offset}` : ''}`
    const data = await airtableFetch(url)
    if (data.records) {
      for (const r of data.records) {
        if (r.fields.slug) existing[r.fields.slug] = r.fields.short_code
      }
    }
    offset = data.offset
  } while (offset)
  return existing
}

async function createLink({ short_code, destination_url, slug, lead_name }) {
  const result = await airtableFetch('/Liens%20Courts', {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        short_code,
        destination_url,
        slug,
        lead_name,
        clicks: 0,
        clicked: false,
        created_at: new Date().toISOString(),
      },
      typecast: true,
    }),
  })
  if (result.error) throw new Error(`Airtable: ${result.error.type} — ${result.error.message}`)
  return result
}

async function main() {
  console.log('Fetching leads with statut = "Démo générée"...')
  const leads = await getAllLeads()
  console.log(`Found ${leads.length} leads`)

  console.log('Fetching existing short links...')
  const existing = await getExistingCodes()
  console.log(`Found ${Object.keys(existing).length} existing codes`)

  const csvStream = createWriteStream('short-links-export.csv')
  csvStream.write('nom,telephone,short_link,sms_variant\n')

  let created = 0
  let skipped = 0

  for (const lead of leads) {
    const nom = lead.fields.nom || lead.fields.name || ''
    const telephone = lead.fields.telephone || lead.fields.phone || ''

    if (!nom) { skipped++; continue }

    // Derive slug from nom — same logic as the generation agent
    const slug = generateSlug(nom)
    const code = hashToCode(slug)
    const short_link = `https://wbpw.li/${code}`

    if (existing[slug]) {
      const existingCode = existing[slug]
      console.log(`  SKIP  ${slug} → already has code ${existingCode}`)
      csvStream.write(`"${nom}","${telephone}","https://wbpw.li/${existingCode}",""\n`)
      skipped++
      continue
    }

    try {
      await createLink({
        short_code: code,
        destination_url: `https://webpower.app/demo/${slug}`,
        slug,
        lead_name: nom,
      })
      console.log(`  CREATE  ${slug} → ${short_link}`)
      csvStream.write(`"${nom}","${telephone}","${short_link}",""\n`)
      created++
    } catch (err) {
      console.error(`  ERROR  ${slug}:`, err.message)
      skipped++
    }

    // Airtable rate limit: 5 req/s
    await new Promise(r => setTimeout(r, 220))
  }

  csvStream.end()
  console.log(`\nDone: ${created} liens créés, ${skipped} déjà existants ou ignorés`)
  console.log('CSV exporté: short-links-export.csv')
}

main().catch(console.error)
