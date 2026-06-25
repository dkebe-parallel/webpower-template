const { readFileSync, writeFileSync } = require('fs')

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY

const MSG_A1 = (link) =>
  `Bonjour, c'est Sam. J'ai créé un aperçu de site web pour votre entreprise, jetez un œil : ${link}`

const MSG_B6 = (link) =>
  `Bonjour, c'est Sam. J'ai travaillé sur un site web pour votre entreprise et j'aimerais votre avis. Tout est déjà prêt, vous pouvez le voir ici (gratuit) : ${link}`

function parseCSV(content) {
  const lines = content.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
  return lines.slice(1).map(line => {
    const values = []
    let current = '', inQuotes = false
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes }
      else if (ch === ',' && !inQuotes) { values.push(current); current = '' }
      else current += ch
    }
    values.push(current)
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
  })
}

async function updateLienCourt(slug, variant) {
  const filter = encodeURIComponent(`{slug}="${slug}"`)
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Liens%20Courts?filterByFormula=${filter}&maxRecords=1`,
    { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } }
  )
  const data = await res.json()
  const record = data.records?.[0]
  if (!record) { console.warn(`  WARN: no Liens Courts record for slug "${slug}"`); return }

  await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Liens%20Courts/${record.id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { sms_variant: variant }, typecast: true }),
  })
}

function slugFromLink(short_link) {
  // short_link-export has no slug col — derive from lead_name not available here
  // We'll look up by short_link matching short_code in Liens Courts
  return short_link.split('/').pop()
}

async function getLienCourtByCode(code) {
  const filter = encodeURIComponent(`{short_code}="${code}"`)
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Liens%20Courts?filterByFormula=${filter}&maxRecords=1`,
    { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } }
  )
  const data = await res.json()
  return data.records?.[0]
}

async function main() {
  const csv = readFileSync('short-links-export.csv', 'utf8')
  const leads = parseCSV(csv)

  const unassigned = leads.filter(r => !r.sms_variant || r.sms_variant.trim() === '')
  console.log(`Total leads in CSV: ${leads.length}, unassigned: ${unassigned.length}`)

  const batch = unassigned.slice(0, 10)
  const groupA = batch.slice(0, 5)
  const groupB = batch.slice(5, 10)

  const rowsA = [], rowsB = []

  console.log('\nAssigning variants and updating Airtable...')

  for (const lead of groupA) {
    const code = slugFromLink(lead.short_link)
    const msg = MSG_A1(lead.short_link)
    rowsA.push({ ...lead, message: msg, variant: 'A1' })
    const record = await getLienCourtByCode(code)
    if (record) {
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Liens%20Courts/${record.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: { sms_variant: 'A1' }, typecast: true }),
      })
      console.log(`  A1  ${lead.nom} → ${lead.short_link}`)
    }
    await new Promise(r => setTimeout(r, 220))
  }

  for (const lead of groupB) {
    const code = slugFromLink(lead.short_link)
    const msg = MSG_B6(lead.short_link)
    rowsB.push({ ...lead, message: msg, variant: 'B6' })
    const record = await getLienCourtByCode(code)
    if (record) {
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Liens%20Courts/${record.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: { sms_variant: 'B6' }, typecast: true }),
      })
      console.log(`  B6  ${lead.nom} → ${lead.short_link}`)
    }
    await new Promise(r => setTimeout(r, 220))
  }

  const toCSVRow = r => `"${r.nom}","${r.telephone}","${r.short_link}","${r.message.replace(/"/g, '""')}","${r.variant}"`
  const header = 'nom,telephone,short_link,message,variant'

  writeFileSync('sms-test-A1.csv', [header, ...rowsA.map(toCSVRow)].join('\n'), 'utf8')
  writeFileSync('sms-test-B6.csv', [header, ...rowsB.map(toCSVRow)].join('\n'), 'utf8')

  console.log('\nA1:', groupA.map(r => r.nom).join(', '))
  console.log('B6:', groupB.map(r => r.nom).join(', '))
  console.log('CSVs exported: sms-test-A1.csv, sms-test-B6.csv')
}

main().catch(console.error)
