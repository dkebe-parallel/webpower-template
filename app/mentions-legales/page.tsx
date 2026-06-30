import type { Metadata } from 'next'
import Image from 'next/image'
import { StickyHeader, WhatsAppWidget } from '../LandingClient'

export const metadata: Metadata = {
  title: 'Mentions légales — WebPower',
}

export default function MentionsLegales() {
  return (
    <>
      <StickyHeader />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 96px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#202020', marginBottom: 8 }}>Mentions légales</h1>
        <p style={{ color: '#999', marginBottom: 48 }}>Dernière mise à jour : juin 2026</p>

        <Section title="Éditeur du site">
          <p>Le site <strong>webpower.app</strong> est édité par :</p>
          <br />
          <p><strong>Parallel Studios FZ-LLC</strong><br />
          Meydan Grandstand, 6th floor<br />
          Meydan Road, Nad Al Sheba<br />
          Dubai, U.A.E.</p>
          <br />
          <p>Contact : <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a></p>
        </Section>

        <Section title="Directeur de la publication">
          <p>Le directeur de la publication est le représentant légal de Parallel Studios FZ-LLC.</p>
        </Section>

        <Section title="Hébergement">
          <p>Le site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 900, San Francisco, CA 94104, États-Unis.<br />
          Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2275FE' }}>vercel.com</a></p>
        </Section>

        <Section title="Propriété intellectuelle">
          <p>L'ensemble des contenus présents sur le site webpower.app (textes, images, graphismes, logo, icônes, sons, logiciels…) est la propriété exclusive de Parallel Studios FZ-LLC, à l'exception des éléments tiers expressément désignés.</p>
          <br />
          <p>Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces éléments est strictement interdite sans l'accord exprès par écrit de Parallel Studios FZ-LLC.</p>
        </Section>

        <Section title="Données personnelles">
          <p>Les données collectées via les formulaires du site sont utilisées uniquement dans le cadre de la fourniture des services WebPower. Elles ne sont jamais revendues à des tiers. Pour en savoir plus, consultez notre <a href="/confidentialite" style={{ color: '#2275FE' }}>Politique de confidentialité</a>.</p>
        </Section>

        <Section title="Cookies">
          <p>Le site webpower.app peut utiliser des cookies techniques nécessaires au bon fonctionnement du service. Aucun cookie publicitaire ou de tracking tiers n'est utilisé sans votre consentement.</p>
        </Section>

        <Section title="Droit applicable">
          <p>Les présentes mentions légales sont soumises au droit des Émirats Arabes Unis. En cas de litige, les tribunaux compétents de Dubai seront seuls compétents.</p>
        </Section>
      </main>
      <LegalFooter />
      <WhatsAppWidget />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#202020', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #E8E8E8' }}>{title}</h2>
      <div style={{ fontSize: 15, color: '#444', lineHeight: 1.75 }}>{children}</div>
    </section>
  )
}

function LegalFooter() {
  return (
    <footer style={{ background: '#111827', color: '#fff', padding: '32px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <a href="/">
          <Image src="/logo-webpower-white.png" alt="WebPower" width={120} height={30} style={{ objectFit: 'contain' }} />
        </a>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[['Mentions légales', '/mentions-legales'], ['CGV', '/cgv'], ['Confidentialité', '/confidentialite']].map(([l, h]) => (
            <a key={l} href={h} style={{ fontSize: 13, color: '#9CA3AF' }}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize: 13, color: '#4B5563', margin: 0 }}>© 2025-2026 WebPower</p>
      </div>
    </footer>
  )
}
