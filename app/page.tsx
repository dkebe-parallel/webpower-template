import type { Metadata } from 'next'
import { Fragment } from 'react'
import Image from 'next/image'
import { StickyHeader, StatsSection, DemoFormSection, FAQSection, StepIcon, WhatsAppWidget, WA_OFFICIAL_PATH } from './LandingClient'

export const metadata: Metadata = {
  title: 'WebPower — Le site web des artisans',
  description: 'WebPower crée votre site vitrine professionnel en 72h pour 490€ tout compris. Personnalisé pour votre métier, votre ville et vos clients.',
}

const HERO_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600', alt: 'Plombier professionnel souriant' },
  { src: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600', alt: 'Électricien en intervention' },
  { src: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600', alt: 'Serrurier artisan' },
  { src: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600', alt: 'Menuisier au travail' },
]

const METIERS = [
  { name: 'Plombier', desc: 'Urgences, sanitaires, chauffe-eau', img: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600' },
  { name: 'Électricien', desc: 'Installations, dépannages, mises aux normes', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600' },
  { name: 'Chauffagiste', desc: 'Chaudières, climatisation, PAC', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600' },
  { name: 'Menuisier', desc: 'Portes, fenêtres, agencement', img: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600' },
  { name: 'Peintre', desc: 'Intérieur, extérieur, ravalement', img: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600' },
  { name: 'Serrurier', desc: 'Dépannage urgence, blindage, installation', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
  { name: 'Maçon', desc: 'Gros œuvre, rénovation, extension', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600' },
  { name: 'Carreleur', desc: 'Pose, rénovation, salle de bain', img: 'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=600' },
]

const INCLUS = [
  'Site vitrine personnalisé pour votre métier',
  'Domaine personnalisé inclus (1 an)',
  'Hébergement inclus (1 an)',
  'Espace de gestion simplifié',
  'Support par email inclus',
  'Livraison sous 48-72h',
]

const HOW_IT_WORKS = [
  {
    num: '1',
    title: 'Partagez votre fiche Google Maps',
    desc: 'Collez simplement le lien de votre fiche Google dans notre formulaire. Pas besoin de préparer quoi que ce soit d\'autre.',
  },
  {
    num: '2',
    title: 'On crée votre site sur mesure',
    desc: 'Notre équipe conçoit votre site vitrine en s\'appuyant sur vos vraies infos : avis clients, services, zone d\'intervention. Livré sous 48h.',
  },
  {
    num: '3',
    title: 'Vous en devenez propriétaire',
    desc: 'Votre site vous plaît ? Validez la commande et il est à vous pour toujours. Paiement unique, aucun abonnement.',
  },
]

export default function LandingPage() {
  return (
    <>
      <style>{`
        .landing-desktop-nav { display: flex; }
        .landing-mobile-nav { display: none; }
        .footer-nav-link { font-size: 14px; color: #888; transition: color 0.15s; }
        .footer-nav-link:hover { color: #fff; }
        .metier-card-img { transition: transform 0.4s ease; }
        .metier-card:hover .metier-card-img { transform: scale(1.06); }
        @media (max-width: 900px) {
          .landing-desktop-nav { display: none !important; }
          .landing-mobile-nav { display: block !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-images { margin-top: 40px; }
          .how-grid { grid-template-columns: 1fr !important; }
          .how-arrow { display: none !important; }
          .demo-grid { grid-template-columns: 1fr !important; }
          .metiers-grid { grid-template-columns: 1fr 1fr !important; }
          .pricing-inner { padding: 40px 28px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-brand { grid-column: 1 / -1 !important; }
        }
        @media (max-width: 540px) {
          .metiers-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <StickyHeader />

      {/* ── HERO ── */}
      <section style={{ background: '#fff', padding: '80px 24px 72px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">
          <div>
            <div style={{ display: 'inline-block', background: '#EEF4FF', color: '#2275FE', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
              🛠 La solution web pour les artisans
            </div>
            <h1 style={{ fontSize: 'clamp(34px, 4.5vw, 54px)', color: '#202020', marginBottom: 20, lineHeight: 1.08 }}>
              Votre fiche Google Maps <span style={{ color: '#2275FE' }}>devient votre site web d&apos;artisan</span>
            </h1>
            <p style={{ fontSize: 18, color: '#555', lineHeight: 1.65, marginBottom: 36, maxWidth: 500 }}>
              On analyse vos avis, vos services et votre localisation pour créer un site vitrine unique, livré en 48h. Vous n&apos;avez rien à préparer.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
              <a href="#demo" style={{ display: 'block', background: '#2275FE', color: '#fff', borderRadius: 10, padding: '15px 28px', fontSize: 16, fontWeight: 600, textAlign: 'center' }}>
                Obtenir mon site démo gratuit →
              </a>
              <a href="https://webpower.app/demo/gregory-plomberie" target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', border: '2px solid #E8E8E8', color: '#202020', borderRadius: 10, padding: '13px 28px', fontSize: 16, fontWeight: 600, textAlign: 'center' }}>
                Voir un exemple
              </a>
            </div>
            <p style={{ marginTop: 20, fontSize: 14, color: '#999' }}>
              ✓ 100% gratuit à voir &nbsp; ✓ Basé sur votre Google Maps &nbsp; ✓ Livré sous 48h
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="hero-images">
            {HERO_IMAGES.map((img, i) => (
              <div key={i} style={{
                borderRadius: 14, overflow: 'hidden', aspectRatio: '4/3',
                transform: i % 2 === 1 ? 'translateY(24px)' : 'none',
                boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
              }}>
                <Image src={img.src} alt={img.alt} width={400} height={300}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <StatsSection />

      {/* ── COMMENT ÇA MARCHE ── */}
      <section id="comment-ca-marche" style={{ background: '#fff', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#2275FE', marginBottom: 16, textTransform: 'uppercase', textAlign: 'center' }}>— COMMENT ÇA MARCHE —</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', textAlign: 'center', color: '#202020', marginBottom: 12 }}>Simple comme bonjour.</h2>
          <p style={{ fontSize: 17, color: '#666', textAlign: 'center', marginBottom: 64, maxWidth: 520, margin: '0 auto 64px' }}>
            De votre fiche Google à votre site en ligne en 3 étapes. Sans effort de votre côté.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 0, alignItems: 'start' }} className="how-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <Fragment key={step.num}>
                <div style={{ textAlign: 'center', padding: '0 24px' }}>
                  <StepIcon step={(i + 1) as 1 | 2 | 3} />
                  <div style={{ display: 'inline-block', background: '#2275FE', color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700, marginBottom: 14, letterSpacing: '0.05em' }}>
                    ÉTAPE {step.num}
                  </div>
                  <h3 style={{ fontSize: 18, color: '#202020', marginBottom: 12, lineHeight: 1.3 }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: '#666', lineHeight: 1.65 }}>{step.desc}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="how-arrow" style={{ display: 'flex', alignItems: 'center', paddingTop: 32, color: '#CBD5E0', fontSize: 28, fontWeight: 300 }}>
                    →
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO FORM ── */}
      <DemoFormSection />

      {/* ── NOS MÉTIERS ── */}
      <section id="nos-metiers" style={{ background: '#F8F9FF', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#2275FE', marginBottom: 16, textTransform: 'uppercase', textAlign: 'center' }}>— NOS MÉTIERS —</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', textAlign: 'center', color: '#202020', marginBottom: 12 }}>Un site taillé pour votre corps de métier</h2>
          <p style={{ fontSize: 17, color: '#666', textAlign: 'center', marginBottom: 52, maxWidth: 560, margin: '0 auto 52px' }}>
            Chaque site est créé spécifiquement pour votre activité, votre ville et vos clients.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="metiers-grid">
            {METIERS.map((m) => (
              <div key={m.name} className="metier-card" style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', height: 220, cursor: 'default' }}>
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                  <Image src={m.img} alt={m.name} fill className="metier-card-img"
                    style={{ objectFit: 'cover' }} sizes="300px" />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.72) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)', lineHeight: 1.4 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 44, fontSize: 16, color: '#666' }}>
            Et une centaine d&apos;autres métiers artisanaux —{' '}
            <a href="#demo" style={{ color: '#2275FE', fontWeight: 600 }}>Demandez votre démo gratuite →</a>
          </p>
        </div>
      </section>

      {/* ── TARIF ── */}
      <section id="tarif" style={{ background: '#0D1B4B', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', marginBottom: 16, textTransform: 'uppercase' }}>— NOTRE OFFRE —</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#fff', marginBottom: 12 }}>Tout compris. Une seule fois.</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', marginBottom: 52 }}>Aucune mauvaise surprise. Aucun abonnement caché.</p>

          <div className="pricing-inner" style={{
            maxWidth: 560, margin: '0 auto', background: '#fff', borderRadius: 20,
            padding: '52px 52px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          }}>
            <div style={{ fontSize: 72, fontWeight: 800, color: '#2275FE', fontFamily: 'var(--display)', lineHeight: 1, marginBottom: 8 }}>490 €</div>
            <p style={{ fontSize: 15, color: '#999', marginBottom: 40 }}>Paiement unique, après validation de votre démo</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 44, textAlign: 'left' }}>
              {INCLUS.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ color: '#2275FE', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 16, color: '#202020' }}>{item}</span>
                </div>
              ))}
            </div>

            <a href="#demo" style={{ display: 'block', background: '#2275FE', color: '#fff', borderRadius: 10, padding: '16px', fontSize: 17, fontWeight: 700, textAlign: 'center' }}>
              Demander ma démo gratuite →
            </a>
          </div>

          <p style={{ marginTop: 28, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            Après la première année, renouvellement domaine + hébergement à 49€/an.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── FOOTER ── */}
      <footer style={{ background: '#111827', color: '#fff', padding: '72px 24px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48, paddingBottom: 56 }} className="footer-grid">

            {/* Brand */}
            <div className="footer-brand">
              <Image src="/logo-webpower-white.png" alt="WebPower" width={148} height={38} style={{ objectFit: 'contain', marginBottom: 20 }} />
              <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
                WebPower accompagne les artisans dans leur présence en ligne. Sites web professionnels, personnalisés, livrés rapidement et sans prise de tête.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {/* WhatsApp */}
                <a href="https://wa.me/33000000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                  style={{ width: 36, height: 36, borderRadius: '50%', background: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#9CA3AF" xmlns="http://www.w3.org/2000/svg">
                    <path d={WA_OFFICIAL_PATH}/>
                  </svg>
                </a>
                {/* Email */}
                <a href="mailto:hello@yourwebpower.com" aria-label="Email"
                  style={{ width: 36, height: 36, borderRadius: '50%', background: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="#9CA3AF" strokeWidth="1.8" fill="none"/>
                    <path d="M2 7l10 7 10-7" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: '#6B7280', marginBottom: 20, textTransform: 'uppercase' }}>Services</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['Démo gratuite', '#demo'], ['Nos métiers', '#nos-metiers'], ['Prix Unique', '#tarif']].map(([l, h]) => (
                  <a key={h} href={h} className="footer-nav-link">{l}</a>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: '#6B7280', marginBottom: 20, textTransform: 'uppercase' }}>WebPower</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['Comment ça marche', '#comment-ca-marche'], ['FAQ', '#faq'], ['Contact', 'mailto:hello@yourwebpower.com']].map(([l, h]) => (
                  <a key={h} href={h} className="footer-nav-link">{l}</a>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: '#6B7280', marginBottom: 20, textTransform: 'uppercase' }}>Vous êtes artisan ?</p>
              <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.6, marginBottom: 20 }}>
                Recevez votre site démo personnalisé gratuitement sous 48h.
              </p>
              <a href="#demo" style={{ display: 'block', background: '#2275FE', color: '#fff', borderRadius: 8, padding: '12px 20px', fontSize: 14, fontWeight: 600, textAlign: 'center', marginBottom: 20 }}>
                Obtenir ma démo gratuite
              </a>
              <a href="mailto:hello@yourwebpower.com" style={{ fontSize: 14, color: '#9CA3AF', display: 'block' }}
                className="footer-nav-link">hello@yourwebpower.com</a>
            </div>
          </div>

          {/* Subfooter */}
          <div style={{ borderTop: '1px solid #1F2937', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#4B5563' }}>© 2025-2026 WebPower. Tous droits réservés.</p>
            <div style={{ display: 'flex', gap: 24 }}>
              {[['Mentions légales', '/mentions-legales'], ['CGV', '/cgv'], ['Confidentialité', '/confidentialite']].map(([l, h]) => (
                <a key={l} href={h} style={{ fontSize: 13, color: '#4B5563' }} className="footer-nav-link">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp floating widget */}
      <WhatsAppWidget />
    </>
  )
}
