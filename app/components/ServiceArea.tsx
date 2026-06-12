'use client'

import { useEffect, useRef } from 'react'

interface ServiceAreaStat {
  value: string
  label: string
}

interface ServiceAreaProps {
  serviceArea: string
  city: string
  serviceAreaCities?: string[]
  serviceAreaMapCities?: string[]
  serviceAreaStats?: ServiceAreaStat[]
  serviceAreaNote?: string
}

// Fixed angle positions for up to 6 orbit cities
const ORBIT_ANGLES = [-90, -25, 45, 135, 170, -150]
const ORBIT_RADII = [0.38, 0.42, 0.40, 0.38, 0.42, 0.40]

export default function ServiceArea({
  serviceArea,
  city,
  serviceAreaCities = [],
  serviceAreaMapCities = [],
  serviceAreaStats,
  serviceAreaNote,
}: ServiceAreaProps) {
  const radarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const radar = radarRef.current
    if (!radar) return

    const cities = serviceAreaMapCities.slice(0, 6)
    cities.forEach((label, i) => {
      const angle = ORBIT_ANGLES[i] ?? (i * 60 - 90)
      const radius = ORBIT_RADII[i] ?? 0.21
      const rad = (angle * Math.PI) / 180
      const x = 50 + Math.cos(rad) * radius * 100
      const y = 50 + Math.sin(rad) * radius * 100

      const pin = document.createElement('div')
      pin.className = 'radar-pin'
      pin.style.left = x + '%'
      pin.style.top = y + '%'
      radar.appendChild(pin)

      const lab = document.createElement('div')
      lab.className = 'radar-lab'
      lab.textContent = label
      lab.style.left = x + '%'
      lab.style.top = (y - 7) + '%'
      radar.appendChild(lab)
    })
  }, [serviceAreaMapCities])

  const pills = serviceAreaCities.length > 0 ? serviceAreaCities : []

  return (
    <>
      <style>{`
        .zone { background: var(--cream); padding: 120px 0; }
        .zone-wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: .95fr 1.05fr; gap: 64px; align-items: center; }
        .radar { position: relative; width: min(440px,100%); aspect-ratio: 1; margin: 0 auto; }
        .radar-ring { position: absolute; border-radius: 50%; border: 1.5px dashed color-mix(in srgb, var(--navy) 22%, transparent); }
        .radar-ring.r1 { inset: 0; }
        .radar-ring.r2 { inset: 16%; }
        .radar-ring.r3 { inset: 33%; }
        .radar-disc { position: absolute; inset: 33%; border-radius: 50%; background: radial-gradient(circle at 50% 40%, var(--navy-soft), var(--navy)); box-shadow: var(--shadow-lg); border: 1px solid rgba(255,255,255,.1); display: grid; place-items: center; text-align: center; color: #fff; z-index: 2; }
        .radar-disc b { font-family: var(--display); font-size: 18px; display: block; }
        .radar-disc span { font-size: 11.5px; color: rgba(255,255,255,.65); letter-spacing: .04em; }
        .radar-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); z-index: 3; display: flex; align-items: center; justify-content: center; }
        .radar-pin { position: absolute; width: 14px; height: 14px; border-radius: 50%; background: var(--copper); transform: translate(-50%,-50%); box-shadow: 0 0 0 5px color-mix(in srgb, var(--copper) 24%, transparent); }
        .radar-lab { position: absolute; font-size: 11px; font-weight: 600; color: var(--ink-2); background: #fff; padding: 3px 9px; border-radius: 100px; box-shadow: var(--shadow-sm); transform: translate(-50%,-50%); white-space: nowrap; }
        .zone-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: var(--display); font-size: 0.75rem; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; color: var(--copper-deep); opacity: .7; }
        .zone-eyebrow::before { content: ""; width: 26px; height: 2px; background: var(--copper); border-radius: 2px; }
        .zone-copy h2 { font-size: clamp(1.75rem,3.6vw,2.75rem); font-weight: 700; line-height: 1.15; letter-spacing: -.01em; margin-top: 16px; color: var(--navy); }
        .zone-copy > p { color: var(--muted); font-size: 17px; line-height: 1.65; margin-top: 14px; max-width: 460px; }
        .zone-stats { display: grid; gap: 14px; margin: 30px 0 24px; }
        .zstat { background: #fff; border: 1px solid var(--hair); border-radius: 14px; padding: 18px; }
        .zstat b { font-family: var(--display); font-size: 30px; color: var(--navy); display: block; line-height: 1; }
        .zstat span { font-size: 13px; color: var(--muted); }
        .communes { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 18px; }
        .commune { display: inline-flex; align-items: center; gap: 7px; background: #fff; border: 1px solid var(--hair); border-radius: 100px; padding: 8px 15px; font-size: 14px; font-weight: 500; color: var(--ink-2); }
        .commune svg { color: var(--copper); }
        .zone-note { display: flex; align-items: center; gap: 12px; margin-top: 24px; color: var(--ink-2); font-size: 14.5px; background: #fff; border: 1px solid var(--hair); border-left: 3px solid var(--copper); border-radius: 12px; padding: 14px 18px; }
        .zone-note svg { color: var(--copper); flex-shrink: 0; }
        @media (max-width: 1000px) { .zone { padding: 84px 0; } .zone-wrap { grid-template-columns: 1fr; gap: 48px; } }
        @media (max-width: 600px) { .zone-stats { grid-template-columns: 1fr 1fr !important; } .zone-wrap { padding: 0 20px; } }
      `}</style>

      <section className="zone" id="zone">
        <div className="zone-wrap">
          <div className="zone-graphic">
            <div className="radar" ref={radarRef}>
              <div className="radar-ring r1" />
              <div className="radar-ring r2" />
              <div className="radar-ring r3" />
              <div className="radar-disc">
                <div><b>{city}</b><span>siège · centre</span></div>
              </div>
              <div className="radar-center">
                <span className="pulse-orange" />
              </div>
            </div>
          </div>

          <div className="zone-copy">
            <span className="zone-eyebrow">Zone d&apos;intervention</span>
            <h2>{city} &amp; ses communes<br />environnantes</h2>
            <p>Basé à {city}, disponible rapidement dans toute la zone et les communes voisines.</p>

            {serviceAreaStats && serviceAreaStats.length > 0 && (
              <div
                className="zone-stats"
                style={{ gridTemplateColumns: `repeat(${Math.min(serviceAreaStats.length, 3)}, 1fr)` }}
              >
                {serviceAreaStats.map(s => (
                  <div key={s.label} className="zstat">
                    <b>{s.value}</b>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {pills.length > 0 && (
              <div className="communes">
                {pills.map((c, i) => (
                  <span key={c} className="commune">
                    {i === 0 && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/>
                        <circle cx="12" cy="10" r="2.5"/>
                      </svg>
                    )}
                    {c}
                  </span>
                ))}
              </div>
            )}

            {serviceAreaNote && (
              <div className="zone-note">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>
                </svg>
                {serviceAreaNote}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
