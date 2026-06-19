import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ sold: false })

  try {
    const res = await fetch(
      `https://api.stripe.com/v1/payment_intents/search?query=metadata%5B%27slug%27%5D%3A%27${encodeURIComponent(slug)}%27%20AND%20status%3A%27succeeded%27&limit=1`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.STRIPE_SECRET_KEY + ':').toString('base64')}`,
        },
      }
    )
    const data = await res.json()
    const sold = data?.data?.length > 0
    return NextResponse.json({ sold })
  } catch {
    return NextResponse.json({ sold: false })
  }
}
