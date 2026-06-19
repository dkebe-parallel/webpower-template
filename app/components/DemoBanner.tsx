'use client'

import { useState, useEffect } from 'react'

interface DemoBannerProps {
  businessName: string
  slug?: string
}

export default function DemoBanner({ businessName, slug }: DemoBannerProps) {
  const [sold, setSold] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/check-sold?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => { if (d.sold) setSold(true) })
      .catch(() => {})
  }, [slug])

  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null

  return (
    <>
      <style>{`
        .demo-banner-cta { display: inline-flex; align-items: center; gap: 7px; background: #1db954; color: #04210f; font-weight: 700; font-size: 13.5px; padding: 7px 16px; border-radius: 100px; line-height: 1; white-space: nowrap; transition: background .2s ease; text-decoration: none; }
        .demo-banner-cta:hover { background: #22c55e; }
        .demo-banner-sold { display: inline-flex; align-items: center; gap: 7px; background: #F97316; color: #fff; font-weight: 700; font-size: 13.5px; padding: 7px 16px; border-radius: 100px; line-height: 1; white-space: nowrap; cursor: default; pointer-events: none; }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(1.4); } }
        .sold-dot { width: 6px; height: 6px; border-radius: 50%; background: #FED7AA; animation: pulse-dot 1.4s ease-in-out infinite; flex-shrink: 0; }
      `}</style>
      <div style={{ background: '#0c0c0e', color: '#fff', fontSize: '14px', padding: '10px 20px', fontWeight: 500, letterSpacing: '.01em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ color: 'rgba(255,255,255,.82)' }}>
          ✦ Démo gratuite préparée par <strong style={{ color: '#fff' }}>WebPower</strong> pour <strong style={{ color: '#fff' }}>{businessName}</strong> — Pour en devenir propriétaire :
        </span>
        {sold ? (
          <span className="demo-banner-sold">
            <span className="sold-dot" />
            En production...
          </span>
        ) : (
          <a href={slug ? `/commander?slug=${slug}` : '#contact'} className="demo-banner-cta">
            Demander l&apos;accès
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </a>
        )}
      </div>
    </>
  )
}
