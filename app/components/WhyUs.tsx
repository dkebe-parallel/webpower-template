import Image from 'next/image'
import { WhyUsItem } from '@/lib/types'
import ElegantPlaceholder from './ElegantPlaceholder'

interface WhyUsProps {
  items: Array<WhyUsItem | string>
  whyUsBadge?: { value: string; label: string } | null
  whyUsImage?: string
}

function normalizeItems(items: Array<WhyUsItem | string>): WhyUsItem[] {
  return items.map(item => {
    if (typeof item === 'string') {
      const colonIdx = item.indexOf(':')
      if (colonIdx > 0 && colonIdx < 40) {
        return { title: item.slice(0, colonIdx).trim(), desc: item.slice(colonIdx + 1).trim() }
      }
      const words = item.split(' ')
      return { title: words.slice(0, 3).join(' '), desc: item }
    }
    return item
  })
}

function trunc(str: string, max: number): string {
  if (str.length <= max) return str
  const cut = str.lastIndexOf(' ', max)
  return (cut > 0 ? str.slice(0, cut) : str.slice(0, max)) + '…'
}

const featureIcons = [
  <svg key="shield" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"/><path d="m9 12 2 2 4-4"/></svg>,
  <svg key="clock" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  <svg key="doc" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/></svg>,
  <svg key="medal" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 15-2 5 2-1 2 1-2-5z"/><circle cx="12" cy="8" r="6"/></svg>,
]

export default function WhyUs({ items, whyUsBadge, whyUsImage }: WhyUsProps) {
  const normalized = normalizeItems(items).slice(0, 4)

  return (
    <>
      <style>{`
        .why { background: var(--navy); color: #fff; position: relative; overflow: hidden; padding: 120px 0; }
        .why::before { content: ""; position: absolute; inset: 0; background: radial-gradient(700px 500px at 90% 0%, rgba(200,121,65,.18), transparent 55%); pointer-events: none; }
        .why-wrap { position: relative; max-width: var(--maxw); margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .why-photo { position: relative; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); aspect-ratio: 4/4.6; border: 1px solid rgba(255,255,255,.12); }
        .why-photo img { width: 100%; height: 100%; object-fit: cover; }
        .why-stat { position: absolute; right: -22px; bottom: 34px; background: var(--copper); color: #fff; border-radius: 18px; padding: 22px 26px; box-shadow: var(--shadow-lg); }
        .why-stat b { font-family: var(--display); font-size: 46px; line-height: 1; display: block; }
        .why-stat span { font-size: 14px; color: rgba(255,255,255,.9); }
        .why-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: var(--display); font-size: 0.75rem; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; color: var(--copper-soft); opacity: .7; }
        .why-eyebrow::before { content: ""; width: 26px; height: 2px; background: var(--copper); border-radius: 2px; }
        .why h2 { font-size: clamp(1.75rem,4vw,2.75rem); font-weight: 700; line-height: 1.15; letter-spacing: -.01em; margin-top: 18px; }
        .why-lede { font-size: 19px; line-height: 1.65; letter-spacing: .01em; color: rgba(255,255,255,.74); margin-top: 16px; }
        .why-feats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 34px; }
        .why-feat { display: flex; gap: 14px; align-items: flex-start; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); border-radius: 12px; padding: 12px 16px; backdrop-filter: blur(4px); transition: background .2s ease, border-color .2s ease; }
        .why-feat:hover { background: rgba(200,121,65,.15); border-color: rgba(200,121,65,.4); }
        .why-feat .ic { width: 40px; height: 40px; border-radius: 11px; display: grid; place-items: center; background: rgba(200,121,65,.18); color: var(--copper-soft); font-weight: 700; flex-shrink: 0; }
        .why-feat b { font-family: var(--display); font-size: 15.5px; display: block; }
        .why-feat span { font-size: 13.5px; color: rgba(255,255,255,.6); }
        .why-cta { margin-top: 32px; }
        .why-cta a { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: var(--display); font-weight: 600; font-size: 16px; padding: 15px 26px; border-radius: 13px; background: var(--copper); color: #fff; box-shadow: var(--shadow-accent); transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; text-decoration: none; }
        .why-cta a:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,121,65,.4); filter: brightness(1.05); }
        .why-cta a:active { transform: translateY(0); }
        @media (max-width: 1000px) { .why { padding: 84px 0; } .why-wrap { grid-template-columns: 1fr; gap: 48px; } }
        @media (max-width: 600px) { .why-feats { grid-template-columns: 1fr; } .why-wrap { padding: 0 20px; } }
      `}</style>

      <section className="why" id="pourquoi">
        <div className="why-wrap">
          <div className="why-photo">
            {whyUsImage ? (
              <Image src={whyUsImage} alt="Artisan à domicile" fill style={{ objectFit: 'cover' }} />
            ) : (
              <ElegantPlaceholder type="whyus" />
            )}
            {whyUsBadge && (
              <div className="why-stat">
                <b>{whyUsBadge.value}</b>
                <span>{whyUsBadge.label}</span>
              </div>
            )}
          </div>

          <div className="why-copy">
            <span className="why-eyebrow">Pourquoi nous choisir</span>
            <h2>L&apos;exigence d&apos;un<br />artisan, la fiabilité<br />d&apos;une équipe</h2>
            <p className="why-lede">
              Chaque intervention est réalisée avec soin, un devis clair et un engagement tenu. La tranquillité d&apos;esprit, sans mauvaise surprise.
            </p>
            <div className="why-feats">
              {normalized.map((item, i) => (
                <div key={i} className="why-feat">
                  <span className="ic">{featureIcons[i % featureIcons.length]}</span>
                  <div>
                    <b>{item.title}</b>
                    <span>{trunc(item.desc, 60)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="why-cta">
              <a href="#contact">Obtenir mon devis gratuit</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
