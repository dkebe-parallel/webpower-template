import type { Metadata } from 'next'
import Image from 'next/image'
import { StickyHeader, WhatsAppWidget } from '../LandingClient'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — WebPower',
  description: 'Politique de confidentialité de WebPower : données collectées, finalités, droits RGPD, cookies.',
}

export default function Confidentialite() {
  return (
    <>
      <StickyHeader />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 96px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#202020', marginBottom: 8 }}>Politique de confidentialité</h1>
        <p style={{ color: '#999', marginBottom: 48 }}>Dernière mise à jour : juin 2026 — Version 1.0</p>

        <Section title="1. Responsable du traitement">
          <p>Le responsable du traitement des données personnelles collectées via webpower.app est :</p>
          <br />
          <p>
            <strong>Parallel Studios FZ-LLC</strong><br />
            Meydan Grandstand, 6th floor<br />
            Meydan Road, Nad Al Sheba<br />
            Dubai, U.A.E.<br />
            <br />
            Contact : <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a>
          </p>
          <br />
          <p>Bien que Parallel Studios FZ-LLC soit établie hors de l'Union européenne, la présente politique est rédigée en conformité avec le Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679), applicable dès lors que des données de personnes résidant dans l'UE sont traitées dans le cadre d'une offre de services qui leur est adressée.</p>
        </Section>

        <Section title="2. Données collectées par point de collecte">
          <p><strong>2.1 — Formulaire de demande de démo</strong></p>
          <p>Lors d'une demande de démo, WebPower collecte :</p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>Nom et prénom du contact</li>
            <li>Nom de la société</li>
            <li>Numéro de téléphone</li>
            <li>Adresse email professionnelle</li>
            <li>Lien Google Maps de la fiche Google Business Profile</li>
          </ul>
          <br />
          <p><strong>2.2 — Tunnel de commande</strong></p>
          <p>Lors de la passation d'une Commande, les données suivantes sont collectées ou générées :</p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>Identité complète (nom, prénom) et coordonnées (email, téléphone)</li>
            <li>Nom de domaine choisi</li>
            <li>Données de paiement (traitées directement et exclusivement par Stripe — WebPower ne stocke aucun numéro de carte)</li>
            <li>Identifiant de transaction Stripe</li>
            <li>Date et heure de la Commande</li>
          </ul>
          <br />
          <p><strong>2.3 — Navigation sur le site</strong></p>
          <p>À l'occasion de la navigation sur webpower.app, des données techniques peuvent être collectées automatiquement :</p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>Adresse IP (pseudonymisée ou tronquée)</li>
            <li>Type et version du navigateur</li>
            <li>Système d'exploitation</li>
            <li>Pages visitées et durée de visite</li>
            <li>Source d'acquisition (URL de référence)</li>
          </ul>
          <br />
          <p><strong>2.4 — Communications (email et SMS)</strong></p>
          <p>Lorsque WebPower vous contacte (envoi d'un lien de démo, confirmation de commande, notification de livraison), certaines métadonnées de communication peuvent être enregistrées (date d'envoi, statut de délivrance).</p>
        </Section>

        <Section title="3. Finalités et bases légales">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F8F9FF' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E8E8E8', color: '#202020' }}>Finalité</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E8E8E8', color: '#202020' }}>Base légale</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Création et livraison du site démo personnalisé', 'Exécution des mesures précontractuelles (art. 6.1.b RGPD)'],
                ['Traitement de la Commande et facturation', 'Exécution du contrat (art. 6.1.b RGPD)'],
                ['Communication liée à la prestation (livraison, support, renouvellement)', 'Exécution du contrat (art. 6.1.b RGPD)'],
                ['Conservation des preuves de transaction', 'Obligation légale (art. 6.1.c RGPD)'],
                ["Envoi de communications commerciales (nouvelles offres, mises à jour) aux clients existants", 'Intérêt légitime (art. 6.1.f RGPD) ou consentement selon le canal'],
                ['Amélioration des services (analyses statistiques agrégées)', 'Intérêt légitime (art. 6.1.f RGPD)'],
                ['Prévention de la fraude', 'Intérêt légitime (art. 6.1.f RGPD)'],
              ].map(([f, b], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8F9FF' }}>
                  <td style={{ padding: '9px 12px', border: '1px solid #E8E8E8', color: '#444', lineHeight: 1.5 }}>{f}</td>
                  <td style={{ padding: '9px 12px', border: '1px solid #E8E8E8', color: '#444', lineHeight: 1.5 }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="4. Destinataires et sous-traitants">
          <p>Vos données ne sont jamais vendues ni louées à des tiers. Elles peuvent être transmises aux sous-traitants suivants, dans le strict cadre de l'exécution des services :</p>
          <br />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F8F9FF' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E8E8E8', color: '#202020' }}>Sous-traitant</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E8E8E8', color: '#202020' }}>Finalité</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E8E8E8', color: '#202020' }}>Pays / Garanties</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Airtable (Formagrid Inc.)', "Stockage des demandes de démo et gestion des contacts", 'USA — Clauses contractuelles types (CCT)'],
                ['Vercel Inc.', 'Hébergement du site webpower.app', 'USA — Clauses contractuelles types (CCT)'],
                ['Stripe Inc.', 'Traitement sécurisé des paiements par carte', 'USA/Europe — Certifié PCI DSS niveau 1 + CCT'],
                ['Opérateur SMS (sous-traitant)', 'Envoi de communications SMS liées aux démos', 'France ou UE — Accord de sous-traitance RGPD'],
              ].map(([n, f, g], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8F9FF' }}>
                  <td style={{ padding: '9px 12px', border: '1px solid #E8E8E8', color: '#444', fontWeight: 600 }}>{n}</td>
                  <td style={{ padding: '9px 12px', border: '1px solid #E8E8E8', color: '#444' }}>{f}</td>
                  <td style={{ padding: '9px 12px', border: '1px solid #E8E8E8', color: '#444' }}>{g}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <p>Des clauses contractuelles types (CCT) approuvées par la Commission européenne ont été mises en place avec chaque sous-traitant établi hors de l'EEE, conformément à l'article 46 du RGPD.</p>
        </Section>

        <Section title="5. Durées de conservation">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F8F9FF' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E8E8E8', color: '#202020' }}>Catégorie de données</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E8E8E8', color: '#202020' }}>Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Données de demande de démo (prospect non converti)', '1 an à compter du dernier contact'],
                ['Données clients (commandes, accès, historique)', 'Durée de la relation commerciale + 3 ans'],
                ['Données de facturation (factures, transactions)', '10 ans (obligation légale comptable)'],
                ['Données de navigation (logs serveur)', '12 mois maximum'],
                ['Données de communication SMS/email', '3 ans à compter de l\'envoi'],
              ].map(([c, d], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8F9FF' }}>
                  <td style={{ padding: '9px 12px', border: '1px solid #E8E8E8', color: '#444' }}>{c}</td>
                  <td style={{ padding: '9px 12px', border: '1px solid #E8E8E8', color: '#444' }}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <p>À l'expiration de ces délais, les données sont supprimées ou anonymisées de manière irréversible.</p>
        </Section>

        <Section title="6. Vos droits RGPD">
          <p>Conformément au RGPD, vous disposez des droits suivants sur les données vous concernant :</p>
          <br />
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}><strong>Droit d'accès (art. 15)</strong> : obtenir une copie des données personnelles que WebPower détient sur vous.</li>
            <li style={{ marginBottom: 10 }}><strong>Droit de rectification (art. 16)</strong> : demander la correction de données inexactes ou incomplètes.</li>
            <li style={{ marginBottom: 10 }}><strong>Droit à l'effacement (art. 17)</strong> : demander la suppression de vos données, dans les limites des obligations légales de conservation.</li>
            <li style={{ marginBottom: 10 }}><strong>Droit à la limitation du traitement (art. 18)</strong> : demander la suspension temporaire du traitement de vos données.</li>
            <li style={{ marginBottom: 10 }}><strong>Droit à la portabilité (art. 20)</strong> : recevoir vos données dans un format structuré, couramment utilisé et lisible par machine.</li>
            <li style={{ marginBottom: 10 }}><strong>Droit d'opposition (art. 21)</strong> : vous opposer au traitement de vos données fondé sur l'intérêt légitime, notamment à des fins de prospection commerciale.</li>
            <li style={{ marginBottom: 10 }}><strong>Retrait du consentement</strong> : lorsque le traitement est fondé sur votre consentement, vous pouvez le retirer à tout moment, sans que cela affecte la licéité des traitements effectués avant ce retrait.</li>
            <li style={{ marginBottom: 10 }}><strong>Droit de réclamation (art. 77)</strong> : introduire une réclamation auprès de l'autorité de contrôle compétente. Pour les résidents français : la CNIL (www.cnil.fr), 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.</li>
          </ul>
          <br />
          <p>Pour exercer l'un de ces droits, adressez votre demande par email à : <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a>, en précisant votre identité et le droit que vous souhaitez exercer. WebPower s'engage à répondre dans un délai maximum d'un (1) mois à compter de la réception de la demande.</p>
        </Section>

        <Section title="7. Sécurité des données">
          <p>WebPower met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, la perte, la destruction ou l'altération. Ces mesures comprennent notamment :</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}>Chiffrement des communications via HTTPS/TLS</li>
            <li style={{ marginBottom: 8 }}>Stockage des données sur des infrastructures sécurisées (Vercel, Airtable)</li>
            <li style={{ marginBottom: 8 }}>Accès aux données restreint aux seuls membres de l'équipe qui en ont besoin pour l'exécution du service</li>
            <li style={{ marginBottom: 8 }}>Paiements traités exclusivement via Stripe (PCI DSS niveau 1) — aucune donnée bancaire ne transite ni n'est stockée par WebPower</li>
            <li style={{ marginBottom: 8 }}>Revue périodique des accès et des droits</li>
          </ul>
          <br />
          <p>En cas de violation de données à caractère personnel susceptible d'engendrer un risque élevé pour vos droits et libertés, WebPower s'engage à vous en informer dans les meilleurs délais et à notifier l'autorité de contrôle compétente dans les 72 heures conformément à l'article 33 du RGPD.</p>
        </Section>

        <Section title="8. Politique de cookies">
          <p><strong>8.1 — Cookies strictement nécessaires</strong></p>
          <p>WebPower utilise uniquement des cookies techniques indispensables au bon fonctionnement du site (gestion de la session, préférence de langue). Ces cookies ne nécessitent pas votre consentement.</p>
          <br />
          <p><strong>8.2 — Cookies analytiques et de mesure d'audience</strong></p>
          <p>Si WebPower recourt à des outils d'analyse d'audience (tel que Vercel Analytics ou équivalent), ces outils sont configurés pour fonctionner sans dépôt de cookies traçants ou avec des données strictement anonymisées, ne nécessitant pas de consentement. Dans le cas contraire, un bandeau de consentement vous sera présenté.</p>
          <br />
          <p><strong>8.3 — Cookies tiers</strong></p>
          <p>Aucun cookie publicitaire ou de ciblage tiers n'est utilisé sur webpower.app sans votre consentement préalable explicite.</p>
          <br />
          <p><strong>8.4 — Gestion des cookies</strong></p>
          <p>Vous pouvez à tout moment paramétrer votre navigateur pour refuser ou supprimer les cookies. Cette configuration peut affecter le bon fonctionnement de certaines fonctionnalités du site. La procédure de gestion des cookies diffère selon le navigateur utilisé (consultez la rubrique « Aide » de votre navigateur).</p>
        </Section>

        <Section title="9. Mineurs">
          <p>Le service WebPower est exclusivement destiné à des professionnels exerçant une activité artisanale ou commerciale. Il n'est pas destiné aux personnes mineures. WebPower ne collecte pas sciemment de données personnelles relatives à des mineurs. Si vous êtes parent ou tuteur légal et estimez que votre enfant nous a communiqué des données personnelles, veuillez nous contacter à <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a> afin que nous procédions à leur suppression.</p>
        </Section>

        <Section title="10. Modifications de la politique">
          <p>WebPower se réserve le droit de modifier la présente politique de confidentialité à tout moment, notamment pour se conformer à des évolutions réglementaires ou à des changements dans ses pratiques de traitement. La version en vigueur est toujours accessible sur cette page, avec sa date de mise à jour.</p>
          <br />
          <p>En cas de modification substantielle affectant vos droits, vous en serez informé par email si vous êtes client actif, ou via un avis visible sur le site.</p>
        </Section>

        <Section title="11. Contact — Délégué à la protection des données">
          <p>Pour toute question relative à la présente politique ou pour exercer vos droits, vous pouvez contacter le responsable de la confidentialité chez WebPower :</p>
          <br />
          <p>
            <strong>Email :</strong> <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a><br />
            <strong>Objet conseillé :</strong> « Demande RGPD — [votre nom] »<br />
            <strong>Délai de réponse :</strong> 30 jours maximum à compter de la réception de votre demande.
          </p>
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
