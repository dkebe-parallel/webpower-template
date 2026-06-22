import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') ?? ''

  const base = slug.replace(/-/g, '')
  const suggestions = [
    `${base}.fr`,
    `${base}.com`,
    `${slug}.fr`,
    `${slug}.com`,
  ].filter((d, i, arr) => arr.indexOf(d) === i).slice(0, 4)

  const apiKey = process.env.NAMECHEAP_API_KEY
  const apiUser = process.env.NAMECHEAP_API_USER
  const clientIp = process.env.NAMECHEAP_CLIENT_IP

  if (!apiKey || !apiUser || !clientIp) {
    return NextResponse.json({ suggestions: suggestions.map(domain => ({ domain, available: null })) })
  }

  try {
    const url = new URL('https://api.namecheap.com/xml.response')
    url.searchParams.set('ApiUser', apiUser)
    url.searchParams.set('ApiKey', apiKey)
    url.searchParams.set('UserName', apiUser)
    url.searchParams.set('ClientIp', clientIp)
    url.searchParams.set('Command', 'namecheap.domains.check')
    url.searchParams.set('DomainList', suggestions.join(','))

    const res = await fetch(url.toString())
    const text = await res.text()

    const results = [...text.matchAll(/Domain="([^"]+)" Available="([^"]+)"/g)]
    const availability = results.map(m => ({ domain: m[1], available: m[2] === 'true' }))

    return NextResponse.json({ suggestions: availability })
  } catch {
    return NextResponse.json({ suggestions: [] })
  }
}
