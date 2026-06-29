import type { Metadata } from 'next'
import Image from 'next/image'
import { StickyHeader, StatsSection, DemoFormSection, FAQSection } from './LandingClient'

export const metadata: Metadata = {
  title: 'WebPower — Le site web des artisans',
  description: 'WebPower crée votre site vitrine professionnel en 72h pour 490€ tout compris. Personnalisé pour votre métier, votre ville et vos clients.',
}

const HERO_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400', alt: 'Plombier professionnel au travail' },
  { src: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400', alt: 'Électricien en intervention' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Charpentier artisan' },
  { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', alt: 'Artisan du bâtiment' },
]

const METIERS = [
  { name: 'Plombier', desc: 'Urgences, sanitaires, chauffe-eau', icon: '💧' },
  { name: 'Électricien', desc: 'Installations, dépannages, mises aux normes', icon: '⚡' },
  { name: 'Chauffagiste', desc: 'Chaudières, climatisation, PAC', icon: '🔥' },
  { name: 'Menuisier', desc: 'Portes, fenêtres, agencement', icon: '🔨' },
  { name: 'Peintre', desc: 'Intérieur, extérieur, ravalement', icon: '🖌️' },
  { name: 'Serrurier', desc: 'Dépannage urgence, blindage, installation', icon: '🔑' },
  { name: 'Maçon', desc: 'Gros œuvre, rénovation, extension', icon: '🏗️' },
  { name: 'Carreleur', desc: 'Pose, rénovation, salle de bain', icon: '✂️' },
]

const INCLUS = [
  'Site vitrine personnalisé pour votre métier',
  'Domaine personnalisé inclus (1 an)',
  'Hébergement inclus (1 an)',
  'Optimisé pour Google (SEO local)',
  'Espace de gestion simplifié',
  'Livraison sous 48-72h',
]

export default function LandingPage() {
  return (
    <>
      <style>{`
        .landing-desktop-nav { display: flex; }
        .landing-mobile-nav { display: none; }
        @media (max-width: 768px) {
          .landing-desktop-nav { display: none !important; }
          .landing-mobile-nav { display: block !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-images { grid-template-columns: 1fr 1fr !important; margin-top: 40px; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .metiers-grid { grid-template-columns: 1fr 1fr !important; }
          .demo-input-row { flex-direction: column !important; }
          .pricing-card { padding: 32px 24px !important; }
        }
        .footer-nav-link { font-size: 14px; color: #aaa; transition: color 0.15s; }
        .footer-nav-link:hover { color: #fff; }
        @media (max-width: 480px) {
          .hero-images { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <StickyHeader />

      {/* ── HERO ── */}
      <section style={{ background: '#fff', padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">
          <div>
            <div style={{ display: 'inline-block', background: '#EEF4FF', color: '#2275FE', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
              🛠 Le site web des artisans
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', color: '#202020', marginBottom: 20, lineHeight: 1.05 }}>
              Votre site web pro,<br />livré en 72h<br />
              <span style={{ color: '#2275FE' }}>pour 490€ tout compris.</span>
            </h1>
            <p style={{ fontSize: 18, color: '#666', lineHeight: 1.6, marginBottom: 36, maxWidth: 480 }}>
              WebPower crée un site vitrine personnalisé pour votre métier, votre ville et vos clients. Sans abonnement.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380 }}>
              <a href="#demo" style={{ display: 'block', background: '#2275FE', color: '#fff', borderRadius: 10, padding: '15px 28px', fontSize: 16, fontWeight: 600, textAlign: 'center' }}>
                Obtenir mon site démo gratuit →
              </a>
              <a href="https://webpower.app/demo/gregory-plomberie" target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', border: '2px solid #E8E8E8', color: '#202020', borderRadius: 10, padding: '13px 28px', fontSize: 16, fontWeight: 600, textAlign: 'center' }}>
                Voir un exemple
              </a>
            </div>
            <p style={{ marginTop: 20, fontSize: 14, color: '#888' }}>
              ✓ Démo gratuite &nbsp; ✓ Livraison 48-72h &nbsp; ✓ Aucun abonnement
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="hero-images">
            {HERO_IMAGES.map((img, i) => (
              <div key={i} style={{
                borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3',
                transform: i % 2 === 1 ? 'translateY(20px)' : 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
              }}>
                <Image src={img.src} alt={img.alt} width={400} height={300} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <StatsSection />

      {/* ── DEMO FORM ── */}
      <DemoFormSection />

      {/* ── NOS MÉTIERS ── */}
      <section id="nos-metiers" style={{ background: '#F8F9FF', padding: '88px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#2275FE', marginBottom: 16, textTransform: 'uppercase', textAlign: 'center' }}>— NOS MÉTIERS —</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', textAlign: 'center', color: '#202020', marginBottom: 12 }}>Un site taillé pour votre corps de métier</h2>
          <p style={{ fontSize: 17, color: '#666', textAlign: 'center', marginBottom: 52, maxWidth: 560, margin: '0 auto 52px' }}>
            Chaque site est personnalisé pour votre activité spécifique, pas un template générique.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="metiers-grid">
            {METIERS.map((m) => (
              <div key={m.name} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E8E8', padding: '24px 20px' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{m.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#202020', marginBottom: 6 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{m.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 40, fontSize: 16, color: '#666' }}>
            Et une centaine d&apos;autres métiers artisanaux —{' '}
            <a href="#demo" style={{ color: '#2275FE', fontWeight: 600 }}>Demandez votre démo gratuite →</a>
          </p>
        </div>
      </section>

      {/* ── TARIF ── */}
      <section id="tarif" style={{ background: '#fff', padding: '88px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#2275FE', marginBottom: 16, textTransform: 'uppercase' }}>— NOTRE OFFRE —</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#202020', marginBottom: 48 }}>Tout compris. Une seule fois.</h2>

          <div className="pricing-card" style={{
            maxWidth: 560, margin: '0 auto', border: '1px solid #E8E8E8', borderRadius: 16,
            padding: '48px 48px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: 64, fontWeight: 800, color: '#2275FE', fontFamily: 'var(--display)', lineHeight: 1, marginBottom: 8 }}>490 €</div>
            <p style={{ fontSize: 15, color: '#888', marginBottom: 40 }}>TTC · Paiement unique · Sans abonnement</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40, textAlign: 'left' }}>
              {INCLUS.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#2275FE', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 16, color: '#202020' }}>{item}</span>
                </div>
              ))}
            </div>

            <a href="/commander" style={{ display: 'block', background: '#2275FE', color: '#fff', borderRadius: 10, padding: '16px', fontSize: 17, fontWeight: 700, textAlign: 'center' }}>
              Commander mon site →
            </a>
          </div>

          <p style={{ marginTop: 24, fontSize: 14, color: '#999' }}>
            Après la première année, renouvellement domaine + hébergement à 99€/an.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── HOW IT WORKS anchor ── */}
      <div id="comment-ca-marche" style={{ position: 'absolute', marginTop: -80 }} aria-hidden="true" />

      {/* ── FOOTER ── */}
      <footer style={{ background: '#1A1A1A', color: '#fff', padding: '64px 24px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, marginBottom: 48 }}>
          <div>
            <Image src="/logo-webpower-white.png" alt="WebPower" width={140} height={36} style={{ objectFit: 'contain', marginBottom: 16 }} />
            <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.6 }}>Le site web des artisans français.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            {[
              ['Comment ça marche', '#comment-ca-marche'],
              ['Nos métiers', '#nos-metiers'],
              ['Tarif', '#tarif'],
              ['FAQ', '#faq'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="footer-nav-link">{label}</a>
            ))}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Vous êtes artisan ?</p>
            <a href="#demo" style={{ display: 'inline-block', background: '#2275FE', color: '#fff', borderRadius: 8, padding: '11px 22px', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
              Obtenir ma démo gratuite
            </a>
            <p style={{ fontSize: 13, color: '#777' }}>sam@yourwebpower.com</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: 24, textAlign: 'center', fontSize: 13, color: '#666' }}>
          © 2026 WebPower. Tous droits réservés.
        </div>
      </footer>
    </>
  )
}
