import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY
  return NextResponse.json({
    hasKey: !!key,
    keyPrefix: key?.slice(0, 10) ?? 'missing',
    keyLength: key?.length ?? 0,
  })
}
