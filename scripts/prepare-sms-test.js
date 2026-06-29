const { readFileSync, writeFileSync } = require('fs')

const BASE = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`
const HEADERS = { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' }

const MSG_A1 = (link) =>
  `Bonjour, c'est Sam. J'ai créé un aperçu de site web pour votre entreprise, jetez un œil : ${link}`

const MSG_B6 = (link) =>
  `Bonjour, c'est Sam. J'ai travaillé sur un site web pour votre entreprise et j'aimerais votre avis. Tout est déjà prêt, vous pouvez le voir ici (gratuit) : ${link}`

function parseCSV(content) {
  const lines = content.trim().split('\n')
  const hdrs = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
  return lines.slice(1).map(line => {
    const values = []; let cur = '', inQ = false
    for (const ch of line) {
      if (ch === '"') inQ = !inQ
      else if (ch === ',' && !inQ) { values.push(cur); cur = '' }
      else cur += ch
    }
    values.push(cur)
    return Object.fromEntries(hdrs.map((h, i) => [h, values[i] ?? '']))
  })
}

async function getAllPages(tableName, formula) {
  const records = []
  let offset = null
  do {
    let url = `${BASE}/${tableName}?pageSize=100`
    if (formula) url += `&filterByFormula=${encodeURIComponent(formula)}`
    if (offset) url += `&offset=${offset}`
    const res = await fetch(url, { headers: HEADERS })
    const d = await res.json()
    if (d.error) throw new Error(`Airtable error: ${JSON.stringify(d.error)}`)
    records.push(...(d.records || []))
    offset = d.offset
  } while (offset)
  return records
}

async function patch(table, id, fields) {
  const res = await fetch(`${BASE}/${table}/${id}`, {
    method: 'PATCH', headers: HEADERS,
    body: JSON.stringify({ fields, typecast: true }),
  })
  return res.json()
}

async function main() {
  // 1. Fetch already-assigned codes from Airtable Liens Courts
  console.log('Fetching current Airtable state...')
  const assignedRecords = await getAllPages('Liens%20Courts', 'NOT({sms_variant} = "")')
  const assignedByCode = {}
  for (const r of assignedRecords) {
    assignedByCode[r.fields.short_code] = r.fields.sms_variant
  }
  console.log(`Already assigned: ${Object.entries(assignedByCode).map(([k,v]) => `${k}=${v}`).join(', ')}`)

  // 2. Fetch Non intéressé leads from Sans Site
  const nonIntRecords = await getAllPages('Sans%20Site', "{statut}='Non int%C3%A9ress%C3%A9'")
  const nonIntNames = new Set(nonIntRecords.map(r => r.fields.nom?.toLowerCase().trim()))
  console.log(`Non intéressé leads to exclude: ${nonIntRecords.length}`)

  // 3. Fetch all Liens Courts records (for record IDs)
  const allLC = await getAllPages('Liens%20Courts', '')
  const lcByCode = {}
  for (const r of allLC) {
    lcByCode[r.fields.short_code] = r
  }

  // 4. Read and deduplicate CSV by short_link
  const csv = readFileSync('short-links-export.csv', 'utf8')
  const allLeads = parseCSV(csv)
  const seenLinks = new Set()
  const dedupedLeads = allLeads.filter(r => {
    const link = r.short_link
    if (seenLinks.has(link)) return false
    seenLinks.add(link); return true
  })

  // 5. Separate already-assigned A1 and B6 leads
  const a1Leads = [], b6Leads = []
  for (const r of dedupedLeads) {
    const code = r.short_link?.split('/').pop()
    const variant = assignedByCode[code]
    if (variant === 'A1') a1Leads.push(r)
    else if (variant === 'B6') b6Leads.push(r)
  }
  console.log(`\nExisting A1 (${a1Leads.length}): ${a1Leads.map(r => r.nom).join(', ')}`)
  console.log(`Existing B6 (${b6Leads.length}): ${b6Leads.map(r => r.nom).join(', ')}`)

  // 6. Find unassigned eligible leads
  const available = dedupedLeads.filter(r => {
    const code = r.short_link?.split('/').pop()
    if (assignedByCode[code]) return false
    if (r.nom?.toLowerCase().includes('g.a.p.c')) return false
    if (nonIntNames.has(r.nom?.toLowerCase().trim())) return false
    return true
  })

  const needed = (10 - a1Leads.length) + (10 - b6Leads.length)
  console.log(`\nAvailable unassigned leads: ${available.length}, need ${needed}`)
  if (available.length < needed) {
    console.error(`Not enough leads! Need ${needed}, have ${available.length}`)
    process.exit(1)
  }

  // 7. Assign: fill A1 to 10, then B6 to 10
  const newA1 = available.slice(0, 10 - a1Leads.length)
  const newB6 = available.slice(10 - a1Leads.length, needed)

  console.log('\nAssigning new leads...')
  for (const r of newA1) {
    const code = r.short_link.split('/').pop()
    const lcRec = lcByCode[code]
    if (lcRec) {
      await patch('Liens%20Courts', lcRec.id, { sms_variant: 'A1' })
      console.log(`  A1  ${r.nom} (${code})`)
    }
    await new Promise(resolve => setTimeout(resolve, 220))
  }
  for (const r of newB6) {
    const code = r.short_link.split('/').pop()
    const lcRec = lcByCode[code]
    if (lcRec) {
      await patch('Liens%20Courts', lcRec.id, { sms_variant: 'B6' })
      console.log(`  B6  ${r.nom} (${code})`)
    }
    await new Promise(resolve => setTimeout(resolve, 220))
  }

  // 8. Build final lists and export CSVs
  const finalA1 = [...a1Leads, ...newA1]
  const finalB6 = [...b6Leads, ...newB6]

  const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`
  const toRow = (r, variant) => {
    const msg = variant === 'A1' ? MSG_A1(r.short_link) : MSG_B6(r.short_link)
    return [q(r.nom), q(r.telephone), q(r.short_link), q(msg), q(variant)].join(',')
  }
  const header = '"nom","telephone","short_link","message","variant"'
  const BOM = '﻿'

  writeFileSync('sms-test-A1.csv', BOM + [header, ...finalA1.map(r => toRow(r, 'A1'))].join('\n'), 'utf8')
  writeFileSync('sms-test-B6.csv', BOM + [header, ...finalB6.map(r => toRow(r, 'B6'))].join('\n'), 'utf8')

  console.log(`\nA1 (${finalA1.length} leads): ${finalA1.map(r => r.nom).join(', ')}`)
  console.log(`B6 (${finalB6.length} leads): ${finalB6.map(r => r.nom).join(', ')}`)
  console.log('\nCSVs exported: sms-test-A1.csv, sms-test-B6.csv')
}

main().catch(console.error)
