export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { amount, currency, metadata } = await request.json()

    const params = new URLSearchParams({
      amount: String(amount ?? 49900),
      currency: currency ?? 'eur',
      'automatic_payment_methods[enabled]': 'true',
    })
    if (metadata) {
      for (const [k, v] of Object.entries(metadata)) {
        params.set(`metadata[${k}]`, String(v))
      }
    }

    const res = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const data = await res.json() as { client_secret?: string; error?: { message: string } }

    if (!res.ok || !data.client_secret) {
      return NextResponse.json({ error: data.error?.message ?? 'Stripe error' }, { status: 500 })
    }

    return NextResponse.json({ clientSecret: data.client_secret })
  } catch (err: unknown) {
    const e = err as { message?: string }
    return NextResponse.json({ error: e.message ?? 'Internal error' }, { status: 500 })
  }
}
