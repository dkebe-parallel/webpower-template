'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import type { BusinessData } from '@/lib/types'

// loadStripe is called once at module level — safe because NEXT_PUBLIC_ vars are
// inlined at build time, so the value is always a string in the browser bundle.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

// ── helpers ──────────────────────────────────────────────────────────────────

function slugToDomain(slug: string): string {
  return slug.replace(/-/g, '') + '.fr'
}

function isForbidden(domain: string): boolean {
  return /google|facebook|apple/.test(domain.toLowerCase())
}

function isAvailableMock(domain: string): boolean {
  if (isForbidden(domain)) return false
  return domain.endsWith('.fr') || domain.endsWith('.com')
}

function getAlternatives(base: string): string[] {
  const name = base.replace(/\.(fr|com|net|io)$/, '')
  return [name + '.com', name + '.net', name + '-pro.fr']
}

// ── Step 3 payment sub-form ───────────────────────────────────────────────────
// Receives the clientSecret already fetched by the parent so Elements and
// confirmPayment always use the SAME PaymentIntent.

interface PayFormProps {
  clientSecret: string
  onSuccess: (paymentIntentId: string) => void
  slug: string
  domain: string
  formData: CustomerForm
}

function PayForm({ clientSecret, onSuccess, slug, domain, formData }: PayFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setPaying(true)
    setError(null)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://webpower.app'

    // Validate Elements fields first
    const { error: submitErr } = await elements.submit()
    if (submitErr) {
      setError(submitErr.message ?? 'Erreur lors de la validation du formulaire.')
      setPaying(false)
      return
    }

    // Confirm with the SAME clientSecret that was passed to <Elements>
    const { error: confirmErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${appUrl}/commander/confirmation?slug=${slug}&domain=${encodeURIComponent(domain)}&prenom=${encodeURIComponent(formData.prenom)}`,
        payment_method_data: {
          billing_details: {
            name: `${formData.prenom} ${formData.nom}`,
            email: formData.email,
            phone: formData.telephone,
            address: {
              line1: formData.adresse,
              postal_code: formData.codePostal,
              city: formData.ville,
              country: 'FR',
            },
          },
        },
      },
      redirect: 'if_required',
    })

    if (confirmErr) {
      setError(confirmErr.message ?? 'Erreur de paiement.')
      setPaying(false)
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && (
        <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '12px', marginBottom: 0 }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || !elements || paying}
        style={{
          marginTop: '20px', width: '100%',
          background: paying ? '#999' : '#2275FE',
          color: '#fff', border: 'none', borderRadius: '8px',
          padding: '16px', fontSize: '16px', fontWeight: 700,
          fontFamily: 'var(--display)',
          cursor: paying ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'background .2s',
        }}
      >
        {paying ? 'Traitement en cours…' : 'Payer 499 € →'}
      </button>
      <p style={{ textAlign: 'center', fontSize: '13px', color: '#999', marginTop: '12px', marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Paiement sécurisé par Stripe · Données chiffrées SSL
      </p>
    </form>
  )
}

// ── types ─────────────────────────────────────────────────────────────────────

interface CustomerForm {
  prenom: string; nom: string; societe: string; email: string
  telephone: string; adresse: string; codePostal: string; ville: string; pays: string
}

// ── main component ────────────────────────────────────────────────────────────

interface Props { data: BusinessData; slug: string }

export default function CommanderClient({ data, slug }: Props) {
  const [step, setStep] = useState(1)

  // Step 2
  const [domainInput, setDomainInput] = useState(slugToDomain(slug))
  const [searchedDomain, setSearchedDomain] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [searched, setSearched] = useState(false)

  // Step 3
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentError, setIntentError] = useState<string | null>(null)
  const [form, setForm] = useState<CustomerForm>({
    prenom: '', nom: '', societe: '', email: '',
    telephone: '', adresse: '', codePostal: '', ville: '', pays: 'France',
  })

  const PRICE = 499

  // Create PaymentIntent once when entering step 3.
  // Memoized so the effect only re-runs when the key inputs actually change.
  const fetchIntent = useCallback(async () => {
    if (clientSecret) return
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 49900, currency: 'eur',
          metadata: { slug, domain: selectedDomain, businessName: data.business.name },
        }),
      })
      const json = await res.json()
      if (json.clientSecret) {
        setClientSecret(json.clientSecret)
      } else {
        setIntentError(json.error ?? 'Impossible de charger le paiement.')
      }
    } catch {
      setIntentError('Erreur réseau — veuillez réessayer.')
    }
  }, [clientSecret, slug, selectedDomain, data.business.name])

  useEffect(() => {
    if (step === 3) fetchIntent()
  }, [step, fetchIntent])

  // Memoize stripeOptions so <Elements> never remounts due to a new object ref
  const stripeOptions = useMemo(() => {
    if (!clientSecret) return undefined
    return {
      clientSecret,
      appearance: {
        theme: 'stripe' as const,
        variables: { colorPrimary: '#2275FE', borderRadius: '8px', fontFamily: 'Hanken Grotesk, system-ui, sans-serif' },
      },
    }
  }, [clientSecret])

  function handleSearch() {
    const d = domainInput.trim().toLowerCase()
    setSearchedDomain(d)
    setSearched(true)
    setSelectedDomain('')
  }

  function updateForm(field: keyof CustomerForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const formValid = form.prenom && form.nom && form.email && form.telephone && form.adresse && form.codePostal && form.ville
  const alternatives = searched ? getAlternatives(searchedDomain) : []

  // ── styles ──
  const s = {
    page:    { minHeight: '100vh', background: '#fff', fontFamily: 'var(--body, Hanken Grotesk, system-ui)', color: '#202020' } as React.CSSProperties,
    header:  { borderBottom: '1px solid #E8E8E8', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties,
    progress:{ position: 'sticky' as const, top: 0, zIndex: 40, background: '#fff', borderBottom: '1px solid #E8E8E8', padding: '16px 24px' },
    wrap:    { maxWidth: '960px', margin: '0 auto', padding: '40px 24px 80px' } as React.CSSProperties,
    card:    { background: '#fff', border: '1px solid #E8E8E8', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' } as React.CSSProperties,
    input:   { width: '100%', height: '48px', border: '1px solid #E8E8E8', borderRadius: '8px', padding: '0 14px', fontSize: '16px', fontFamily: 'var(--body)', color: '#202020', outline: 'none', boxSizing: 'border-box' as const },
    btnBlue: { background: '#2275FE', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px 28px', fontSize: '16px', fontWeight: 700, fontFamily: 'var(--display)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' } as React.CSSProperties,
    btnGhost:{ background: '#fff', color: '#2275FE', border: '1.5px solid #2275FE', borderRadius: '8px', padding: '10px 20px', fontSize: '15px', fontWeight: 600, fontFamily: 'var(--display)', cursor: 'pointer' } as React.CSSProperties,
  }

  const CHECK_GREEN = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  )

  return (
    <div style={s.page}>
      {/* Header */}
      <header style={s.header}>
        <Image src="/images/logo-webpower.png" alt="WebPower" width={140} height={36} style={{ objectFit: 'contain', height: '36px', width: 'auto' }} />
      </header>

      {/* Progress bar */}
      <div style={s.progress}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: n < 3 ? '1' : undefined }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step >= n ? '#2275FE' : '#F3F4F6',
                color: step >= n ? '#fff' : '#999',
                fontSize: '13px', fontWeight: 700, flexShrink: 0,
              }}>
                {step > n ? '✓' : n}
              </div>
              <span style={{ fontSize: '13px', fontWeight: step === n ? 700 : 400, color: step === n ? '#202020' : '#999', whiteSpace: 'nowrap' }}>
                {n === 1 ? 'Offre' : n === 2 ? 'Domaine' : 'Paiement'}
              </span>
              {n < 3 && <div style={{ flex: 1, height: '2px', background: step > n ? '#2275FE' : '#E8E8E8', borderRadius: '2px' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div style={s.wrap}>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '8px', color: '#202020' }}>
            Votre site est prêt,&nbsp;<span style={{ color: '#2275FE' }}>{data.business.name}</span>
          </h1>
          <p style={{ color: '#999', marginTop: 0, marginBottom: '32px', fontSize: '17px' }}>Activez-le en moins de 24h — domaine inclus.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
            {/* Business preview */}
            <div style={s.card}>
              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#999', margin: '0 0 16px' }}>Votre site démo</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2275FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '17px', color: '#202020' }}>{data.business.name}</div>
                  <div style={{ color: '#999', fontSize: '14px' }}>{data.business.city}</div>
                </div>
              </div>
              {data.business.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                  <span style={{ color: '#F59E0B' }}>{'★'.repeat(Math.round(data.business.rating))}</span>
                  <span style={{ fontWeight: 600 }}>{data.business.rating}</span>
                  <span style={{ color: '#999' }}>({data.business.reviews_count} avis Google)</span>
                </div>
              )}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E8E8E8' }}>
                <a href={`/demo/${slug}`} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#2275FE', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                  Voir le site démo
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </div>

            {/* Offer */}
            <div style={s.card}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--display)', fontSize: '2.5rem', fontWeight: 800, color: '#202020' }}>499 €</span>
                <span style={{ color: '#999', fontSize: '15px' }}>TTC</span>
              </div>
              <p style={{ color: '#999', fontSize: '14px', margin: '0 0 20px' }}>Paiement unique · Domaine + Hébergement 1 an inclus</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Domaine personnalisé inclus (1 an)',
                  'Hébergement (1 an)',
                  'Site optimisé pour Google (SEO local)',
                  "Panel d'administration simplifié",
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '15px', color: '#202020' }}>
                    <span style={{ color: '#22C55E', flexShrink: 0, marginTop: '1px' }}>{CHECK_GREEN}</span>
                    {item}
                  </li>
                ))}
              </ul>

              <button onClick={() => setStep(2)} style={{ ...s.btnBlue, width: '100%', justifyContent: 'center', padding: '16px', fontSize: '17px' }}>
                Commander maintenant →
              </button>
              <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', margin: '12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Paiement 100% sécurisé · Satisfait ou remboursé 30 jours
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div style={s.wrap}>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', marginBottom: '8px' }}>Choisissez votre domaine</h2>
          <p style={{ color: '#999', marginTop: 0, marginBottom: '32px' }}>Le domaine sera inclus dans votre abonnement — aucun frais supplémentaire.</p>

          <div style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <input
                style={{ ...s.input, flex: 1 }}
                placeholder="ex: gregoryplomberie.fr"
                value={domainInput}
                onChange={e => setDomainInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} style={{ ...s.btnBlue, padding: '0 20px', height: '48px', borderRadius: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
            </div>

            {searched && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <DomainRow domain={searchedDomain} available={isAvailableMock(searchedDomain)} selected={selectedDomain === searchedDomain} onSelect={() => setSelectedDomain(searchedDomain)} primary />
                <p style={{ fontSize: '13px', color: '#999', margin: '8px 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Alternatives</p>
                {alternatives.map(alt => (
                  <DomainRow key={alt} domain={alt} available={isAvailableMock(alt)} selected={selectedDomain === alt} onSelect={() => setSelectedDomain(alt)} />
                ))}
              </div>
            )}

            {selectedDomain && (
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', background: '#EEF4FF', borderRadius: '8px', padding: '12px 16px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2275FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontWeight: 700, color: '#2275FE', fontSize: '15px' }}>{selectedDomain}</span>
                <span style={{ color: '#999', fontSize: '13px', marginLeft: 'auto', cursor: 'pointer' }} onClick={() => setSelectedDomain('')}>Changer</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button onClick={() => setStep(1)} style={s.btnGhost}>← Retour</button>
              <button onClick={() => setStep(3)} disabled={!selectedDomain}
                style={{ ...s.btnBlue, flex: 1, justifyContent: 'center', padding: '14px', opacity: selectedDomain ? 1 : 0.4, cursor: selectedDomain ? 'pointer' : 'default' }}>
                Continuer →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div style={s.wrap}>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', marginBottom: '8px' }}>Informations & Paiement</h2>
          <p style={{ color: '#999', marginTop: 0, marginBottom: '32px' }}>Dernière étape — votre site sera en ligne dans les 24h.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
            {/* Left: form */}
            <div>
              <div style={s.card}>
                <h3 style={{ fontFamily: 'var(--display)', fontSize: '18px', marginBottom: '20px', color: '#202020' }}>Vos informations</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <FormField label="Prénom *" value={form.prenom} onChange={v => updateForm('prenom', v)} placeholder="Jean" />
                  <FormField label="Nom *" value={form.nom} onChange={v => updateForm('nom', v)} placeholder="Martin" />
                </div>
                <div style={{ marginTop: '14px' }}>
                  <FormField label="Société" value={form.societe} onChange={v => updateForm('societe', v)} placeholder="Martin Plomberie (optionnel)" />
                </div>
                <div style={{ marginTop: '14px' }}>
                  <FormField label="Email *" value={form.email} onChange={v => updateForm('email', v)} placeholder="jean@example.fr" type="email" />
                </div>
                <div style={{ marginTop: '14px' }}>
                  <FormField label="Téléphone *" value={form.telephone} onChange={v => updateForm('telephone', v)} placeholder="06 12 34 56 78" type="tel" />
                </div>
                <div style={{ marginTop: '14px' }}>
                  <FormField label="Adresse *" value={form.adresse} onChange={v => updateForm('adresse', v)} placeholder="12 rue de la Paix" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '14px', marginTop: '14px' }}>
                  <FormField label="Code postal *" value={form.codePostal} onChange={v => updateForm('codePostal', v)} placeholder="75001" />
                  <FormField label="Ville *" value={form.ville} onChange={v => updateForm('ville', v)} placeholder="Paris" />
                </div>
                <div style={{ marginTop: '14px' }}>
                  <FormField label="Pays" value={form.pays} onChange={v => updateForm('pays', v)} placeholder="France" />
                </div>
              </div>
              <button onClick={() => setStep(2)} style={{ ...s.btnGhost, marginTop: '16px' }}>← Retour</button>
            </div>

            {/* Right: summary + payment */}
            <div style={{ position: 'sticky', top: '80px' }}>
              <div style={s.card}>
                <h3 style={{ fontFamily: 'var(--display)', fontSize: '18px', marginBottom: '20px', color: '#202020' }}>Récapitulatif commande</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#999' }}>Site Vitrine</span>
                    <span style={{ fontWeight: 600 }}>{data.business.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#999' }}>Domaine</span>
                    <span style={{ fontWeight: 600, color: '#2275FE' }}>{selectedDomain}</span>
                  </div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid #E8E8E8' }}>
                  {['Domaine 1 an inclus', 'Hébergement 1 an', 'SEO local', 'Espace de gestion'].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#202020' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <div style={{ borderTop: '1px solid #E8E8E8', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#999' }}>
                    <span>Sous-total HT</span><span>499,00 €</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#999' }}>
                    <span>TVA — Non applicable</span><span>0,00 €</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 800, color: '#202020', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #E8E8E8' }}>
                    <span>Total TTC</span><span>{PRICE} €</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0', textAlign: 'right' }}>Prix final, tout inclus</p>
                </div>

                {/* Stripe Elements */}
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E8E8E8' }}>
                  {intentError ? (
                    <p style={{ color: '#EF4444', fontSize: '14px', textAlign: 'center' }}>{intentError}</p>
                  ) : clientSecret && stripeOptions ? (
                    <Elements stripe={stripePromise} options={stripeOptions}>
                      <PayForm
                        clientSecret={clientSecret}
                        onSuccess={id => {
                          const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
                          window.location.href = `${appUrl}/commander/confirmation?slug=${slug}&domain=${encodeURIComponent(selectedDomain)}&prenom=${encodeURIComponent(form.prenom)}&pi=${id}`
                        }}
                        slug={slug}
                        domain={selectedDomain}
                        formData={form}
                      />
                    </Elements>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                      <div style={{ width: '24px', height: '24px', border: '2px solid #E8E8E8', borderTopColor: '#2275FE', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 8px' }} />
                      Chargement du formulaire de paiement…
                    </div>
                  )}
                </div>
              </div>

              {!formValid && (
                <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '8px', textAlign: 'center' }}>
                  Veuillez remplir tous les champs obligatoires avant de payer.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: #2275FE !important; box-shadow: 0 0 0 3px rgba(34,117,254,0.12) !important; }
        @media (max-width: 600px) { button { width: 100%; justify-content: center; } }
      `}</style>
    </div>
  )
}

// ── sub-components ────────────────────────────────────────────────────────────

function FormField({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#202020', marginBottom: '6px' }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', height: '48px', border: '1px solid #E8E8E8', borderRadius: '8px', padding: '0 14px', fontSize: '16px', fontFamily: 'var(--body)', color: '#202020', outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s, box-shadow .15s' }}
      />
    </div>
  )
}

function DomainRow({ domain, available, selected, onSelect, primary = false }: {
  domain: string; available: boolean; selected: boolean; onSelect: () => void; primary?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      border: `1.5px solid ${selected ? '#2275FE' : '#E8E8E8'}`,
      borderRadius: '10px', padding: '14px 16px', background: selected ? '#EEF4FF' : '#fff',
      boxShadow: primary ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
    }}>
      <span style={{ fontWeight: primary ? 700 : 500, fontSize: '15px', color: '#202020', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{domain}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', background: available ? '#DCFCE7' : '#FEE2E2', color: available ? '#16A34A' : '#DC2626' }}>
          {available ? '✓ Disponible' : '✗ Indisponible'}
        </span>
        {available && (
          <button onClick={onSelect} style={{ background: selected ? '#2275FE' : '#fff', color: selected ? '#fff' : '#2275FE', border: '1.5px solid #2275FE', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', width: 'auto' }}>
            {selected ? 'Choisi ✓' : 'Choisir'}
          </button>
        )}
      </div>
    </div>
  )
}
