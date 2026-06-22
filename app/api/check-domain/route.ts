import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

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

  const actualIp = extractActualIp(text)
  if (actualIp && actualIp !== clientIp) {
    console.log('[check-domain] Retrying with detected IP:', actualIp)
    const retry = await fetch(buildUrl(actualIp))
    return retry.text()
  }
  return text
}

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

  try {
    const text = await namecheapFetch(
      { Command: 'namecheap.domains.check', DomainList: domain },
      apiKey, apiUser, clientIp
    )

    if (text.includes('Status="ERROR"')) {
      const errMatch = text.match(/<Error[^>]*>([^<]+)<\/Error>/)
      const errMsg = errMatch?.[1] ?? 'Namecheap API error'
      console.error('[check-domain] Namecheap error:', errMsg)
      return NextResponse.json({ available: false, error: errMsg })
    }

    const elemMatch = text.match(/<DomainCheckResult[^/]*\/>/)
    if (!elemMatch) {
      console.error('[check-domain] No DomainCheckResult in response:', text.slice(0, 500))
      return NextResponse.json({ available: false, error: 'Unexpected response format' })
    }

    const available = /Available="true"/i.test(elemMatch[0])
    return NextResponse.json({ available, domain })
  } catch (err: unknown) {
    const e = err as { message?: string }
    return NextResponse.json({ available: false, error: e.message })
  }
}
