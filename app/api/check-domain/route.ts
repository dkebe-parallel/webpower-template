import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

function getRdapUrl(domain: string): string {
  const tld = domain.split('.').pop()?.toLowerCase() ?? ''
  switch (tld) {
    case 'fr': return `https://rdap.nic.fr/domain/${domain}`
    case 'com': return `https://rdap.verisign.com/com/v1/domain/${domain}`
    case 'net': return `https://rdap.verisign.com/net/v1/domain/${domain}`
    case 'org': return `https://rdap.publicinterestregistry.org/rdap/domain/${domain}`
    default: return `https://rdap.org/domain/${domain}`
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')?.toLowerCase().trim()
  if (!domain || !domain.includes('.')) {
    return NextResponse.json({ available: false, error: 'Invalid domain' })
  }

  try {
    const res = await fetch(getRdapUrl(domain), {
      headers: { Accept: 'application/rdap+json' },
      signal: AbortSignal.timeout(5000),
    })
    const available = res.status === 404
    return NextResponse.json({ available, domain })
  } catch {
    return NextResponse.json({ available: null, domain })
  }
}
