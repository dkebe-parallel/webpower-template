import type { Metadata } from 'next'
import Image from 'next/image'
import { StickyHeader, WhatsAppWidget } from '../LandingClient'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente — WebPower',
  description: 'CGV de WebPower : conditions de vente, prix, livraison, droits et obligations des parties.',
}

export default function CGV() {
  return (
    <>
      <StickyHeader />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 96px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#202020', marginBottom: 8 }}>Conditions Générales de Vente</h1>
        <p style={{ color: '#999', marginBottom: 48 }}>Dernière mise à jour : juin 2026 — Version 1.0</p>

        <Section title="1. Définitions">
          <p>Dans les présentes Conditions Générales de Vente (ci-après « CGV »), les termes suivants ont la signification qui leur est attribuée ci-dessous :</p>
          <br />
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}><strong>« WebPower »</strong> ou <strong>« Prestataire »</strong> : la société Parallel Studios FZ-LLC, société de zone franche immatriculée aux Émirats Arabes Unis, éditrice du site webpower.app et prestataire des services définis aux présentes.</li>
            <li style={{ marginBottom: 8 }}><strong>« Client »</strong> : toute personne physique ou morale, agissant dans le cadre de son activité professionnelle artisanale ou indépendante, qui demande une Démo ou passe une Commande auprès de WebPower.</li>
            <li style={{ marginBottom: 8 }}><strong>« Démo »</strong> ou <strong>« Site démo »</strong> : le site vitrine personnalisé, gratuit et sans engagement, créé par WebPower à partir des informations publiques de la fiche Google Business Profile du Client, et mis à sa disposition aux fins de validation avant toute commande.</li>
            <li style={{ marginBottom: 8 }}><strong>« Site »</strong> ou <strong>« Site vitrine »</strong> : le site web professionnel final, hébergé en ligne sur le domaine choisi par le Client, livré après confirmation de Commande et paiement intégral.</li>
            <li style={{ marginBottom: 8 }}><strong>« Commande »</strong> : l'acte par lequel le Client, après avoir validé la Démo, confirme son souhait d'acquérir la prestation complète de WebPower en acceptant les présentes CGV et en effectuant le paiement correspondant.</li>
            <li style={{ marginBottom: 8 }}><strong>« Service »</strong> : l'ensemble des prestations fournies par WebPower comprenant la création, la personnalisation, l'hébergement et la maintenance de base du Site vitrine, telles que décrites à l'article 3.</li>
          </ul>
        </Section>

        <Section title="2. Champ d'application">
          <p>Les présentes CGV s'appliquent à toute Commande passée par un Client auprès de WebPower via le site webpower.app. Elles prévalent sur tout autre document émanant du Client. Le fait de passer une Commande implique l'acceptation pleine, entière et sans réserve des présentes CGV.</p>
          <br />
          <p>WebPower se réserve le droit de modifier les présentes CGV à tout moment. Les CGV applicables à une Commande sont celles en vigueur au moment de la validation de ladite Commande.</p>
        </Section>

        <Section title="3. Capacité à contracter">
          <p>Le Client déclare avoir la pleine capacité juridique pour contracter, c'est-à-dire être une personne physique majeure ou une personne morale représentée par une personne habilitée à l'engager. Le Service est exclusivement destiné à des professionnels exerçant une activité artisanale, commerciale ou libérale. Il n'est pas destiné aux consommateurs particuliers agissant en dehors de tout cadre professionnel.</p>
        </Section>

        <Section title="4. Description du processus et des Services">
          <p><strong>4.1 — Demande de Démo (sans engagement)</strong></p>
          <p>Le Client initie la relation en soumettant le lien de sa fiche Google Business Profile via le formulaire disponible sur webpower.app. Cette démarche est entièrement gratuite et ne constitue aucun engagement commercial.</p>
          <br />
          <p><strong>4.2 — Génération de la Démo</strong></p>
          <p>WebPower analyse les informations publiquement disponibles sur la fiche Google Maps du Client (nom, avis, services, localisation, photos) et génère un Site démo personnalisé dans un délai indicatif de 48 à 72 heures ouvrées. Ce site est accessible via un lien unique communiqué au Client.</p>
          <br />
          <p><strong>4.3 — Validation par le Client</strong></p>
          <p>Le Client examine librement la Démo. S'il souhaite acquérir le Service, il procède à la Commande selon les modalités décrites à l'article 5. En l'absence de Commande dans un délai raisonnable, aucune obligation ne pèse sur le Client.</p>
          <br />
          <p><strong>4.4 — Commande et paiement</strong></p>
          <p>La Commande est formalisée en ligne par l'acceptation des présentes CGV et le paiement intégral du prix via la plateforme de paiement sécurisé Stripe. La Commande n'est définitivement enregistrée qu'après réception du paiement effectif.</p>
          <br />
          <p><strong>4.5 — Personnalisation et choix du domaine</strong></p>
          <p>Lors de la Commande, le Client choisit son nom de domaine définitif (sous réserve de disponibilité). WebPower procède à l'enregistrement du domaine et à la personnalisation finale du Site.</p>
          <br />
          <p><strong>4.6 — Livraison</strong></p>
          <p>WebPower met le Site en ligne et communique au Client ses accès par email dans un délai indicatif de 48 à 72 heures ouvrées suivant la confirmation de Commande et le paiement effectif. Ce délai est donné à titre indicatif et ne constitue pas une obligation contractuelle de résultat sur le délai.</p>
          <br />
          <p><strong>4.7 — Hébergement et domaine (première année)</strong></p>
          <p>L'hébergement du Site et le nom de domaine sont inclus pour une durée de 12 mois à compter de la date de mise en ligne.</p>
          <br />
          <p><strong>4.8 — Renouvellement annuel</strong></p>
          <p>À l'issue de la première année, WebPower proposera au Client le renouvellement de l'hébergement et du nom de domaine au tarif de 49 € TTC par an. Le Client sera informé par email au moins 30 jours avant l'échéance. Le renouvellement est facultatif. En l'absence de renouvellement, le Site sera mis hors ligne selon les modalités prévues à l'article 12.</p>
        </Section>

        <Section title="5. Prix et modalités de paiement">
          <p><strong>5.1 — Prix de la prestation initiale</strong></p>
          <p>Le prix de la prestation complète WebPower (création de site + domaine + hébergement 1 an + espace de gestion + support) est de <strong>490 € TTC</strong>, payable en une seule fois au moment de la Commande. Ce prix est libellé en euros (EUR).</p>
          <br />
          <p><strong>5.2 — Renouvellement</strong></p>
          <p>Le renouvellement annuel du nom de domaine et de l'hébergement est proposé au tarif de <strong>49 € TTC par an</strong>.</p>
          <br />
          <p><strong>5.3 — Modalités de paiement</strong></p>
          <p>Le paiement s'effectue exclusivement en ligne, par carte bancaire, via la plateforme de paiement sécurisée Stripe (certifiée PCI DSS niveau 1). WebPower ne stocke à aucun moment les coordonnées bancaires du Client. L'ensemble des données de paiement est chiffré et traité directement par Stripe.</p>
          <br />
          <p><strong>5.4 — Confirmation de paiement</strong></p>
          <p>Un email de confirmation est adressé au Client à l'issue de chaque paiement réussi. Cet email vaut reçu de paiement.</p>
        </Section>

        <Section title="6. Absence de droit de rétractation">
          <p><strong>6.1 — Principe et fondement</strong></p>
          <p>Conformément à l'article L221-28 du Code de la consommation (France) et aux dispositions équivalentes de la Directive européenne 2011/83/UE relative aux droits des consommateurs, le droit de rétractation ne s'applique pas aux contrats de fourniture de services pleinement exécutés avant la fin du délai de rétractation, dès lors que l'exécution a commencé avec l'accord préalable et exprès du consommateur, et que ce dernier a reconnu qu'il perdrait son droit de rétractation.</p>
          <br />
          <p><strong>6.2 — Application au Service WebPower</strong></p>
          <p>Le processus WebPower est structuré de façon à informer et protéger le Client :</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}>Le Client consulte gratuitement et sans engagement son Site démo personnalisé <em>avant</em> tout engagement financier.</li>
            <li style={{ marginBottom: 8 }}>La Commande n'intervient qu'après validation expresse de la Démo par le Client, qui décide en pleine connaissance de cause.</li>
            <li style={{ marginBottom: 8 }}>Au moment de la Commande, le Client accepte expressément les présentes CGV et reconnaît que la prestation de personnalisation définitive, d'enregistrement du domaine et de mise en ligne du Site débutera immédiatement après paiement.</li>
            <li style={{ marginBottom: 8 }}>En conséquence, en passant Commande, le Client renonce expressément à son éventuel droit de rétractation et reconnaît qu'il ne pourra pas l'exercer dès lors que la prestation aura été pleinement engagée à sa demande expresse.</li>
          </ul>
          <br />
          <p><strong>6.3 — Remboursement exceptionnel</strong></p>
          <p>Sans reconnaissance de droit, WebPower se réserve la faculté d'examiner, au cas par cas, toute demande de remboursement formulée dans les 48 heures suivant la Commande, si la prestation de personnalisation n'a pas encore été engagée. Toute demande doit être adressée à <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a>. WebPower s'engage à y répondre dans un délai de 5 jours ouvrés.</p>
        </Section>

        <Section title="7. Obligations du Client">
          <p>Le Client s'engage à :</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}>Fournir des informations exactes, complètes et à jour lors de sa demande de Démo et de sa Commande (nom, société, téléphone, email, lien Google Maps).</li>
            <li style={{ marginBottom: 8 }}>S'assurer qu'il dispose des droits nécessaires sur tout contenu (photographies, textes, logo) qu'il transmet à WebPower pour intégration dans son Site.</li>
            <li style={{ marginBottom: 8 }}>Utiliser son Site vitrine conformément à la législation applicable et s'abstenir de tout contenu illicite, diffamatoire ou contrefaisant.</li>
            <li style={{ marginBottom: 8 }}>Maintenir à jour ses coordonnées de contact afin de recevoir les communications de WebPower (confirmation de livraison, préavis de renouvellement, notifications de maintenance).</li>
          </ul>
        </Section>

        <Section title="8. Obligations de WebPower">
          <p>WebPower s'engage à :</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}>Livrer un Site conforme à la Démo préalablement validée par le Client, dans le respect des délais indicatifs annoncés.</li>
            <li style={{ marginBottom: 8 }}>Assurer la mise en ligne et l'accessibilité du Site pendant toute la durée de la période d'hébergement souscrite, sous réserve des cas de force majeure et des maintenances planifiées.</li>
            <li style={{ marginBottom: 8 }}>Communiquer au Client ses accès à l'espace de gestion dans les meilleurs délais suivant la livraison.</li>
            <li style={{ marginBottom: 8 }}>Traiter les données personnelles du Client conformément à la <a href="/confidentialite" style={{ color: '#2275FE' }}>Politique de confidentialité</a>.</li>
          </ul>
        </Section>

        <Section title="9. Garanties et limitations de responsabilité">
          <p><strong>9.1 — Garanties de WebPower</strong></p>
          <p>WebPower garantit que le Site livré sera conforme à la Démo validée. En cas de non-conformité avérée, WebPower s'engage à corriger le Site dans un délai raisonnable, à ses frais exclusifs.</p>
          <br />
          <p><strong>9.2 — Limitation de responsabilité</strong></p>
          <p>La responsabilité de WebPower est limitée aux dommages directs et prévisibles résultant d'un manquement prouvé à ses obligations contractuelles. WebPower ne saurait être tenu responsable des dommages indirects, pertes de chiffre d'affaires, pertes de clientèle ou préjudices d'image. En tout état de cause, la responsabilité de WebPower ne peut excéder le montant effectivement perçu au titre de la Commande concernée.</p>
          <br />
          <p><strong>9.3 — Force majeure</strong></p>
          <p>WebPower ne saurait être tenu responsable de tout retard ou inexécution résultant d'un cas de force majeure tel que défini par la jurisprudence applicable, notamment : catastrophe naturelle, défaillance d'un opérateur de réseau, panne majeure d'infrastructure d'hébergement, cyberattaque massive, décision d'une autorité gouvernementale.</p>
        </Section>

        <Section title="10. Propriété du site livré">
          <p>À la date de livraison du Site et après réception du paiement intégral, WebPower accorde au Client une licence d'utilisation définitive, non exclusive et non transférable sur les contenus personnalisés créés pour lui (textes, mise en page spécifique à son activité). Le Client devient ainsi propriétaire de l'usage de son Site vitrine.</p>
          <br />
          <p>Parallel Studios FZ-LLC conserve la propriété intellectuelle sur l'architecture technique, les frameworks, gabarits structurels, bibliothèques de composants et outils propriétaires utilisés pour développer le Site. Le Client ne peut ni revendre, ni sous-licencier, ni réutiliser à d'autres fins la structure technique de son Site sans autorisation préalable de WebPower.</p>
        </Section>

        <Section title="11. Espace de gestion">
          <p>WebPower fournit au Client un espace de gestion simplifié lui permettant de modifier les informations de base de son Site (textes, coordonnées, photos). Cet espace est inclus dans le prix de la prestation initiale et dans les renouvellements annuels. Son accès peut être suspendu en cas de non-renouvellement.</p>
        </Section>

        <Section title="12. Non-renouvellement et résiliation">
          <p><strong>12.1 — Non-renouvellement à l'échéance</strong></p>
          <p>Si le Client choisit de ne pas renouveler l'hébergement et le domaine à l'échéance annuelle, WebPower mettra le Site hors ligne à la date d'expiration, après un préavis minimum de 30 jours communiqué par email. Le nom de domaine sera libéré.</p>
          <br />
          <p><strong>12.2 — Résiliation par le Client</strong></p>
          <p>Le Client peut mettre fin au service d'hébergement à tout moment en adressant une demande à <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a>. Aucun remboursement de la période d'hébergement en cours ne sera effectué, sauf en cas de manquement avéré de WebPower à ses obligations.</p>
          <br />
          <p><strong>12.3 — Résiliation pour manquement</strong></p>
          <p>WebPower se réserve le droit de suspendre ou résilier l'accès au Service sans préavis ni remboursement en cas de violation grave des présentes CGV par le Client, notamment en cas d'usage illicite du Site.</p>
        </Section>

        <Section title="13. Données personnelles">
          <p>Le traitement des données personnelles collectées dans le cadre de l'exécution des présentes CGV est soumis à la <a href="/confidentialite" style={{ color: '#2275FE' }}>Politique de confidentialité</a> de WebPower, disponible sur webpower.app.</p>
        </Section>

        <Section title="14. Modification des CGV">
          <p>WebPower se réserve le droit de modifier les présentes CGV à tout moment. Les nouvelles CGV seront publiées sur webpower.app et prendront effet immédiatement pour les nouvelles Commandes. Pour les Commandes en cours, les CGV applicables sont celles acceptées lors de la Commande initiale.</p>
        </Section>

        <Section title="15. Droit applicable et résolution des litiges">
          <p><strong>15.1 — Droit applicable</strong></p>
          <p>Les présentes CGV sont régies par le droit des Émirats Arabes Unis, sans préjudice des dispositions d'ordre public applicables dans le pays de résidence du Client (notamment pour les clients résidant dans l'Union européenne).</p>
          <br />
          <p><strong>15.2 — Résolution amiable</strong></p>
          <p>En cas de litige relatif à l'application ou à l'interprétation des présentes CGV, le Client est invité à contacter WebPower en priorité par email à <a href="mailto:hello@yourwebpower.com" style={{ color: '#2275FE' }}>hello@yourwebpower.com</a>. WebPower s'engage à répondre dans un délai de 10 jours ouvrés et à rechercher une solution amiable.</p>
          <br />
          <p><strong>15.3 — Médiation (UE)</strong></p>
          <p>Les consommateurs et professionnels résidant dans l'Union européenne peuvent, à défaut de résolution amiable, recourir à la médiation de la consommation ou à la plateforme européenne de résolution des litiges en ligne accessible à : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: '#2275FE' }}>https://ec.europa.eu/consumers/odr</a>.</p>
          <br />
          <p><strong>15.4 — Juridiction compétente</strong></p>
          <p>À défaut de résolution amiable, tout litige sera soumis à la compétence exclusive des tribunaux de Dubai (UAE). Pour les consommateurs de l'Union européenne, les tribunaux du pays de résidence du consommateur resteront compétents dans les cas prévus par le droit de l'UE.</p>
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
