import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

const VERCEL_EGRESS_IPS = ['3.81.98.62', '3.227.246.144']

function extractActualIp(xml: string): string | null {
  const match = xml.match(/Invalid request IP:\s*([\d.]+)/)
  return match?.[1] ?? null
}

async function namecheapFetch(params: Record<string, string>, apiKey: string, apiUser: string, clientIp: string): Promise<string> {
  const buildUrl = (ip: string) => {
    const url = new URL('https://api.namecheap.com/xml.response')
    url.searchParams.set('ApiUser', apiUser)
    url.searchParams.set('ApiKey', apiKey)
    url.searchParams.set('UserName', apiUser)
    url.searchParams.set('ClientIp', ip)
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
    return url.toString()
  }

  const res = await fetch(buildUrl(clientIp))
  const text = await res.text()

  // Known Vercel egress IP detected from error message
  const actualIp = extractActualIp(text)
  if (actualIp && actualIp !== clientIp) {
    console.log('[suggest-domains] Retrying with detected IP:', actualIp)
    return (await fetch(buildUrl(actualIp))).text()
  }

  // ClientIp param itself was rejected — try known Vercel egress IPs
  if (text.includes('Parameter ClientIP is invalid')) {
    for (const ip of VERCEL_EGRESS_IPS) {
      console.log('[suggest-domains] Retrying with fallback IP:', ip)
      const retryText = await (await fetch(buildUrl(ip))).text()
      if (!retryText.includes('Status="ERROR"')) return retryText
    }
  }

  return text
}

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
    const text = await namecheapFetch(
      { Command: 'namecheap.domains.check', DomainList: suggestions.join(',') },
      apiKey, apiUser, clientIp
    )

    if (text.includes('Status="ERROR"')) {
      const errMatch = text.match(/<Error[^>]*>([^<]+)<\/Error>/)
      const errMsg = errMatch?.[1] ?? 'Namecheap API error'
      console.error('[suggest-domains] Namecheap error:', errMsg)
      return NextResponse.json({ suggestions: suggestions.map(domain => ({ domain, available: null })), error: errMsg })
    }

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
