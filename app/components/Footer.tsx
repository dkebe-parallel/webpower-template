interface FooterProps {
  businessName: string
  phone: string
  email: string
  address: string
  mapsUrl: string
  about: string
  rating: number | null
  reviewsCount: number | null
  services: Array<{ title: string }>
  demoMode: boolean
}

export default function Footer({
  businessName, phone, email, address, mapsUrl, about,
  rating, reviewsCount, services, demoMode,
}: FooterProps) {
  return (
    <>
      <style>{`
        .footer { background: var(--navy-900); color: rgba(255,255,255,.7); padding: 72px 0 32px; }
        .foot-wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 32px; }
        .foot-grid { display: grid; grid-template-columns: 1.7fr 1fr 1fr 1.3fr; gap: 48px; }
        .foot-brand { display: flex; align-items: center; gap: 12px; font-family: var(--display); font-weight: 700; font-size: 19px; color: #fff; }
        .foot-brand-mark { width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; background: var(--navy-soft); color: #fff; }
        .foot-brand-col p { font-size: 14.5px; line-height: 1.65; color: rgba(255,255,255,.55); margin: 18px 0 0; max-width: 340px; }
        .foot-rating { display: flex; align-items: center; gap: 10px; margin-top: 18px; font-size: 13.5px; color: rgba(255,255,255,.6); }
        .foot-rating .stars { color: var(--copper-soft); letter-spacing: 2px; font-size: 14px; }
        .foot-col h4 { font-family: var(--display); font-size: 13px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--copper-soft); margin: 0 0 18px; }
        .foot-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .foot-col a { font-size: 14.5px; color: rgba(255,255,255,.66); transition: color .18s ease, transform .18s ease; display: inline-flex; align-items: flex-start; gap: 10px; text-decoration: none; }
        .foot-col a:hover { color: #fff; }
        .foot-col:not(.foot-contact) a:hover { transform: translateX(3px); }
        .foot-col:not(.foot-contact) a { white-space: nowrap; }
        .foot-contact svg { width: 17px; height: 17px; color: var(--copper-soft); flex-shrink: 0; margin-top: 2px; }
        .foot-contact a { line-height: 1.5; }
        .foot-maps { color: var(--copper-soft) !important; font-weight: 600; }
        .foot-bottom { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 56px; padding-top: 26px; border-top: 1px solid rgba(255,255,255,.08); }
        .foot-bottom small { font-size: 13px; color: rgba(255,255,255,.42); }
        .foot-legal { display: flex; gap: 24px; }
        .foot-legal a { font-size: 13px; color: rgba(255,255,255,.42); transition: color .18s ease; text-decoration: none; }
        .foot-legal a:hover { color: #fff; }
        .disclaimer { text-align: center; padding: 16px; background: #0c0c0e; color: #fff; font-size: 13px; font-weight: 500; letter-spacing: .01em; }
        @media (max-width: 1000px) { .foot-grid { grid-template-columns: 1fr 1fr; gap: 36px; } .foot-brand-col { grid-column: 1 / -1; } }
        @media (max-width: 600px) { .foot-grid { grid-template-columns: 1fr; gap: 32px; } .foot-wrap { padding: 0 20px; } }
      `}</style>

      <footer className="footer">
        <div className="foot-wrap">
          <div className="foot-grid">
            <div className="foot-brand-col">
              <span className="foot-brand">
                <span className="foot-brand-mark">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </span>
                {businessName}
              </span>
              <p>{about}</p>
              {rating && (
                <div className="foot-rating">
                  <span className="stars">{'★'.repeat(Math.round(rating))}</span>
                  <span><strong style={{ color: '#fff' }}>{rating}/5</strong> · {reviewsCount} avis Google</span>
                </div>
              )}
            </div>

            <div className="foot-col">
              <h4>Nos prestations</h4>
              <ul>
                {services.map(s => (
                  <li key={s.title}><a href="#services">{s.title}</a></li>
                ))}
              </ul>
            </div>

            <div className="foot-col">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#services">Nos prestations</a></li>
                <li><a href="#pourquoi">Pourquoi nous</a></li>
                <li><a href="#zone">Zone d&apos;intervention</a></li>
                <li><a href="#avis">Avis clients</a></li>
                <li><a href="#contact">Demander un devis</a></li>
              </ul>
            </div>

            <div className="foot-col foot-contact">
              <h4>Coordonnées</h4>
              <ul>
                <li>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                    <span>{address}</span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${phone.replace(/\s/g, '')}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>{phone}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${email}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
                    <span>{email}</span>
                  </a>
                </li>
                <li>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="foot-maps">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                    Voir sur Google Maps →
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="foot-bottom">
            <small>© {new Date().getFullYear()} {businessName} — Site réalisé par WebPower</small>
            <div className="foot-legal">
              <a href="#">Mentions légales</a>
              <a href="#">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>

      {demoMode && (
        <div className="disclaimer">
          ✦ Ce site est une démo préparée par WebPower. Données non contractuelles.
        </div>
      )}
    </>
  )
}
