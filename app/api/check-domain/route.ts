import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')
  if (!domain) return NextResponse.json({ available: false, error: 'Missing domain' })

  const apiKey = process.env.NAMECHEAP_API_KEY
  const apiUser = process.env.NAMECHEAP_API_USER
  const clientIp = process.env.NAMECHEAP_CLIENT_IP

  if (!apiKey || !apiUser || !clientIp) {
    return NextResponse.json({ available: false, error: 'Missing Namecheap credentials' })
  }

  const parts = domain.split('.')
  if (parts.length < 2) {
    return NextResponse.json({ available: false, error: 'Invalid domain format' })
  }
  const tld = parts[parts.length - 1]
  const sld = parts.slice(0, -1).join('.')

  try {
    const url = new URL('https://api.namecheap.com/xml.response')
    url.searchParams.set('ApiUser', apiUser)
    url.searchParams.set('ApiKey', apiKey)
    url.searchParams.set('UserName', apiUser)
    url.searchParams.set('ClientIp', clientIp)
    url.searchParams.set('Command', 'namecheap.domains.check')
    url.searchParams.set('DomainList', `${sld}.${tld}`)

    const res = await fetch(url.toString())
    const text = await res.text()

    const availableMatch = text.match(/Available="([^"]+)"/)
    const available = availableMatch?.[1] === 'true'

    return NextResponse.json({ available, domain: `${sld}.${tld}` })
  } catch (err: unknown) {
    const e = err as { message?: string }
    return NextResponse.json({ available: false, error: e.message })
  }
}
