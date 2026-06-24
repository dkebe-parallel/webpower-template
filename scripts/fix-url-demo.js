const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY

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

async function getAllRecords() {
  const records = []
  let offset = null
  do {
    const url = `/Sans%20Site?filterByFormula=SEARCH("vercel.app",{url_demo})&pageSize=100${offset ? `&offset=${offset}` : ''}`
    const data = await airtableFetch(url)
    if (data.error) throw new Error(`Airtable: ${data.error.type} — ${data.error.message}`)
    if (data.records) records.push(...data.records)
    offset = data.offset
  } while (offset)
  return records
}

async function main() {
  console.log('Fetching records with old vercel.app url_demo...')
  const records = await getAllRecords()
  console.log(`Found ${records.length} records to fix`)

  let fixed = 0, alreadyCorrect = 0, errors = 0

  for (const record of records) {
    const nom = record.fields.nom || record.fields.name || ''
    if (!nom) { errors++; continue }

    const slug = generateSlug(nom)
    const newUrl = `https://webpower.app/demo/${slug}`
    const currentUrl = record.fields.url_demo || ''

    if (!currentUrl.includes('vercel.app')) { alreadyCorrect++; continue }

    try {
      const result = await airtableFetch(`/Sans%20Site/${record.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields: { url_demo: newUrl }, typecast: true }),
      })
      if (result.error) throw new Error(`${result.error.type} — ${result.error.message}`)
      console.log(`  FIXED  ${nom} → ${newUrl}`)
      fixed++
    } catch (err) {
      console.error(`  ERROR  ${nom}: ${err.message}`)
      errors++
    }

    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\nDone: Fixed ${fixed} records, ${alreadyCorrect} already correct, ${errors} errors`)
}

main().catch(console.error)
