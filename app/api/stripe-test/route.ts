import Stripe from 'stripe'
import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const key = process.env.STRIPE_SECRET_KEY ?? ''
    const stripe = new Stripe(key, { apiVersion: '2026-05-27.dahlia' })
    const balance = await stripe.balance.retrieve()
    return NextResponse.json({
      success: true,
      currency: balance.available[0]?.currency,
    })
  } catch (err: unknown) {
    const e = err as { message?: string; type?: string; code?: string }
    return NextResponse.json({
      success: false,
      error: e.message,
      type: e.type,
      code: e.code,
    }, { status: 500 })
  }
}
