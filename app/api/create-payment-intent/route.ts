export const runtime = 'nodejs'

import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-05-27.dahlia',
    })

    const { amount, currency, metadata } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount ?? 49900,
      currency: currency ?? 'eur',
      metadata: metadata ?? {},
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: unknown) {
    const e = err as { message?: string; type?: string; code?: string }
    return NextResponse.json(
      { error: e.message, type: e.type, code: e.code },
      { status: 500 }
    )
  }
}
