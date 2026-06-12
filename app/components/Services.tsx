import Image from 'next/image'
import { Zap, Droplets, Flame, Wrench, Search, Wind, LucideIcon } from 'lucide-react'
import { ServiceItem } from '@/lib/types'
import ElegantPlaceholder from './ElegantPlaceholder'

const iconMap: Record<string, LucideIcon> = {
  zap: Zap, droplets: Droplets, flame: Flame, wrench: Wrench, search: Search, wind: Wind,
}

const defaultTags: Record<string, string> = {
  zap: 'Urgence & réactivité',
  droplets: 'Pose & finitions',
  flame: 'Chauffage',
  wrench: 'Rénovation',
  search: 'Diagnostic',
  wind: 'Ventilation',
}

interface ServicesProps {
  services: ServiceItem[]
  valueProp: string
  servicesIntro?: string
}

function trunc(str: string, max: number): string {
  if (str.length <= max) return str
  const cut = str.lastIndexOf(' ', max)
  return (cut > 0 ? str.slice(0, cut) : str.slice(0, max)) + '…'
}

export default function Services({ services, valueProp, servicesIntro }: ServicesProps) {
  const all = services.slice(0, 5)
  const featServices = all.slice(0, 2)
  const iconServices = all.slice(2)
  const introText = trunc(servicesIntro ?? valueProp, 100)

  return (
    <>
      <style>{`
        .services-section { background: var(--paper); padding: 120px 0; }
        .svc-wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 32px; }
        .svc-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 30px; flex-wrap: wrap; margin-bottom: 54px; }
        .eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: var(--display); font-size: 0.75rem; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; color: var(--copper-deep); opacity: .7; }
        .eyebrow::before { content: ""; width: 26px; height: 2px; background: var(--copper); border-radius: 2px; }
        .svc-head h2 { font-size: clamp(1.75rem,3vw,2.75rem); font-weight: 700; line-height: 1.15; letter-spacing: -.01em; margin: 18px 0 0; color: var(--navy); }
        .bento { display: grid; grid-template-columns: repeat(6,1fr); gap: 22px; }

        /* base card */
        .scard { position: relative; background: var(--card); border-radius: var(--radius); border: 1px solid var(--hair); box-shadow: var(--shadow-md); padding: 30px; overflow: hidden; transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; display: flex; flex-direction: column; }
        .scard:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(28,43,74,.12); border-color: var(--copper); }
        .scard::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 3px; background: linear-gradient(90deg,var(--copper),var(--copper-soft)); transform: scaleX(0); transform-origin: left; transition: transform .35s ease; }
        .scard:hover::before { transform: scaleX(1); }
        .scard .num { position: absolute; top: 24px; right: 26px; font-family: var(--display); font-weight: 700; font-size: 14px; color: var(--hair); }
        .scard .sic { width: 54px; height: 54px; border-radius: 14px; display: grid; place-items: center; background: var(--copper-tint); color: var(--copper-deep); margin-bottom: auto; }
        .scard h3 { font-size: 21px; margin: 22px 0 0; color: var(--navy); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .scard p { color: var(--muted); font-size: 15px; margin: 9px 0 0; }
        .scard.span2 { grid-column: span 2; }
        .scard.span3 { grid-column: span 3; }

        /* featured photo card */
        .scard.feat { grid-column: span 3; color: #fff; padding: 0; min-height: 330px; border: 1px solid rgba(200,121,65,.3); box-shadow: var(--shadow-lg); background: linear-gradient(135deg,rgba(28,43,74,.95) 0%,rgba(28,43,74,.85) 100%); }
        .scard.feat .ph { position: absolute; inset: 0; overflow: hidden; border-radius: var(--radius); }
        .scard.feat .ph img { width: 100%; height: 100%; object-fit: cover; }
        .scard.feat .ph::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg,rgba(15,26,46,.15) 0%,rgba(15,26,46,.5) 45%,rgba(15,26,46,.92) 100%); }
        .scard.feat .ph::before { content: ""; position: absolute; inset: 0; background: var(--copper); opacity: .05; pointer-events: none; z-index: 1; }
        .scard.feat .fc { position: relative; margin-top: auto; padding: 32px; z-index: 1; }
        .scard.feat .tag { display: inline-flex; align-items: center; gap: 8px; background: var(--copper); color: #fff; font-family: var(--display); font-weight: 600; font-size: 12.5px; letter-spacing: .04em; padding: 7px 13px; border-radius: 100px; text-transform: uppercase; }
        .scard.feat .sic { background: rgba(200,121,65,.15); color: var(--copper); }
        .scard.feat h3 { font-size: 27px; margin-top: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .scard.feat p { color: rgba(255,255,255,.82); font-size: 15.5px; }
        .scard.feat::before { display: none; }

        @media (max-width: 1000px) {
          .services-section { padding: 84px 0; }
          .bento { grid-template-columns: repeat(2,1fr); }
          .scard.span3, .scard.feat, .scard.span2 { grid-column: span 1; }
        }
        @media (max-width: 600px) {
          .bento { grid-template-columns: 1fr; }
          .svc-wrap { padding: 0 20px; }
        }
      `}</style>

      <section className="services-section" id="services">
        <div className="svc-wrap">
          <div className="svc-head">
            <div>
              <span className="eyebrow">Nos prestations</span>
              <h2>Une expertise complète,<br />du dépannage à la rénovation</h2>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '17px', maxWidth: '300px', margin: 0 }}>{introText}</p>
          </div>

          <div className="bento">
            {/* Featured photo cards — first 2 services */}
            {featServices.map((service) => {
              const tagLabel = service.tag ?? defaultTags[service.icon] ?? 'Prestation'
              const desc = trunc(service.desc, 130)
              return (
                <article key={service.icon} className="scard feat">
                  <div className="ph">
                    {service.image ? (
                      <Image src={service.image} alt={service.title} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <ElegantPlaceholder type="service" />
                    )}
                  </div>
                  <div className="fc">
                    <span className="tag">
                      {service.icon === 'zap' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                      )}
                      {tagLabel}
                    </span>
                    <h3>{service.title}</h3>
                    <p>{desc}</p>
                  </div>
                </article>
              )
            })}

            {/* Icon cards — remaining services */}
            {iconServices.map((service, i) => {
              const Icon = iconMap[service.icon] ?? Wrench
              const desc = trunc(service.desc, 115)
              return (
                <article key={service.icon} className="scard span2">
                  <span className="num">{String(featServices.length + i + 1).padStart(2, '0')}</span>
                  <span className="sic"><Icon size={26} /></span>
                  <h3>{service.title}</h3>
                  <p>{desc}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
