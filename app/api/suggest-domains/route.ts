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
    return NextResponse.json({ suggestions: suggestions.map(domain => ({ domain, available: null })), error: 'Missing credentials' })
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

    // Check for API-level errors
    if (text.includes('Status="ERROR"')) {
      const errMatch = text.match(/<Error[^>]*>([^<]+)<\/Error>/)
      const errMsg = errMatch?.[1] ?? 'Namecheap API error'
      console.error('[suggest-domains] Namecheap error:', errMsg)
      return NextResponse.json({ suggestions: suggestions.map(domain => ({ domain, available: null })), error: errMsg })
    }

    // Parse each DomainCheckResult element independently
    const elements = [...text.matchAll(/<DomainCheckResult[^/]*\/>/g)]
    const availability = elements.map(m => {
      const elem = m[0]
      const domainMatch = elem.match(/Domain="([^"]+)"/)
      const available = /Available="true"/i.test(elem)
      return { domain: domainMatch?.[1] ?? '', available }
    }).filter(r => r.domain)

    return NextResponse.json({ suggestions: availability })
  } catch (err: unknown) {
    const e = err as { message?: string }
    console.error('[suggest-domains] error:', e.message)
    return NextResponse.json({ suggestions: suggestions.map(domain => ({ domain, available: null })), error: e.message })
  }
}
