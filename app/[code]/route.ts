import { NextResponse, NextRequest } from 'next/server'

export const runtime = 'nodejs'

const RESERVED = ['demo', 'commander', 'api', '_next', 'images', 'favicon.ico']

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  if (RESERVED.includes(code)) {
    return NextResponse.next()
  }

  const baseId = process.env.AIRTABLE_BASE_ID
  const apiKey = process.env.AIRTABLE_API_KEY

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/Liens%20Courts?filterByFormula={short_code}="${code}"&maxRecords=1`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    )
    const data = await res.json()
    const record = data.records?.[0]

    if (!record) {
      return NextResponse.redirect(new URL('https://webpower.app'))
    }

    const destination = record.fields.destination_url
    const recordId = record.id

    // Log click asynchronously — don't slow down the redirect
    fetch(`https://api.airtable.com/v0/${baseId}/Liens%20Courts/${recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          clicks: (record.fields.clicks || 0) + 1,
          last_click_at: new Date().toISOString(),
          clicked: true,
        },
        typecast: true,
      }),
    })

    // Update lead status to "Démo vue" — find by url_demo containing the slug
    const slug = record.fields.slug
    if (slug) {
      const filter = encodeURIComponent(`FIND("${slug}", {url_demo})`)
      fetch(
        `https://api.airtable.com/v0/${baseId}/Sans%20Site?filterByFormula=${filter}&fields[]=statut&maxRecords=1`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )
        .then(r => r.json())
        .then(leadData => {
          const leadRecord = leadData.records?.[0]
          if (leadRecord && leadRecord.fields.statut === 'Démo générée') {
            fetch(`https://api.airtable.com/v0/${baseId}/Sans%20Site/${leadRecord.id}`, {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fields: { statut: 'Démo vue' },
                typecast: true,
              }),
            })
          }
        })
        .catch(() => {})
    }

    return NextResponse.redirect(new URL(destination), { status: 302 })
  } catch {
    return NextResponse.redirect(new URL('https://webpower.app'))
  }
}
