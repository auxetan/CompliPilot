import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Conditions generales d'utilisation — CompliPilot",
  description: "Conditions generales d'utilisation de la plateforme CompliPilot.",
};

export default function CguPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Conditions generales d&apos;utilisation</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">Derniere mise a jour : 1er avril 2026</p>

        <section>
          <h2 className="text-xl font-semibold">1. Objet</h2>
          <p className="text-muted-foreground">
            Les presentes CGU definissent les conditions d&apos;acces et d&apos;utilisation de la
            plateforme CompliPilot, un service SaaS d&apos;aide a la conformite IA pour les
            entreprises.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Description du service</h2>
          <p className="text-muted-foreground">
            CompliPilot fournit des outils d&apos;aide a la mise en conformite avec les
            reglementations IA europeennes (EU AI Act, RGPD, NIS2, DORA), incluant :
          </p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Inventaire et classification des outils IA</li>
            <li>Evaluation automatisee des risques par IA</li>
            <li>Generation de documentation de conformite</li>
            <li>Tableau de bord de suivi et alertes</li>
            <li>Rapports pre-formates pour auditeurs</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Inscription et compte</h2>
          <p className="text-muted-foreground">
            L&apos;utilisateur doit creer un compte avec une adresse email valide.
            L&apos;utilisateur est responsable de la confidentialite de ses identifiants et de toute
            activite realisee sous son compte.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Abonnements et paiement</h2>
          <p className="text-muted-foreground">
            L&apos;acces aux fonctionnalites avancees necessite un abonnement payant. Les tarifs
            sont indiques sur la page de tarification. Les abonnements sont renouveles
            automatiquement. L&apos;utilisateur peut resilier a tout moment depuis son espace de
            facturation; la resiliation prend effet a la fin de la periode en cours.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Limitation de responsabilite</h2>
          <p className="text-muted-foreground">
            CompliPilot est un outil d&apos;aide a la decision et ne se substitue pas a un conseil
            juridique professionnel. Les evaluations de risque et documents generes sont fournis a
            titre indicatif. L&apos;utilisateur reste seul responsable de ses decisions en matiere
            de conformite reglementaire.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Propriete intellectuelle</h2>
          <p className="text-muted-foreground">
            La plateforme et ses contenus sont proteges par le droit de la propriete intellectuelle.
            Les documents generes par l&apos;utilisateur via la plateforme restent la propriete de
            l&apos;utilisateur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Disponibilite du service</h2>
          <p className="text-muted-foreground">
            CompliPilot s&apos;efforce d&apos;assurer une disponibilite maximale du service. Des
            interruptions pour maintenance peuvent survenir avec un preavis raisonnable. Le SLA
            specifique est defini dans le contrat Enterprise.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8. Protection des donnees</h2>
          <p className="text-muted-foreground">
            Le traitement des donnees personnelles est decrit dans notre{' '}
            <a href="/legal/confidentialite" className="text-primary hover:underline">
              Politique de confidentialite
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. Droit applicable et litiges</h2>
          <p className="text-muted-foreground">
            Les presentes CGU sont soumises au droit francais. En cas de litige, les parties
            s&apos;engagent a rechercher une solution amiable avant de saisir les tribunaux
            competents de Paris.
          </p>
        </section>
      </div>
    </div>
  );
}
