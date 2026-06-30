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
    { label: 'Comment ça marche', href: '#comment-ca-marche' },
    { label: 'Nos métiers', href: '#nos-metiers' },
    { label: 'Tarif', href: '#tarif' },
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
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="landing-desktop-nav">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} style={{ fontSize: 15, color: '#202020', fontWeight: 500 }}
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

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = useCountUp(value, 1600, started)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ textAlign: 'center', flex: 1, minWidth: 180, padding: '8px 16px' }}>
      <div style={{ fontSize: 48, fontWeight: 700, fontFamily: 'var(--display)', lineHeight: 1, marginBottom: 8 }}>
        {suffix.startsWith('-') ? `${count}${suffix}` : `${suffix}${count}`}
      </div>
      <div style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.4 }}>{label}</div>
    </div>
  )
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

  // Focus trap
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

  return (
    <section id="demo" style={{ background: '#F8F9FF', padding: '96px 24px' }}>
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

        {/* Right — Google Business Profile mockup */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            width: '100%', maxWidth: 360, overflow: 'hidden', fontFamily: 'Arial, sans-serif',
          }}>
            {/* Map placeholder */}
            <div style={{ height: 140, background: 'linear-gradient(135deg, #e8f0fe 0%, #c5d9f7 50%, #a8c4f0 100%)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'repeating-linear-gradient(0deg, #9ab transparent, #9ab 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #9ab transparent, #9ab 1px, transparent 1px, transparent 40px)' }} />
              <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
                <div style={{ width: 28, height: 36, background: '#EA4335', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', margin: '0 auto', boxShadow: '0 2px 8px rgba(234,67,53,0.4)' }} />
              </div>
            </div>

            {/* Business info */}
            <div style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#202020', marginBottom: 4 }}>Plomberie Dupont</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#FBBC04', fontSize: 14 }}>{s}</span>)}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#202020' }}>4.8</span>
                <span style={{ fontSize: 13, color: '#666' }}>(127 avis)</span>
              </div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Plombier · Ouvert 24h/24</div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#444' }}>
                  <span style={{ fontSize: 16 }}>📞</span> +33 6 12 34 56 78
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#444' }}>
                  <span style={{ fontSize: 16 }}>📍</span> 12 rue de la Paix, Paris 75001
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#2275FE', fontWeight: 500 }}>
                  <span style={{ fontSize: 16 }}>🔗</span> maps.google.com/...
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                {['Site web', 'Itinéraire', 'Appeler'].map(btn => (
                  <div key={btn} style={{ flex: 1, background: '#EEF4FF', borderRadius: 6, padding: '7px 4px', fontSize: 12, fontWeight: 600, color: '#2275FE', textAlign: 'center' }}>{btn}</div>
                ))}
              </div>
            </div>

            {/* Arrow label */}
            <div style={{ background: '#EEF4FF', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>↑</span>
              <span style={{ fontSize: 13, color: '#2275FE', fontWeight: 600 }}>Copiez ce lien et collez-le dans le formulaire</span>
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
    a: "Oui. Chaque site est créé spécifiquement pour votre activité, votre ville et vos services. Nous analysons votre fiche Google Maps pour extraire vos vraies informations : avis clients, services proposés, zone d'intervention. Le résultat est un site unique, pas un template copié-collé.",
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
    a: "L'offre inclut la création de votre site vitrine personnalisé, votre nom de domaine pour 1 an, l'hébergement pour 1 an et votre espace de gestion. Tout est inclus dans les 490€, sans frais cachés. Après la première année, le renouvellement domaine + hébergement est à 99€/an.",
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
              <div style={{
                maxHeight: open === i ? 400 : 0, overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}>
                <div style={{ padding: '0 24px 20px', fontSize: 15, color: '#555', lineHeight: 1.7 }}>{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
