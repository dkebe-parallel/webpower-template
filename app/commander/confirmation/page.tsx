export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ slug?: string; domain?: string; prenom?: string; pi?: string }>
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const { slug, domain, prenom, pi } = await searchParams

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--body, Hanken Grotesk, system-ui)', color: '#202020', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image src="/images/logo-webpower.png" alt="WebPower" width={140} height={36} style={{ objectFit: 'contain', height: '36px', width: 'auto' }} />
      </header>

      {/* Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          {/* Green checkmark */}
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <h1 style={{ fontFamily: 'var(--display, Schibsted Grotesk, system-ui)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '12px', color: '#202020' }}>
            Félicitations{prenom ? ` ${prenom}` : ''}&nbsp;!<br />
            <span style={{ color: '#22C55E' }}>Votre commande est confirmée.</span>
          </h1>

          <p style={{ color: '#666', fontSize: '17px', lineHeight: 1.6, marginBottom: '32px' }}>
            Notre équipe vous contactera dans les 24h pour finaliser la mise en ligne de votre site.
          </p>

          {/* Order summary */}
          <div style={{ background: '#F9FAFB', border: '1px solid #E8E8E8', borderRadius: '12px', padding: '24px', textAlign: 'left', marginBottom: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {slug && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                  <span style={{ color: '#999' }}>Site</span>
                  <span style={{ fontWeight: 600 }}>{slug}</span>
                </div>
              )}
              {domain && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                  <span style={{ color: '#999' }}>Domaine</span>
                  <span style={{ fontWeight: 700, color: '#2275FE' }}>{domain}</span>
                </div>
              )}
              {pi && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#999' }}>N° commande</span>
                  <span style={{ fontFamily: 'monospace', color: '#666', fontSize: '12px', wordBreak: 'break-all' }}>{pi}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', paddingTop: '12px', borderTop: '1px solid #E8E8E8' }}>
                <span style={{ color: '#999' }}>Montant</span>
                <span style={{ fontWeight: 800, fontSize: '17px' }}>499 € TTC</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          {slug && (
            <Link
              href={`/demo/${slug}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#2275FE', color: '#fff', borderRadius: '8px', padding: '14px 28px', fontSize: '16px', fontWeight: 700, fontFamily: 'var(--display)', textDecoration: 'none' }}
            >
              Voir votre site démo →
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
