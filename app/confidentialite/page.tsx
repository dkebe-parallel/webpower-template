import type { Metadata } from 'next'
import Image from 'next/image'
import { StickyHeader, WhatsAppWidget } from '../LandingClient'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — WebPower',
}

export default function Confidentialite() {
  return (
    <>
      <StickyHeader />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 96px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#202020', marginBottom: 8 }}>Politique de confidentialité</h1>
        <p style={{ color: '#999', marginBottom: 48 }}>Dernière mise à jour : juin 2026</p>

        <Section title="1. Responsable du traitement">
          <p><strong>Parallel Studios FZ-LLC</strong> (WebPower)<br />
          Meydan Grandstand, 6th floor, Meydan Road, Nad Al Sheba, Dubai, U.A.E.<br />
          Contact : <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a></p>
        </Section>

        <Section title="2. Données collectées">
          <p>WebPower collecte les données suivantes lors de vos interactions avec le site :</p>
          <br />
          <p><strong>Formulaire de demande de démo :</strong></p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>Nom et prénom</li>
            <li>Nom de la société</li>
            <li>Numéro de téléphone</li>
            <li>Adresse email</li>
            <li>Lien Google Maps fourni</li>
          </ul>
          <br />
          <p><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées (via des outils d'analyse anonymisés).</p>
        </Section>

        <Section title="3. Finalités du traitement">
          <p>Les données collectées sont utilisées pour :</p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>Créer et livrer votre site démo personnalisé</li>
            <li>Vous contacter dans le cadre de votre demande</li>
            <li>Gérer la relation commerciale (commande, facturation, support)</li>
            <li>Améliorer nos services (analyses statistiques anonymes)</li>
          </ul>
        </Section>

        <Section title="4. Base légale">
          <p>Le traitement est fondé sur :</p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>L'exécution du contrat ou des démarches précontractuelles (fourniture de la démo et du service)</li>
            <li>Le consentement de l'utilisateur pour les communications marketing</li>
            <li>L'intérêt légitime de WebPower pour l'amélioration de ses services</li>
          </ul>
        </Section>

        <Section title="5. Partage des données">
          <p>WebPower ne vend ni ne loue vos données personnelles à des tiers. Vos données peuvent être partagées avec :</p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li><strong>Airtable</strong> — stockage des demandes de démo (USA, couvert par des clauses contractuelles types)</li>
            <li><strong>Vercel</strong> — hébergement du site (USA, couvert par des clauses contractuelles types)</li>
            <li><strong>Stripe</strong> — paiement sécurisé (USA/Europe, certifié PCI DSS)</li>
          </ul>
        </Section>

        <Section title="6. Durée de conservation">
          <p>Vos données sont conservées :</p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>Données clients actifs : pendant la durée de la relation commerciale + 3 ans</li>
            <li>Données prospects non convertis : 1 an après le dernier contact</li>
            <li>Données de facturation : 10 ans (obligation légale)</li>
          </ul>
        </Section>

        <Section title="7. Vos droits">
          <p>Conformément à la réglementation applicable sur la protection des données, vous disposez des droits suivants :</p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement (« droit à l'oubli »)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
          </ul>
          <br />
          <p>Pour exercer ces droits, contactez-nous à : <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a></p>
        </Section>

        <Section title="8. Cookies">
          <p>Le site webpower.app utilise uniquement des cookies techniques nécessaires au bon fonctionnement du service (session, préférences). Aucun cookie publicitaire n'est utilisé sans votre consentement préalable.</p>
        </Section>

        <Section title="9. Sécurité">
          <p>WebPower met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation. Les communications entre votre navigateur et nos serveurs sont chiffrées via HTTPS/TLS.</p>
        </Section>

        <Section title="10. Modifications">
          <p>WebPower se réserve le droit de modifier la présente politique à tout moment. La version en vigueur est toujours accessible sur cette page. En cas de modification substantielle, nous vous en informerons par email si vous êtes client.</p>
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
