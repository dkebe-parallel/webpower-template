import Image from 'next/image'
import { BusinessData, HeroStat, ReassuranceItem } from '@/lib/types'
import ElegantPlaceholder from './ElegantPlaceholder'

interface HeroProps {
  business: BusinessData['business']
  content: Pick<BusinessData['content'], 'hero_title' | 'hero_subtitle' | 'cta_primary' | 'cta_secondary'>
  heroStats?: HeroStat[]
  certifications?: string[]
  badgeHighlight?: string
  heroImage?: string
  reassuranceItems?: ReassuranceItem[]
  variant: BusinessData['theme']['hero_variant']
}

const DEFAULT_REASSURANCE: ReassuranceItem[] = [
  { title: 'Devis gratuit & transparent', subtitle: 'Sans surprise, validé avant travaux' },
  { title: 'Intervention rapide', subtitle: 'Dans votre secteur' },
  { title: 'Artisan local', subtitle: 'Disponible pour vous' },
]

function padStats(stats: HeroStat[], rating: number | null, reviewsCount: number | null): HeroStat[] {
  const result = [...stats]
  if (result.length < 3 && rating) {
    result.push({ value: `${rating}/5`, label: `${reviewsCount} avis Google` })
  }
  if (result.length < 3) result.push({ value: 'Devis', label: 'gratuit' })
  return result.slice(0, 3)
}

function truncBadge(s: string): string {
  return s.length > 20 ? s.slice(0, 19) + '…' : s
}

export default function Hero({
  business, content, heroStats = [], certifications = [],
  badgeHighlight, heroImage, reassuranceItems,
}: HeroProps) {
  const { phone, city, rating, reviews_count } = business

  const stats = padStats(heroStats, rating, reviews_count)

  // Badge: always show. Priority: RGE cert → other cert → highlight → rating fallback
  let badgeText: string
  if (certifications.includes('RGE')) {
    badgeText = 'Certifié RGE'
  } else if (certifications.length > 0) {
    badgeText = truncBadge(`Certifié ${certifications[0]}`)
  } else if (badgeHighlight) {
    badgeText = truncBadge(badgeHighlight)
  } else if (rating) {
    badgeText = `${rating}/5 sur Google`
  } else {
    badgeText = 'Artisan de confiance'
  }

  const trust = reassuranceItems && reassuranceItems.length > 0
    ? [...reassuranceItems, ...DEFAULT_REASSURANCE].slice(0, 3)
    : DEFAULT_REASSURANCE

  return (
    <>
      <style>{`
        .hero { position: relative; background: var(--navy); color: #fff; overflow: hidden; }
        .hero::before {
          content: "";
          position: absolute; inset: 0;
          background:
            radial-gradient(900px 500px at 12% -10%, rgba(200,121,65,.22), transparent 60%),
            radial-gradient(700px 600px at 100% 120%, rgba(36,58,94,.9), transparent 60%);
          pointer-events: none;
        }
        .hero-wrap { position: relative; max-width: var(--maxw); margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: 1.05fr .95fr; gap: 60px; align-items: center; padding-top: 96px; padding-bottom: 96px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 9px; background: rgba(255,255,255,.08); border: 1px solid var(--navy-line); padding: 8px 15px; border-radius: 100px; font-size: 13.5px; font-weight: 600; color: #fff; letter-spacing: .02em; white-space: nowrap; }
        .hero h1 { font-size: clamp(2.5rem,5vw,4rem); font-weight: 800; line-height: 1.1; letter-spacing: -.02em; margin: 24px 0 0; }
        .hero h1 em { font-style: normal; color: var(--copper-soft); }
        .hero-lede { font-size: 20px; line-height: 1.65; letter-spacing: .01em; color: rgba(255,255,255,.78); margin: 22px 0 0; max-width: 520px; }
        .hero-cta { display: flex; gap: 14px; margin-top: 34px; flex-wrap: wrap; }
        .btn-copper { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: var(--display); font-weight: 600; font-size: 16px; padding: 15px 26px; border-radius: 13px; background: var(--copper); color: #fff; box-shadow: var(--shadow-accent); transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; text-decoration: none; white-space: nowrap; }
        .btn-copper:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,121,65,.4); filter: brightness(1.05); }
        .btn-copper:active { transform: translateY(0); }
        .btn-ghost { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: var(--display); font-weight: 600; font-size: 16px; padding: 15px 26px; border-radius: 13px; background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,.35); transition: border-color .18s ease, background .2s ease; text-decoration: none; white-space: nowrap; }
        .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,.08); }
        .hero-meta { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 0; margin-top: 38px; align-items: center; }
        .hero-meta .m { display: flex; flex-direction: column; gap: 2px; }
        .hero-meta .m b { font-family: var(--display); font-size: 1.75rem; font-weight: 800; letter-spacing: -.03em; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hero-meta .m span { font-size: 13.5px; color: rgba(255,255,255,.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hero-meta .sep { width: 1px; height: 36px; background: var(--navy-line); margin: 0 20px; }
        .hero-visual { position: relative; }
        .hero-photo { border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); aspect-ratio: 4/4.4; border: 1px solid rgba(255,255,255,.12); position: relative; background: var(--navy-soft); }
        .hero-photo img { width: 100%; height: 100%; object-fit: cover; }
        .hero-rating { position: absolute; left: -26px; bottom: 34px; background: #fff; color: var(--ink); border-radius: 16px; padding: 16px 20px; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 14px; }
        .hero-rating .stars { color: var(--copper); letter-spacing: 2px; font-size: 16px; }
        .hero-rating b { font-family: var(--display); font-size: 22px; display: block; line-height: 1; }
        .hero-rating small { color: var(--muted); font-size: 12.5px; }
        .hero-float { position: absolute; right: -18px; top: 30px; background: rgba(255,255,255,.95); color: var(--ink); border-radius: 14px; padding: 13px 16px; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 11px; font-weight: 600; font-size: 14px; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hero-float-ic { width: 34px; height: 34px; min-width: 34px; border-radius: 10px; background: var(--copper-tint); color: var(--copper-deep); display: grid; place-items: center; }

        /* trust strip */
        .trust { background: var(--navy-deep); border-top: 1px solid var(--navy-line); }
        .trust-wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; padding-top: 28px; padding-bottom: 28px; }
        .trust-item { display: flex; align-items: center; gap: 14px; color: #fff; padding: 6px 8px; }
        .trust-ic { width: 46px; height: 46px; min-width: 46px; border-radius: 12px; display: grid; place-items: center; background: rgba(200,121,65,.16); color: var(--copper-soft); flex-shrink: 0; }
        .trust-item b { font-family: var(--display); font-size: 16px; display: block; }
        .trust-item span { font-size: 13.5px; color: rgba(255,255,255,.62); }

        @media (max-width: 1000px) {
          .hero-wrap { grid-template-columns: 1fr; gap: 48px; padding-top: 64px; padding-bottom: 64px; }
          .hero-visual { max-width: 460px; }
          .trust-wrap { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .hero-wrap { padding: 48px 20px; }
          .hero-meta { gap: 0; }
          .hero-meta .sep { margin: 0 12px; }
          .trust-wrap { padding: 20px; }
        }
      `}</style>

      <section className="hero">
        <div className="hero-wrap">
          <div className="hero-copy">
            <span className="hero-badge">
              <span className="pulse-green" />
              Disponible · Intervention rapide
            </span>
            <h1>{content.hero_title}</h1>
            <p className="hero-lede">{content.hero_subtitle}</p>
            <div className="hero-cta">
              <a className="btn-copper" href={`tel:${phone.replace(/\s/g, '')}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {content.cta_primary}
              </a>
              <a className="btn-ghost" href="#contact">{content.cta_secondary}</a>
            </div>

            {/* Always exactly 3 stats */}
            <div className="hero-meta">
              {stats.map((s, i) => (
                <>
                  {i > 0 && <div key={`sep-${i}`} className="sep" />}
                  <div key={`stat-${i}`} className="m">
                    <b>{s.value}</b>
                    <span>{s.label}</span>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-photo">
              {heroImage ? (
                <Image src={heroImage} alt={`Artisan — ${city}`} fill style={{ objectFit: 'cover' }} priority />
              ) : (
                <ElegantPlaceholder type="hero" />
              )}
            </div>

            {/* Always present badge */}
            <div className="hero-float">
              <span className="hero-float-ic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"/><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9z"/>
                </svg>
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {badgeText}
              </span>
            </div>

            {rating && (
              <div className="hero-rating">
                <div>
                  <div className="stars">{'★'.repeat(Math.round(rating))}</div>
                  <small>{reviews_count} avis vérifiés</small>
                </div>
                <div>
                  <b>{rating}</b>
                  <small>sur Google</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reassurance band — always 3 items */}
      <div className="trust">
        <div className="trust-wrap">
          {trust.map((item, i) => (
            <div key={i} className="trust-item">
              <span className="trust-ic">
                {i === 0 && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/>
                  </svg>
                )}
                {i === 1 && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
                  </svg>
                )}
                {i === 2 && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"/>
                  </svg>
                )}
              </span>
              <div>
                <b>{item.title}</b>
                <span>{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
