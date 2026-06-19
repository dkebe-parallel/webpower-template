import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const secret = process.env.STRIPE_SECRET_KEY
  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  return NextResponse.json({
    secretKey: { hasKey: !!secret, prefix: secret?.slice(0, 10) ?? 'missing', length: secret?.length ?? 0 },
    publishableKey: { hasKey: !!publishable, prefix: publishable?.slice(0, 10) ?? 'missing', length: publishable?.length ?? 0 },
  })
}
