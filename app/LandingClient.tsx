'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

// ── Sticky Header ─────────────────────────────────────────────────────────────

export function StickyHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { label: 'Démo Gratuite', href: '#demo' },
    { label: 'Comment Ça Marche', href: '#comment-ca-marche' },
    { label: 'Nos Métiers', href: '#nos-metiers' },
    { label: 'Prix Unique', href: '#tarif' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50, background: '#fff',
      borderBottom: '1px solid #E8E8E8',
      boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.07)' : 'none',
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/logo-webpower.png" alt="WebPower" width={140} height={36} style={{ objectFit: 'contain' }} priority />
        </a>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="landing-desktop-nav">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} style={{ fontSize: 14, color: '#202020', fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#2275FE')}
              onMouseLeave={e => (e.currentTarget.style.color = '#202020')}
            >{l.label}</a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="#demo" className="landing-desktop-nav" style={{
            background: '#2275FE', color: '#fff', borderRadius: 8, padding: '10px 20px',
            fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
          }}>Obtenir mon site démo</a>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} className="landing-mobile-nav"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            aria-label="Menu">
            <div style={{ width: 22, height: 2, background: '#202020', marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: '#202020', marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: '#202020' }} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="landing-mobile-nav" style={{ borderTop: '1px solid #E8E8E8', background: '#fff', padding: '12px 24px 20px' }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '12px 0', fontSize: 16, color: '#202020', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>
              {l.label}
            </a>
          ))}
          <a href="#demo" onClick={() => setMenuOpen(false)} style={{
            display: 'block', marginTop: 16, background: '#2275FE', color: '#fff',
            borderRadius: 8, padding: '12px 20px', textAlign: 'center', fontWeight: 600,
          }}>Obtenir mon site démo</a>
        </div>
      )}
    </header>
  )
}

// ── Stats Counter ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1600, started: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!started) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setValue(target)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])
  return value
}

export function StatsSection() {
  const stats = [
    { value: 500, suffix: '+', label: 'Sites réalisés pour les artisans', pre: '' },
    { value: 48, suffix: 'h', label: 'Temps moyen de livraison', pre: '' },
    { value: 490, suffix: '€', label: 'Tout compris, sans surprise', pre: '' },
    { value: 99, suffix: '%', label: 'Clients satisfaits', pre: '' },
  ]

  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} style={{ background: '#2275FE', color: '#fff', padding: '56px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
        {stats.map((s) => (
          <AnimatedStat key={s.label} value={s.value} prefix={s.pre} suffix={s.suffix} label={s.label} started={started} />
        ))}
      </div>
    </section>
  )
}

function AnimatedStat({ value, prefix, suffix, label, started }: { value: number; prefix: string; suffix: string; label: string; started: boolean }) {
  const count = useCountUp(value, 1600, started)
  return (
    <div style={{ textAlign: 'center', flex: 1, minWidth: 200, padding: '8px 16px' }}>
      <div style={{ fontSize: 52, fontWeight: 700, fontFamily: 'var(--display)', lineHeight: 1, marginBottom: 8 }}>
        {prefix}{count}{suffix}
      </div>
      <div style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.4 }}>{label}</div>
    </div>
  )
}

// ── Mini Google Maps card ─────────────────────────────────────────────────────

function MiniGmapsCard({ highlight }: { highlight: 'partager' | 'siteweb' }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.13)',
      width: 180, fontFamily: '-apple-system, Arial, sans-serif', fontSize: 10,
      border: '1px solid #e8e8e8', overflow: 'hidden',
    }}>
      <div style={{ padding: '8px 10px 8px' }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: '#202020', marginBottom: 2 }}>PLOMBIER PARISIEN</div>
        <div style={{ color: '#888', fontSize: 9, marginBottom: 8 }}>4.9 ★ (458) · Plombier</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {/* Site web */}
          <div style={{
            borderRadius: 12, padding: '4px 8px', fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap',
            background: highlight === 'siteweb' ? '#2275FE' : '#f0f4ff',
            color: highlight === 'siteweb' ? '#fff' : '#1a73e8',
            border: highlight === 'siteweb' ? '1.5px solid #2275FE' : '1px solid #d0d9f0',
            animation: highlight === 'siteweb' ? 'siteWebPulse 2.4s ease-in-out infinite' : 'none',
          }}>🌐 Site web</div>
          <div style={{ background: '#f0f4ff', border: '1px solid #d0d9f0', borderRadius: 12, padding: '4px 8px', fontSize: 9, fontWeight: 500, color: '#1a73e8', whiteSpace: 'nowrap' }}>🧭 Itinéraire</div>
          {/* Partager */}
          <div style={{
            borderRadius: 12, padding: '4px 8px', fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap',
            background: highlight === 'partager' ? '#FF6D00' : '#f0f4ff',
            color: highlight === 'partager' ? '#fff' : '#1a73e8',
            border: highlight === 'partager' ? '1.5px solid #FF6D00' : '1px solid #d0d9f0',
            animation: highlight === 'partager' ? 'partagerBounce 1.4s ease-in-out infinite' : 'none',
          }}>↗ Partager</div>
          <div style={{ background: '#f0f4ff', border: '1px solid #d0d9f0', borderRadius: 12, padding: '4px 8px', fontSize: 9, fontWeight: 500, color: '#1a73e8', whiteSpace: 'nowrap' }}>📞 Appeler</div>
        </div>
      </div>
    </div>
  )
}

// ── Step icon illustrations ───────────────────────────────────────────────────

export function StepIcon({ step }: { step: 1 | 2 | 3 }) {
  return (
    <>
      <style>{`
        @keyframes partagerBounce {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(1.15); box-shadow: 0 0 0 4px rgba(255,109,0,0.25); }
          60% { transform: scale(1.08); }
        }
        @keyframes siteWebPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34,117,254,0.45); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 6px rgba(34,117,254,0); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
      `}</style>

      {step === 1 && (
        <div style={{
          height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <MiniGmapsCard highlight="partager" />
        </div>
      )}

      {step === 2 && (
        <div style={{
          height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <svg viewBox="0 0 160 110" width="160" height="110" xmlns="http://www.w3.org/2000/svg">
            {/* Browser window chrome */}
            <rect x="4" y="4" width="152" height="102" rx="8" fill="#f0f0f0" stroke="#ddd" strokeWidth="1.5"/>
            {/* Title bar */}
            <rect x="4" y="4" width="152" height="22" rx="8" fill="#e0e0e0"/>
            <rect x="4" y="18" width="152" height="8" fill="#e0e0e0"/>
            {/* Traffic lights */}
            <circle cx="17" cy="15" r="4" fill="#FF5F57"/>
            <circle cx="29" cy="15" r="4" fill="#FEBC2E"/>
            <circle cx="41" cy="15" r="4" fill="#28C840"/>
            {/* URL bar */}
            <rect x="52" y="10" width="86" height="10" rx="5" fill="#fff" stroke="#ccc" strokeWidth="1"/>
            <text x="60" y="18" fontSize="6" fill="#888" fontFamily="monospace">yourwebpower.com</text>
            {/* Editor background */}
            <rect x="4" y="26" width="152" height="80" rx="0" fill="#1a1a2e"/>
            <rect x="4" y="74" width="152" height="32" rx="0" fill="#1a1a2e"/>
            <rect x="4" y="98" width="152" height="8" rx="0" ry="0" fill="#1a1a2e"/>
            <rect x="4" y="100" width="152" height="6" rx="4" fill="#1a1a2e"/>
            {/* Line numbers */}
            <rect x="4" y="26" width="20" height="80" fill="#16162a"/>
            <text x="11" y="38" fontSize="6" fill="#555" fontFamily="monospace">1</text>
            <text x="11" y="48" fontSize="6" fill="#555" fontFamily="monospace">2</text>
            <text x="11" y="58" fontSize="6" fill="#555" fontFamily="monospace">3</text>
            <text x="11" y="68" fontSize="6" fill="#555" fontFamily="monospace">4</text>
            <text x="11" y="78" fontSize="6" fill="#555" fontFamily="monospace">5</text>
            <text x="11" y="88" fontSize="6" fill="#555" fontFamily="monospace">6</text>
            {/* Code lines — colored syntax */}
            <rect x="28" y="33" width="22" height="4" rx="2" fill="#c792ea" opacity="0.9"/>
            <rect x="53" y="33" width="36" height="4" rx="2" fill="#2275FE" opacity="0.9"/>
            <rect x="32" y="43" width="14" height="4" rx="2" fill="#64d9a0" opacity="0.85"/>
            <rect x="49" y="43" width="8" height="4" rx="2" fill="#fff" opacity="0.6"/>
            <rect x="60" y="43" width="40" height="4" rx="2" fill="#f9a825" opacity="0.85"/>
            <rect x="32" y="53" width="20" height="4" rx="2" fill="#64d9a0" opacity="0.85"/>
            <rect x="55" y="53" width="28" height="4" rx="2" fill="#2275FE" opacity="0.7"/>
            <rect x="28" y="63" width="10" height="4" rx="2" fill="#c792ea" opacity="0.9"/>
            <rect x="32" y="73" width="30" height="4" rx="2" fill="#ff6d00" opacity="0.8"/>
            <rect x="65" y="73" width="20" height="4" rx="2" fill="#64d9a0" opacity="0.85"/>
            <rect x="32" y="83" width="16" height="4" rx="2" fill="#f9a825" opacity="0.8"/>
            <rect x="51" y="83" width="44" height="4" rx="2" fill="#2275FE" opacity="0.7"/>
            {/* Blinking cursor */}
            <rect x="97" y="83" width="2" height="7" rx="1" fill="#fff" opacity="0.9" style={{ animation: 'cursorBlink 1s step-end infinite' }}/>
            {/* Bottom bar */}
            <rect x="4" y="98" width="152" height="8" rx="4" fill="#14142b"/>
            <rect x="4" y="100" width="152" height="6" fill="#14142b"/>
          </svg>
        </div>
      )}

      {step === 3 && (
        <div style={{
          height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <MiniGmapsCard highlight="siteweb" />
        </div>
      )}
    </>
  )
}

// ── Demo Form + Modal ─────────────────────────────────────────────────────────

export function DemoFormSection() {
  const [mapsUrl, setMapsUrl] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ societe: '', prenom: '', nom: '', telephone: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)

  const openModal = () => {
    if (!mapsUrl.trim()) return
    setModalOpen(true)
    setSuccess(false)
    setError('')
  }

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setSuccess(false)
    setError('')
  }, [])

  useEffect(() => {
    if (!modalOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [modalOpen, closeModal])

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => {
        const first = modalRef.current?.querySelector<HTMLElement>('input, button')
        first?.focus()
      }, 50)
    }
  }, [modalOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, maps_url: mapsUrl }),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      setSuccess(true)
      setFormData({ societe: '', prenom: '', nom: '', telephone: '', email: '' })
      setMapsUrl('')
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  const field = (id: keyof typeof formData, label: string, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#202020', marginBottom: 6 }}>{label}</label>
      <input
        id={id} type={type} required placeholder={placeholder}
        value={formData[id]}
        onChange={e => setFormData(d => ({ ...d, [id]: e.target.value }))}
        style={{ width: '100%', padding: '11px 14px', border: '1px solid #E8E8E8', borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => (e.currentTarget.style.borderColor = '#2275FE')}
        onBlur={e => (e.currentTarget.style.borderColor = '#E8E8E8')}
      />
    </div>
  )

  const ACTION_BTNS = [
    { label: '🌐 Site web', blue: true },
    { label: '🧭 Itinéraire', blue: false },
    { label: '🔖 Enregistrer', blue: false },
    { label: '↗ Partager', blue: false },
    { label: '📞 Appeler', blue: false },
  ]

  return (
    <section id="demo" style={{ background: '#F8F9FF', padding: '96px 24px' }}>
      <style>{`
        @keyframes siteWebPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34,117,254,0.45); }
          50% { transform: scale(1.06); box-shadow: 0 0 0 6px rgba(34,117,254,0); }
        }
        @keyframes partagerBounce {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(1.15); box-shadow: 0 0 0 4px rgba(255,109,0,0.25); }
          60% { transform: scale(1.08); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
      `}</style>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }} className="demo-grid">

        {/* Left — form */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#2275FE', marginBottom: 16, textTransform: 'uppercase' }}>— DÉMO GRATUITE —</p>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#202020', marginBottom: 16 }}>Votre site est peut-être déjà prêt.</h2>
          <p style={{ fontSize: 17, color: '#555', marginBottom: 32, lineHeight: 1.65 }}>
            Collez le lien de votre fiche Google Maps et recevez votre site démo personnalisé gratuitement sous 48h.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <input
              type="url" value={mapsUrl} onChange={e => setMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/... ou https://g.page/..."
              style={{ flex: 1, minWidth: 220, padding: '13px 16px', border: '1px solid #E8E8E8', borderRadius: 8, fontSize: 15, outline: 'none', background: '#fff' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#2275FE')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E8E8E8')}
              onKeyDown={e => e.key === 'Enter' && openModal()}
            />
            <button onClick={openModal} style={{
              background: '#2275FE', color: '#fff', border: 'none', borderRadius: 8,
              padding: '13px 22px', fontSize: 15, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>Obtenir ma démo →</button>
          </div>
          <p style={{ fontSize: 13, color: '#999' }}>Gratuit · Sans engagement · Livré sous 48h</p>
        </div>

        {/* Right — Google Business Profile mockup (2 diagonal floating cards) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 320, height: 390 }}>

            {/* Card A — header + photos + buttons — higher and to the left */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 28, zIndex: 2,
              background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
              overflow: 'hidden', fontFamily: '-apple-system, Arial, sans-serif',
              border: '1px solid #e8e8e8',
            }}>
              <div style={{ padding: '14px 14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#202020', lineHeight: 1.2 }}>PLOMBIER PARISIEN</div>
                  <div style={{ color: '#999', fontSize: 15, marginLeft: 8 }}>⋮ ✕</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#202020' }}>4.9</span>
                  <span style={{ color: '#FBBC04', fontSize: 12 }}>★</span>
                  <span style={{ fontSize: 12, color: '#666' }}>(458) · Plombier</span>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8' }}>
                  {['Aperçu', 'Avis', 'Photos'].map((tab, i) => (
                    <div key={tab} style={{
                      padding: '7px 12px', fontSize: 12, fontWeight: i === 0 ? 600 : 400,
                      color: i === 0 ? '#1a73e8' : '#555',
                      borderBottom: i === 0 ? '2.5px solid #1a73e8' : '2.5px solid transparent',
                    }}>{tab}</div>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, height: 90 }}>
                <div style={{ background: 'linear-gradient(135deg, #b8cfe8, #8aafc7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🚿</div>
                <div style={{ background: 'linear-gradient(135deg, #c8d8e4, #9ab5c4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, position: 'relative' }}>
                  🔧
                  <div style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.88)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>›</div>
                </div>
              </div>

              {/* Action buttons — ALL in one row */}
              <div style={{ padding: '10px 10px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ACTION_BTNS.map(btn => (
                  <div key={btn.label} style={{
                    borderRadius: 16, padding: '5px 9px', fontSize: 10, fontWeight: btn.blue ? 700 : 500,
                    whiteSpace: 'nowrap', cursor: 'default',
                    background: btn.blue ? '#2275FE' : '#f0f4ff',
                    color: btn.blue ? '#fff' : '#1a73e8',
                    border: btn.blue ? '1.5px solid #2275FE' : '1px solid #d0d9f0',
                    animation: btn.blue ? 'siteWebPulse 2.4s ease-in-out infinite' : 'none',
                  }}>{btn.label}</div>
                ))}
              </div>
            </div>

            {/* Card B — info rows — lower and to the right, overlapping Card A bottom */}
            <div style={{
              position: 'absolute', top: 210, left: 28, right: 0, zIndex: 1,
              background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
              overflow: 'hidden', fontFamily: '-apple-system, Arial, sans-serif',
              border: '1px solid #e8e8e8',
            }}>
              {[
                { icon: '🕐', text: 'Ouvert 24h/24', color: '#1e8a3c', bold: true },
                { icon: '📋', text: 'Services : Détection de fuites, WC, Débouchage...', color: '#444' },
                { icon: '📍', text: '12 rue de la Paix, 75008, Paris', color: '#444' },
                { icon: '📞', text: '+336 12 34 56 78', color: '#444' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '8px 13px', borderBottom: '1px solid #f5f5f5', fontSize: 11 }}>
                  <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
                  <span style={{ color: row.color, fontWeight: row.bold ? 600 : 400, lineHeight: 1.4, flex: 1 }}>{row.text}</span>
                  <span style={{ color: '#bbb', fontSize: 13, flexShrink: 0 }}>›</span>
                </div>
              ))}
              <div style={{ background: '#EEF4FF', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>☝️</span>
                <span style={{ fontSize: 11, color: '#1a73e8', fontWeight: 600, lineHeight: 1.4 }}>Copiez le lien de votre fiche et collez-le dans le formulaire</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal backdrop */}
      {modalOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
        >
          <div ref={modalRef} role="dialog" aria-modal="true"
            style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={closeModal} aria-label="Fermer"
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#999', lineHeight: 1 }}>×</button>

            {success ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontSize: 22, color: '#202020', marginBottom: 12 }}>Votre demande est bien reçue</h3>
                <p style={{ color: '#666', lineHeight: 1.6 }}>On prépare votre site et on vous contacte sous 48h.</p>
                <button onClick={closeModal} style={{ marginTop: 24, background: '#2275FE', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Fermer</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 20, color: '#202020', marginBottom: 6 }}>Dernière étape — on vous prépare votre démo</h3>
                <p style={{ fontSize: 14, color: '#999', marginBottom: 28 }}>Quelques infos pour personnaliser votre site et vous l&apos;envoyer dès qu&apos;il est prêt.</p>
                <form onSubmit={handleSubmit}>
                  {field('societe', 'Société')}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ marginBottom: 16 }}>
                      <label htmlFor="prenom" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#202020', marginBottom: 6 }}>Prénom</label>
                      <input id="prenom" type="text" required value={formData.prenom}
                        onChange={e => setFormData(d => ({ ...d, prenom: e.target.value }))}
                        style={{ width: '100%', padding: '11px 14px', border: '1px solid #E8E8E8', borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#2275FE')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E8E8E8')} />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label htmlFor="nom" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#202020', marginBottom: 6 }}>Nom</label>
                      <input id="nom" type="text" required value={formData.nom}
                        onChange={e => setFormData(d => ({ ...d, nom: e.target.value }))}
                        style={{ width: '100%', padding: '11px 14px', border: '1px solid #E8E8E8', borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#2275FE')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E8E8E8')} />
                    </div>
                  </div>
                  {field('telephone', 'Téléphone', 'tel', '+33 6 ...')}
                  {field('email', 'Email', 'email', 'vous@exemple.fr')}
                  {error && <p style={{ color: '#e53e3e', fontSize: 14, marginBottom: 12 }}>{error}</p>}
                  <button type="submit" disabled={submitting} style={{
                    width: '100%', background: '#2275FE', color: '#fff', border: 'none', borderRadius: 8,
                    padding: '14px', fontSize: 16, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1, marginTop: 4,
                  }}>{submitting ? 'Envoi en cours...' : 'Recevoir ma démo gratuite →'}</button>
                  <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: '#999' }}>✓ Gratuit &nbsp; ✓ Sans engagement &nbsp; ✓ Réponse sous 48h</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'Est-ce que mon site sera vraiment fait pour mon métier ?',
    a: "Oui. Chaque site est créé spécifiquement pour votre activité, votre ville et vos services. Nous analysons votre fiche Google Maps pour extraire vos vraies informations : avis clients, services proposés, zone d'intervention. Le résultat est un site unique, pensé pour vous.",
  },
  {
    q: 'Combien de temps pour recevoir mon site ?',
    a: "Une fois votre commande confirmée, votre site est mis en ligne sous 48 à 72 heures ouvrées. Vous recevez un email avec votre adresse web définitive et vos accès dès que c'est prêt.",
  },
  {
    q: 'Puis-je modifier le contenu de mon site moi-même ?',
    a: "Oui. Chaque site est livré avec un espace de gestion simplifié, conçu pour les non-techniciens. Vous pouvez mettre à jour vos textes, vos photos et vos coordonnées en quelques clics, sans aucune connaissance technique.",
  },
  {
    q: "Que contient exactement l'offre à 490€ ?",
    a: "L'offre inclut la création de votre site vitrine personnalisé, votre nom de domaine pour 1 an, l'hébergement pour 1 an et votre espace de gestion. Tout est inclus dans les 490€, sans frais cachés. Après la première année, le renouvellement domaine + hébergement est à 49€/an.",
  },
  {
    q: 'Pourquoi WebPower et pas une agence web classique ?',
    a: "Une agence web facture généralement entre 1 500€ et 5 000€ pour un site vitrine, avec des délais de plusieurs semaines. WebPower propose un site de qualité professionnelle à 490€, livré en 72h, grâce à une équipe de jeunes motivés, fans de technologie, prêts à faire l'effort pour aider les artisans. Vous ne payez que si votre démo vous convainc.",
  },
  {
    q: 'Comment ça marche concrètement, de la démo à la mise en ligne ?',
    a: "1. Vous demandez votre démo gratuite en collant votre lien Google Maps. 2. Notre équipe crée votre site personnalisé et vous l'envoie sous 48h. 3. Si le site vous convient, vous commandez en ligne en choisissant votre nom de domaine. 4. Nous mettons votre site en ligne sous 48-72h et vous envoyons vos accès par email.",
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" style={{ background: '#F8F9FF', padding: '88px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#2275FE', marginBottom: 16, textTransform: 'uppercase', textAlign: 'center' }}>— FAQ —</p>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', textAlign: 'center', color: '#202020', marginBottom: 48 }}>Vos questions, nos réponses</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E8E8', overflow: 'hidden' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: '#202020', lineHeight: 1.4 }}>{item.q}</span>
                <span style={{ fontSize: 22, color: '#2275FE', flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
              </button>
              <div style={{ maxHeight: open === i ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                <div style={{ padding: '0 24px 20px', fontSize: 15, color: '#555', lineHeight: 1.7 }}>{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── WhatsApp Floating Widget ──────────────────────────────────────────────────

const WA_OFFICIAL_PATH = "M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.98 3.8 13.46 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.71 20.28 11.92C20.27 16.46 16.57 20.15 12.04 20.15ZM16.56 13.99C16.32 13.87 15.13 13.28 14.9 13.2C14.68 13.12 14.52 13.08 14.36 13.32C14.2 13.56 13.74 14.1 13.6 14.27C13.46 14.43 13.32 14.45 13.08 14.33C12.84 14.21 12.06 13.95 11.14 13.13C10.42 12.49 9.94 11.7 9.8 11.46C9.66 11.22 9.78 11.09 9.9 10.97C10.01 10.86 10.14 10.68 10.27 10.54C10.4 10.4 10.44 10.3 10.53 10.14C10.61 9.98 10.57 9.84 10.51 9.72C10.45 9.6 9.98 8.41 9.78 7.93C9.58 7.47 9.38 7.53 9.23 7.52C9.09 7.51 8.93 7.51 8.77 7.51C8.61 7.51 8.35 7.57 8.12 7.81C7.9 8.05 7.27 8.65 7.27 9.84C7.27 11.03 8.14 12.18 8.26 12.34C8.38 12.5 9.97 14.97 12.42 16.01C13 16.26 13.45 16.41 13.81 16.52C14.39 16.7 14.92 16.67 15.34 16.61C15.81 16.54 16.79 16.02 16.99 15.45C17.19 14.88 17.19 14.4 17.13 14.3C17.07 14.2 16.91 14.13 16.67 14.01L16.56 13.99Z"

export function WhatsAppWidget() {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, display: 'flex', alignItems: 'center', gap: 10 }}>
      {hovered && (
        <div style={{
          background: '#1A1A1A', color: '#fff', borderRadius: 8, padding: '8px 14px',
          fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.15s ease',
        }}>
          Discutons sur WhatsApp
        </div>
      )}
      <a
        href="https://wa.me/33000000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter sur WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 56, height: 56, borderRadius: '50%', background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          flexShrink: 0,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d={WA_OFFICIAL_PATH}/>
        </svg>
      </a>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(6px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  )
}

// ── WhatsApp icon SVG path (for footer use in page.tsx) ───────────────────────
export { WA_OFFICIAL_PATH }
