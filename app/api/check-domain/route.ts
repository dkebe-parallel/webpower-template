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

  try {
    const url = new URL('https://api.namecheap.com/xml.response')
    url.searchParams.set('ApiUser', apiUser)
    url.searchParams.set('ApiKey', apiKey)
    url.searchParams.set('UserName', apiUser)
    url.searchParams.set('ClientIp', clientIp)
    url.searchParams.set('Command', 'namecheap.domains.check')
    url.searchParams.set('DomainList', domain)

    const res = await fetch(url.toString())
    const text = await res.text()

    // Check for API-level errors first
    if (text.includes('Status="ERROR"')) {
      const errMatch = text.match(/<Error[^>]*>([^<]+)<\/Error>/)
      const errMsg = errMatch?.[1] ?? 'Namecheap API error'
      console.error('[check-domain] Namecheap error:', errMsg)
      return NextResponse.json({ available: false, error: errMsg })
    }

    // Parse the DomainCheckResult element, extracting attributes independently
    const elemMatch = text.match(/<DomainCheckResult[^/]*\/>/)
    if (!elemMatch) {
      console.error('[check-domain] No DomainCheckResult in response:', text.slice(0, 500))
      return NextResponse.json({ available: false, error: 'Unexpected response format' })
    }

    const elem = elemMatch[0]
    const available = /Available="true"/i.test(elem)

    return NextResponse.json({ available, domain })
  } catch (err: unknown) {
    const e = err as { message?: string }
    return NextResponse.json({ available: false, error: e.message })
  }
}
