import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialite — CompliPilot',
  description:
    'Politique de confidentialite et de protection des donnees personnelles de CompliPilot.',
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Politique de confidentialite</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">Derniere mise a jour : 1er avril 2026</p>

        <section>
          <h2 className="text-xl font-semibold">1. Responsable du traitement</h2>
          <p className="text-muted-foreground">
            CompliPilot SAS, 42 rue de la Compliance, 75008 Paris. Contact DPO : dpo@complipilot.com
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Donnees collectees</h2>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>
              <strong>Donnees d&apos;identification :</strong> nom, prenom, email, mot de passe
              (hache)
            </li>
            <li>
              <strong>Donnees d&apos;entreprise :</strong> nom de l&apos;organisation, secteur,
              nombre d&apos;employes
            </li>
            <li>
              <strong>Donnees d&apos;utilisation :</strong> outils IA declares, evaluations de
              risque, documents generes
            </li>
            <li>
              <strong>Donnees techniques :</strong> adresse IP, type de navigateur, logs de
              connexion
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Finalites du traitement</h2>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Fourniture et amelioration du service de conformite IA</li>
            <li>Gestion des comptes utilisateurs et de la facturation</li>
            <li>Envoi d&apos;alertes reglementaires et de notifications</li>
            <li>Analyse statistique anonymisee pour ameliorer le produit</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Base legale</h2>
          <p className="text-muted-foreground">
            Les traitements sont fondes sur : l&apos;execution du contrat (fourniture du service),
            le consentement (cookies analytiques), l&apos;interet legitime (securite, amelioration
            du service), et les obligations legales (facturation, audit).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Destinataires des donnees</h2>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Supabase Inc. (hebergement base de donnees, region EU)</li>
            <li>Stripe Inc. (paiements, certifie PCI-DSS)</li>
            <li>Anthropic PBC (traitement IA — donnees anonymisees)</li>
            <li>Resend (envoi d&apos;emails transactionnels)</li>
            <li>Vercel Inc. (hebergement applicatif)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Duree de conservation</h2>
          <p className="text-muted-foreground">
            Les donnees sont conservees pendant la duree du contrat, puis 3 ans apres la resiliation
            du compte. Les logs d&apos;audit sont conserves 5 ans conformement aux obligations
            legales.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Vos droits</h2>
          <p className="text-muted-foreground">
            Conformement au RGPD, vous disposez d&apos;un droit d&apos;acces, de rectification,
            d&apos;effacement, de portabilite, de limitation et d&apos;opposition au traitement de
            vos donnees. Contactez dpo@complipilot.com ou exercez vos droits depuis les parametres
            de votre compte. Vous pouvez egalement introduire une reclamation aupres de la CNIL.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8. Transferts internationaux</h2>
          <p className="text-muted-foreground">
            Les donnees peuvent etre transferees vers les Etats-Unis (Stripe, Vercel, Anthropic)
            dans le cadre du EU-US Data Privacy Framework. Des clauses contractuelles types sont en
            place pour garantir un niveau de protection adequat.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. Securite</h2>
          <p className="text-muted-foreground">
            Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees :
            chiffrement en transit (TLS 1.3) et au repos, authentification securisee, controle
            d&apos;acces par roles (RLS), journalisation des acces, et surveillance continue.
          </p>
        </section>
      </div>
    </div>
  );
}
