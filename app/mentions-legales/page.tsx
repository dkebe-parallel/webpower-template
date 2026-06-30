import type { Metadata } from 'next'
import Image from 'next/image'
import { StickyHeader, WhatsAppWidget } from '../LandingClient'

export const metadata: Metadata = {
  title: 'Mentions légales — WebPower',
  description: 'Mentions légales du site webpower.app, édité par Parallel Studios FZ-LLC, Dubai, U.A.E.',
}

export default function MentionsLegales() {
  return (
    <>
      <StickyHeader />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 96px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#202020', marginBottom: 8 }}>Mentions légales</h1>
        <p style={{ color: '#999', marginBottom: 48 }}>Dernière mise à jour : juin 2026</p>

        <Section title="1. Éditeur du site">
          <p>Le site <strong>webpower.app</strong> est édité par :</p>
          <br />
          <p>
            <strong>Parallel Studios FZ-LLC</strong><br />
            Société à responsabilité limitée de zone franche, immatriculée et opérant conformément aux lois des Émirats Arabes Unis (UAE Free Zone).<br />
            <br />
            Adresse du siège social :<br />
            Meydan Grandstand, 6th floor<br />
            Meydan Road, Nad Al Sheba<br />
            Dubai, U.A.E.
          </p>
          <br />
          <p><strong>Contact :</strong> <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a></p>
          <p>Toute correspondance relative au fonctionnement du site ou aux services proposés peut être adressée à l'adresse email ci-dessus.</p>
        </Section>

        <Section title="2. Directeur de la publication">
          <p>Le directeur de la publication est le représentant légal en exercice de Parallel Studios FZ-LLC. Pour toute question éditoriale, contactez : <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a>.</p>
        </Section>

        <Section title="3. Hébergement">
          <p>Le site webpower.app est hébergé par :</p>
          <br />
          <p>
            <strong>Vercel Inc.</strong><br />
            440 N Barranca Ave #4133<br />
            Covina, CA 91723, États-Unis<br />
            Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2275FE' }}>vercel.com</a>
          </p>
          <br />
          <p>Vercel est un prestataire d'hébergement cloud soumis aux lois américaines. Les données transitant par leur infrastructure peuvent être traitées aux États-Unis. Pour plus d'informations sur leurs garanties de protection des données, consulter la politique de confidentialité de Vercel (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#2275FE' }}>vercel.com/legal/privacy-policy</a>).</p>
        </Section>

        <Section title="4. Propriété intellectuelle">
          <p><strong>4.1 — Marque et identité</strong></p>
          <p>La marque « WebPower », le logo WebPower, la charte graphique et tous les éléments distinctifs associés sont la propriété exclusive de Parallel Studios FZ-LLC. Toute reproduction, imitation ou usage sans autorisation préalable écrite constitue une contrefaçon.</p>
          <br />
          <p><strong>4.2 — Contenus du site</strong></p>
          <p>L'ensemble des contenus présents sur webpower.app — textes, articles, illustrations, photographies, vidéos, icônes, logiciels, gabarits de pages, code source et tout autre élément — est protégé par le droit d'auteur et reste la propriété de Parallel Studios FZ-LLC ou de ses fournisseurs de contenus, sauf mention contraire expresse.</p>
          <br />
          <p>Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces éléments, même partielle, est strictement interdite sans l'accord préalable et écrit de Parallel Studios FZ-LLC.</p>
          <br />
          <p><strong>4.3 — Sites livrés aux clients</strong></p>
          <p>À la suite du paiement intégral de la prestation, WebPower accorde au client une licence d'utilisation complète et permanente sur les contenus spécifiquement créés pour lui (textes rédigés, mise en page personnalisée). Parallel Studios FZ-LLC conserve les droits sur l'architecture technique, les gabarits structurels, les outils et frameworks utilisés pour développer le site.</p>
          <br />
          <p><strong>4.4 — Contenus tiers</strong></p>
          <p>Certains éléments visuels utilisés dans les démos et les sites livrés peuvent provenir de banques d'images libres de droits (Unsplash, etc.). Les droits afférents restent ceux de leurs auteurs respectifs.</p>
        </Section>

        <Section title="5. Limitation de responsabilité">
          <p><strong>5.1 — Disponibilité du service</strong></p>
          <p>Parallel Studios FZ-LLC met tout en œuvre pour assurer la disponibilité du site webpower.app. Cependant, l'accès au site peut être temporairement interrompu pour des raisons de maintenance, de mise à jour, ou à la suite d'un incident technique indépendant de notre volonté (panne d'hébergeur, défaillance du réseau, force majeure). Parallel Studios FZ-LLC ne saurait être tenue responsable des dommages résultant de ces indisponibilités.</p>
          <br />
          <p><strong>5.2 — Exactitude des informations</strong></p>
          <p>Les informations publiées sur webpower.app sont fournies à titre indicatif et peuvent être modifiées à tout moment. Parallel Studios FZ-LLC s'efforce de maintenir ces informations à jour mais ne garantit pas leur exhaustivité ni leur exactitude à tout instant.</p>
          <br />
          <p><strong>5.3 — Liens hypertextes sortants</strong></p>
          <p>Le site peut contenir des liens vers des sites tiers. Parallel Studios FZ-LLC n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité ou leurs pratiques en matière de données personnelles.</p>
          <br />
          <p><strong>5.4 — Responsabilité du visiteur</strong></p>
          <p>L'utilisateur du site est seul responsable de l'usage qu'il fait des informations mises à disposition. L'utilisation du site implique l'acceptation pleine et entière des présentes mentions légales.</p>
        </Section>

        <Section title="6. Données personnelles">
          <p>Le traitement des données personnelles collectées sur le site webpower.app est régi par notre <a href="/confidentialite" style={{ color: '#2275FE' }}>Politique de confidentialité</a>, disponible à tout moment depuis le pied de page du site. Conformément au Règlement Général sur la Protection des Données (RGPD) et aux textes applicables, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et de portabilité de vos données, exercçable à l'adresse : <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a>.</p>
        </Section>

        <Section title="7. Cookies">
          <p>Le site webpower.app utilise des cookies techniques nécessaires à son bon fonctionnement. Ces cookies ne collectent pas de données personnelles à des fins publicitaires ou de traçage commercial. Pour plus d'informations, consultez notre <a href="/confidentialite" style={{ color: '#2275FE' }}>Politique de confidentialité</a>.</p>
        </Section>

        <Section title="8. Médiation à la consommation">
          <p>Conformément aux obligations légales applicables aux professionnels européens et à la Directive 2013/11/UE relative au règlement extrajudiciaire des litiges de consommation, les consommateurs résidant dans l'Union européenne peuvent, en cas de litige non résolu avec WebPower, recourir à un médiateur de la consommation. WebPower s'engage à indiquer le ou les médiateurs compétents sur simple demande à : <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a>.</p>
          <br />
          <p>La plateforme européenne de règlement en ligne des litiges (RLL) est accessible à l'adresse suivante : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: '#2275FE' }}>https://ec.europa.eu/consumers/odr</a>.</p>
        </Section>

        <Section title="9. Droit applicable et juridiction compétente">
          <p>Les présentes mentions légales sont régies par le droit des Émirats Arabes Unis. En cas de litige concernant l'interprétation ou l'exécution des présentes, et à défaut de résolution amiable dans un délai de trente (30) jours suivant la notification du litige par courrier électronique, les tribunaux compétents de Dubai (UAE) seront seuls compétents, sans préjudice des dispositions d'ordre public applicables aux consommateurs résidant dans l'Union européenne.</p>
        </Section>
      </main>
      <LegalFooter />
      <WhatsAppWidget />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#202020', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #E8E8E8' }}>{title}</h2>
      <div style={{ fontSize: 15, color: '#444', lineHeight: 1.8 }}>{children}</div>
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
