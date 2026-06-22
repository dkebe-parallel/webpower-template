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

async function checkDomain(domain: string): Promise<{ domain: string; available: boolean | null }> {
  try {
    const res = await fetch(getRdapUrl(domain), {
      headers: { Accept: 'application/rdap+json' },
      signal: AbortSignal.timeout(5000),
    })
    return { domain, available: res.status === 404 }
  } catch {
    return { domain, available: null }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') ?? ''

  const base = slug.replace(/-/g, '').toLowerCase()
  const suggestions = [
    `${base}.fr`,
    `${base}.com`,
    `${slug}.fr`,
    `${slug}.com`,
  ].filter((d, i, arr) => arr.indexOf(d) === i).slice(0, 4)

  const results = await Promise.all(suggestions.map(checkDomain))
  return NextResponse.json({ suggestions: results })
}
