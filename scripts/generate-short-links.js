const { createWriteStream } = require('fs')

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY

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
    const url = `/Sans%20Site?filterByFormula={statut}="Démo générée"&pageSize=100${offset ? `&offset=${offset}` : ''}`
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
  return airtableFetch('/Liens%20Courts', {
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
    const slug = lead.fields.slug
    const nom = lead.fields.nom || lead.fields.name || slug
    const telephone = lead.fields.telephone || lead.fields.phone || ''

    if (!slug) { skipped++; continue }

    const code = hashToCode(slug)
    const short_link = `https://wbpw.li/${code}`

    if (existing[slug]) {
      console.log(`  SKIP  ${slug} → already has code ${existing[slug]}`)
      const existingCode = existing[slug]
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

    // Rate-limit: 5 req/s Airtable limit
    await new Promise(r => setTimeout(r, 220))
  }

  csvStream.end()
  console.log(`\nDone: ${created} liens créés, ${skipped} déjà existants ou ignorés`)
  console.log('CSV exporté: short-links-export.csv')
}

main().catch(console.error)
