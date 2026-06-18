import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export async function POST(request: Request) {
  try {
    const { amount, currency, metadata } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount ?? 49900,
      currency: currency ?? 'eur',
      metadata: metadata ?? {},
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
