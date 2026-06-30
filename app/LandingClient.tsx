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
    { value: 72, suffix: 'h', label: 'Temps moyen de livraison', pre: '48-' },
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

// ── Demo Form + Modal ─────────────────────────────────────────────────────────

// Mini Google Maps card used in both the mockup and the step icons
function MiniGmapsCard({ highlight }: { highlight: 'partager' | 'siteweb' }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.13)',
      width: 180, fontFamily: '-apple-system, Arial, sans-serif', fontSize: 10,
      border: '1px solid #e8e8e8', overflow: 'hidden',
    }}>
      <div style={{ padding: '8px 10px 6px' }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: '#202020', marginBottom: 2 }}>PLOMBIER PARISIEN</div>
        <div style={{ color: '#888', fontSize: 9, marginBottom: 6 }}>4.9 ★ (458) · Plombier</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {/* Site web — highlighted when step=siteweb */}
          <div style={{
            borderRadius: 12, padding: '3px 7px', fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap',
            background: highlight === 'siteweb' ? '#2275FE' : '#f0f4ff',
            color: highlight === 'siteweb' ? '#fff' : '#1a73e8',
            border: highlight === 'siteweb' ? '1.5px solid #2275FE' : '1px solid #d0d9f0',
            boxShadow: highlight === 'siteweb' ? '0 0 0 3px rgba(34,117,254,0.2)' : 'none',
          }}>🌐 Site web</div>
          <div style={{ background: '#f0f4ff', border: '1px solid #d0d9f0', borderRadius: 12, padding: '3px 7px', fontSize: 9, fontWeight: 500, color: '#1a73e8', whiteSpace: 'nowrap' }}>🧭 Itinéraire</div>
          {/* Partager — highlighted when step=partager */}
          <div style={{
            borderRadius: 12, padding: '3px 7px', fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap',
            background: highlight === 'partager' ? '#FF6D00' : '#f0f4ff',
            color: highlight === 'partager' ? '#fff' : '#1a73e8',
            border: highlight === 'partager' ? '1.5px solid #FF6D00' : '1px solid #d0d9f0',
            boxShadow: highlight === 'partager' ? '0 0 0 3px rgba(255,109,0,0.2)' : 'none',
          }}>↗ Partager</div>
          <div style={{ background: '#f0f4ff', border: '1px solid #d0d9f0', borderRadius: 12, padding: '3px 7px', fontSize: 9, fontWeight: 500, color: '#1a73e8', whiteSpace: 'nowrap' }}>📞 Appeler</div>
        </div>
      </div>
    </div>
  )
}

// Step icon illustrations
export function StepIcon({ step }: { step: 1 | 2 | 3 }) {
  if (step === 1) return (
    <div style={{ position: 'relative', width: 120, margin: '0 auto 20px' }}>
      <MiniGmapsCard highlight="partager" />
      {/* Magnifying glass overlay */}
      <div style={{
        position: 'absolute', bottom: -16, right: -16, width: 44, height: 44,
        background: '#EEF4FF', borderRadius: '50%', border: '2px solid #2275FE',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        boxShadow: '0 2px 8px rgba(34,117,254,0.25)',
      }}>🔍</div>
    </div>
  )

  if (step === 2) return (
    <div style={{ margin: '0 auto 20px', width: 120 }}>
      <svg viewBox="0 0 120 80" width="120" height="80" xmlns="http://www.w3.org/2000/svg">
        {/* Laptop body */}
        <rect x="10" y="10" width="100" height="55" rx="6" fill="#f5f5f5" stroke="#ddd" strokeWidth="1.5"/>
        {/* Screen */}
        <rect x="16" y="15" width="88" height="44" rx="4" fill="#1a1a2e"/>
        {/* Code lines */}
        <rect x="22" y="22" width="30" height="3" rx="1.5" fill="#2275FE" opacity="0.9"/>
        <rect x="26" y="28" width="45" height="3" rx="1.5" fill="#64d9a0" opacity="0.8"/>
        <rect x="26" y="34" width="38" height="3" rx="1.5" fill="#f9a825" opacity="0.8"/>
        <rect x="22" y="40" width="25" height="3" rx="1.5" fill="#2275FE" opacity="0.9"/>
        <rect x="26" y="46" width="52" height="3" rx="1.5" fill="#64d9a0" opacity="0.8"/>
        {/* Cursor blink */}
        <rect x="80" y="46" width="2" height="8" rx="1" fill="#fff" opacity="0.8"/>
        {/* Keyboard base */}
        <rect x="0" y="65" width="120" height="8" rx="4" fill="#e0e0e0" stroke="#ccc" strokeWidth="1"/>
        <rect x="40" y="65" width="40" height="3" rx="1.5" fill="#bbb"/>
      </svg>
    </div>
  )

  // step === 3
  return (
    <div style={{ position: 'relative', width: 120, margin: '0 auto 20px' }}>
      <MiniGmapsCard highlight="siteweb" />
      {/* Animated pulse ring around Site web button */}
      <div style={{ position: 'absolute', top: 30, left: 6, pointerEvents: 'none' }}>
        <div style={{
          width: 60, height: 20, borderRadius: 10,
          border: '2px solid rgba(34,117,254,0.4)',
          animation: 'stepPulse 1.8s ease-in-out infinite',
        }} />
      </div>
      {/* Arrow pointing down-left to the Site web button */}
      <svg style={{ position: 'absolute', bottom: -20, right: -10 }} width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="#EEF4FF" stroke="#2275FE" strokeWidth="2"/>
        <text x="18" y="23" textAnchor="middle" fontSize="14" fill="#2275FE">✓</text>
      </svg>
    </div>
  )
}

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
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34,117,254,0.4); }
          50% { transform: scale(1.06); box-shadow: 0 0 0 6px rgba(34,117,254,0); }
        }
        @keyframes stepPulse {
          0%, 100% { opacity: 0; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.05); }
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

        {/* Right — Google Business Profile mockup (2 floating cards) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Card A — Header + Photos + Buttons */}
            <div style={{
              background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              overflow: 'hidden', fontFamily: '-apple-system, Arial, sans-serif',
              border: '1px solid #e8e8e8',
            }}>
              <div style={{ padding: '14px 14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#202020', lineHeight: 1.2 }}>PLOMBIER PARISIEN</div>
                  <div style={{ color: '#999', fontSize: 16, marginLeft: 8 }}>⋮ ✕</div>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, height: 100 }}>
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

            {/* Card B — Info rows + CTA */}
            <div style={{
              background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
              overflow: 'hidden', fontFamily: '-apple-system, Arial, sans-serif',
              border: '1px solid #e8e8e8',
            }}>
              {[
                { icon: '🕐', text: 'Ouvert 24h/24', color: '#1e8a3c', bold: true },
                { icon: '📋', text: 'Services : Détection de fuites, WC, Débouchage...', color: '#444' },
                { icon: '📍', text: '12 rue de la Paix, 75008, Paris', color: '#444' },
                { icon: '⭐', text: '4.9 · 458 avis Google', color: '#444' },
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

export function WhatsAppWidget() {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Tooltip */}
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
        {/* WhatsApp SVG icon */}
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.48 1.65 6.38L3 29l6.8-1.61A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Z" fill="#25D366"/>
          <path d="M16 5.5A10.5 10.5 0 0 0 7.05 21.4l.27.44-1.15 4.2 4.32-1.13.43.25A10.5 10.5 0 1 0 16 5.5Z" fill="white"/>
          <path d="M12.3 10.5c-.2-.44-.4-.45-.58-.46l-.5-.01c-.17 0-.45.06-.69.33-.23.27-.9.88-.9 2.14s.92 2.48 1.05 2.65c.13.17 1.78 2.86 4.4 3.89 2.17.86 2.62.69 3.09.65.47-.04 1.52-.62 1.73-1.22.21-.6.21-1.12.15-1.22-.06-.1-.24-.16-.5-.28-.27-.13-1.58-.78-1.83-.87-.24-.09-.42-.13-.6.13-.17.27-.67.87-.82 1.05-.15.17-.3.19-.57.06-.27-.13-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.31.4-.47.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.06-.14-.57-1.4-.8-1.91Z" fill="#25D366"/>
        </svg>
      </a>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(6px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  )
}
