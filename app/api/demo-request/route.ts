import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Airtable table: "Demandes Démo"
// Fields: societe (Single line text), prenom (Single line text), nom (Single line text),
//         telephone (Single line text), email (Email), maps_url (URL),
//         created_at (Date + time), statut (Single select: "Nouveau", "En cours", "Démo envoyée")

export async function POST(request: Request) {
  try {
    const { societe, prenom, nom, telephone, email, maps_url } = await request.json()

    if (!societe || !prenom || !nom || !telephone || !email) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const baseId = process.env.AIRTABLE_BASE_ID
    const apiKey = process.env.AIRTABLE_API_KEY

    if (!baseId || !apiKey) {
      console.error('[demo-request] Missing Airtable env vars')
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
    }

    const res = await fetch(`https://api.airtable.com/v0/${baseId}/Demandes%20D%C3%A9mo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          societe,
          prenom,
          nom,
          telephone,
          email,
          maps_url: maps_url || '',
          statut: 'Nouveau',
        },
        typecast: true,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('[demo-request] Airtable error:', err)
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[demo-request] Unexpected error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
