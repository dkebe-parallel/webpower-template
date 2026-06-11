'use client'

import { useState } from 'react'

interface ContactSectionProps {
  contact: { phone: string; email: string; hours: string }
  ctaPrimary: string
  ctaSecondary: string
  businessName: string
}

export default function ContactSection({ contact, ctaSecondary, businessName }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const msg = encodeURIComponent(`Prénom: ${data.get('prenom')}\nMessage: ${data.get('message')}`)
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Demande de devis — ${businessName}`)}&body=${msg}`
    setSubmitted(true)
  }

  return (
    <>
      <style>{`
        .contact-section { background: var(--cream); padding: 120px 0; }
        .contact-wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: 1.05fr .95fr; gap: 54px; }
        .contact-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: var(--display); font-size: 13px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--copper-deep); }
        .contact-eyebrow::before { content: ""; width: 26px; height: 2px; background: var(--copper); border-radius: 2px; }
        .contact-head h2 { font-size: clamp(30px,3.4vw,44px); margin-top: 14px; color: var(--navy); }
        .contact-head p { color: var(--muted); margin-top: 12px; }
        .form-card { background: #fff; border: 1px solid var(--hair); border-radius: var(--radius-lg); padding: 36px; box-shadow: var(--shadow-md); }
        .field { margin-bottom: 18px; }
        .field label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 7px; color: var(--ink); }
        .field input, .field textarea { width: 100%; border: 1.5px solid var(--hair); border-radius: 12px; padding: 14px 16px; font-family: var(--body); font-size: 15px; color: var(--ink); background: var(--paper); transition: border-color .2s, box-shadow .2s; outline: 0; }
        .field input:focus, .field textarea:focus { border-color: var(--copper); box-shadow: 0 0 0 4px color-mix(in srgb, var(--copper) 16%, transparent); background: #fff; }
        .field textarea { min-height: 120px; resize: vertical; }
        .btn-submit { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; font-family: var(--display); font-weight: 600; font-size: 16px; padding: 15px 26px; border-radius: 13px; background: var(--copper); color: #fff; box-shadow: var(--shadow-accent); border: 0; cursor: pointer; transition: transform .18s ease, box-shadow .25s ease; }
        .btn-submit:hover { transform: translateY(-2px); }
        .contact-side { display: flex; flex-direction: column; gap: 16px; justify-content: center; }
        .cside-head h3 { font-size: 30px; color: var(--navy); }
        .cside-head p { color: var(--muted); margin-top: 10px; }
        .cinfo { display: flex; align-items: center; gap: 16px; background: #fff; border: 1px solid var(--hair); border-radius: 16px; padding: 18px 20px; box-shadow: var(--shadow-sm); transition: transform .22s, box-shadow .22s; text-decoration: none; color: inherit; }
        .cinfo:hover { transform: translateX(4px); box-shadow: var(--shadow-md); }
        .cinfo .ic { width: 48px; height: 48px; border-radius: 13px; display: grid; place-items: center; background: var(--copper); color: #fff; flex-shrink: 0; }
        .cinfo span { font-size: 12.5px; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; font-weight: 600; display: block; }
        .cinfo b { font-family: var(--display); font-size: 18px; display: block; white-space: nowrap; color: var(--navy); }
        .success-box { background: #fff; border: 1px solid var(--hair); border-radius: var(--radius-lg); padding: 48px; text-align: center; box-shadow: var(--shadow-sm); }
        .success-box p { font-family: var(--display); font-size: 18px; color: var(--navy); margin: 0; }
        .success-box small { color: var(--muted); font-size: 14px; margin-top: 8px; display: block; }
        @media (max-width: 1000px) { .contact-section { padding: 84px 0; } .contact-wrap { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .contact-wrap { padding: 0 20px; } }
      `}</style>

      <section className="contact-section" id="contact">
        <div className="contact-wrap">
          <div>
            <div className="contact-head" style={{ marginBottom: '26px' }}>
              <span className="contact-eyebrow">Devis gratuit</span>
              <h2>{ctaSecondary}</h2>
              <p>Réponse sous quelques heures. Sans engagement.</p>
            </div>
            {submitted ? (
              <div className="success-box">
                <p>Merci, votre demande a bien été envoyée !</p>
                <small>Nous vous répondrons dans les plus brefs délais.</small>
              </div>
            ) : (
              <form className="form-card" onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="prenom">Prénom</label>
                  <input id="prenom" name="prenom" type="text" placeholder="Votre prénom" required />
                </div>
                <div className="field">
                  <label htmlFor="contact-field">Email ou Téléphone</label>
                  <input id="contact-field" name="contact" type="text" placeholder="votre@email.fr ou 06 xx xx xx xx" required />
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" placeholder="Décrivez votre besoin…" required />
                </div>
                <button className="btn-submit" type="submit">Envoyer ma demande</button>
              </form>
            )}
          </div>

          <div className="contact-side">
            <div className="cside-head" style={{ marginBottom: '6px' }}>
              <h3>Une urgence ?<br />Appelez directement</h3>
              <p>On décroche 7j/7, urgences 24h/24.</p>
            </div>
            <a className="cinfo" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
              <span className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <div><span>Téléphone</span><b>{contact.phone}</b></div>
            </a>
            <a className="cinfo" href={`mailto:${contact.email}`}>
              <span className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>
                </svg>
              </span>
              <div><span>Email</span><b>{contact.email}</b></div>
            </a>
            <div className="cinfo">
              <span className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
                </svg>
              </span>
              <div><span>Horaires</span><b>{contact.hours}</b></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
