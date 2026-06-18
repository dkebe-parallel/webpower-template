interface DemoBannerProps {
  businessName: string
  slug?: string
}

export default function DemoBanner({ businessName, slug }: DemoBannerProps) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null

  return (
    <>
      <style>{`
        .demo-banner-cta { display: inline-flex; align-items: center; gap: 7px; background: #1db954; color: #04210f; font-weight: 700; font-size: 13.5px; padding: 7px 16px; border-radius: 100px; line-height: 1; white-space: nowrap; transition: background .2s ease; text-decoration: none; }
        .demo-banner-cta:hover { background: #22c55e; }
      `}</style>
      <div style={{ background: '#0c0c0e', color: '#fff', fontSize: '14px', padding: '10px 20px', fontWeight: 500, letterSpacing: '.01em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ color: 'rgba(255,255,255,.82)' }}>
          ✦ Démo gratuite préparée par <strong style={{ color: '#fff' }}>WebPower</strong> pour <strong style={{ color: '#fff' }}>{businessName}</strong> — Pour en devenir propriétaire :
        </span>
        <a href={slug ? `/commander?slug=${slug}` : '#contact'} className="demo-banner-cta">
          Demander l&apos;accès
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </a>
      </div>
    </>
  )
}
