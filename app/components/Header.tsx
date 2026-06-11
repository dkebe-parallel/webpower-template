interface HeaderProps {
  businessName: string
  phone: string
  ctaSecondary: string
}

export default function Header({ businessName, phone, ctaSecondary }: HeaderProps) {
  return (
    <>
      <style>{`
        .header { background: color-mix(in srgb, var(--paper) 88%, transparent); backdrop-filter: saturate(160%) blur(14px); border-bottom: 1px solid var(--hair); }
        .header-wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 74px; }
        .brand { display: flex; align-items: center; gap: 12px; font-family: var(--display); font-weight: 700; font-size: 21px; color: var(--navy); }
        .brand-mark { width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; background: var(--navy); color: #fff; box-shadow: var(--shadow-sm); }
        .nav-right { display: flex; align-items: center; gap: 22px; }
        .phone-link { display: flex; align-items: center; gap: 9px; font-weight: 600; color: var(--navy); font-size: 15.5px; text-decoration: none; }
        .btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: var(--display); font-weight: 600; font-size: 16px; padding: 15px 26px; border-radius: 13px; cursor: pointer; border: 0; background: var(--copper); color: #fff; box-shadow: var(--shadow-accent); transition: transform .18s ease, box-shadow .25s ease; text-decoration: none; white-space: nowrap; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 30px 56px -18px color-mix(in srgb, var(--copper) 70%, transparent); }
        @media (max-width: 600px) { .phone-link span { display: none; } .header-wrap { padding: 0 20px; } }
      `}</style>
      <header className="header">
        <div className="header-wrap">
          <a className="brand" href="#">
            <span className="brand-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </span>
            {businessName}
          </a>
          <div className="nav-right">
            <a className="phone-link" href={`tel:${phone.replace(/\s/g, '')}`}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--copper)' }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>{phone}</span>
            </a>
            <a className="btn-primary" href="#contact">{ctaSecondary}</a>
          </div>
        </div>
      </header>
    </>
  )
}
