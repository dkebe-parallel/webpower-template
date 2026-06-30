import type { Metadata } from 'next'
import Image from 'next/image'
import { StickyHeader, WhatsAppWidget } from '../LandingClient'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente — WebPower',
}

export default function CGV() {
  return (
    <>
      <StickyHeader />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 96px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#202020', marginBottom: 8 }}>Conditions Générales de Vente</h1>
        <p style={{ color: '#999', marginBottom: 48 }}>Dernière mise à jour : juin 2026</p>

        <Section title="1. Parties">
          <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations entre :</p>
          <br />
          <p><strong>Parallel Studios FZ-LLC</strong> (ci-après « WebPower »)<br />
          Meydan Grandstand, 6th floor, Meydan Road, Nad Al Sheba, Dubai, U.A.E.<br />
          Contact : <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a></p>
          <br />
          <p>Et toute personne physique ou morale (ci-après « le Client ») souhaitant commander une prestation de création de site web via la plateforme webpower.app.</p>
        </Section>

        <Section title="2. Services">
          <p>WebPower propose la création de sites vitrines professionnels personnalisés pour les artisans et indépendants. Chaque site est créé à partir des informations publiques disponibles sur la fiche Google Business Profile du Client.</p>
          <br />
          <p>La prestation standard inclut :</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Création du site vitrine personnalisé</li>
            <li>Nom de domaine personnalisé pour 1 an</li>
            <li>Hébergement pour 1 an</li>
            <li>Espace de gestion simplifié</li>
            <li>Support par email</li>
            <li>Livraison sous 48 à 72 heures ouvrées</li>
          </ul>
        </Section>

        <Section title="3. Démo gratuite">
          <p>Avant toute commande, WebPower propose au Client une démonstration gratuite et sans engagement de son site vitrine personnalisé. La commande n'est confirmée qu'après validation expresse du Client.</p>
        </Section>

        <Section title="4. Prix et paiement">
          <p>Le prix de la prestation est de <strong>490 € TTC</strong>, paiement unique. Aucun abonnement n'est requis pendant la première année.</p>
          <br />
          <p>À l'issue de la première année, le renouvellement du nom de domaine et de l'hébergement est proposé au tarif de <strong>49 €/an</strong>. Le Client est libre de ne pas renouveler.</p>
          <br />
          <p>Le paiement est effectué en ligne par carte bancaire, via une interface sécurisée. WebPower ne stocke aucune donnée bancaire.</p>
        </Section>

        <Section title="5. Délai de livraison">
          <p>WebPower s'engage à livrer le site dans un délai de 48 à 72 heures ouvrées à compter de la confirmation de commande et du paiement effectif. Ce délai est indicatif et non contractuel.</p>
        </Section>

        <Section title="6. Droit de rétractation">
          <p>Conformément à la réglementation applicable, le Client dispose d'un délai de 14 jours à compter de la commande pour exercer son droit de rétractation, à condition que la prestation n'ait pas encore été exécutée dans son intégralité. Si le Client demande explicitement l'exécution immédiate de la prestation et que celle-ci est livrée avant l'expiration du délai, il perd son droit de rétractation.</p>
        </Section>

        <Section title="7. Propriété du site">
          <p>À la livraison et au paiement complet de la prestation, le Client devient propriétaire du contenu de son site vitrine. WebPower conserve les droits sur les éléments structurels, gabarits et outils techniques sous-jacents.</p>
        </Section>

        <Section title="8. Responsabilité">
          <p>WebPower s'engage à apporter le soin et la diligence nécessaires à la bonne exécution des services. Sa responsabilité ne saurait être engagée en cas de force majeure, de défaillance d'un prestataire tiers (hébergeur, registrar de domaine, etc.) ou d'informations inexactes fournies par le Client.</p>
        </Section>

        <Section title="9. Droit applicable et litiges">
          <p>Les présentes CGV sont soumises au droit des Émirats Arabes Unis. En cas de litige non résolu à l'amiable, les tribunaux compétents de Dubai seront seuls compétents.</p>
          <br />
          <p>Pour toute réclamation, le Client peut contacter WebPower à : <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a></p>
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
