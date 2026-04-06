import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions legales — CompliPilot',
  description: 'Mentions legales de la plateforme CompliPilot.',
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Mentions legales</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold">1. Editeur du site</h2>
          <p className="text-muted-foreground">
            CompliPilot est edite par CompliPilot SAS, societe par actions simplifiee au capital de
            10 000 euros, immatriculee au Registre du Commerce et des Societes de Paris.
          </p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Siege social : 42 rue de la Compliance, 75008 Paris, France</li>
            <li>SIRET : 000 000 000 00000</li>
            <li>Numero de TVA intracommunautaire : FR00 000000000</li>
            <li>Directeur de la publication : [Nom du dirigeant]</li>
            <li>Contact : contact@complipilot.com</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Hebergement</h2>
          <p className="text-muted-foreground">
            Le site est heberge par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Les
            donnees sont stockees sur les serveurs de Supabase Inc. (region EU-West).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Propriete intellectuelle</h2>
          <p className="text-muted-foreground">
            L&apos;ensemble des contenus du site CompliPilot (textes, images, logiciels, graphismes,
            logos) est protege par le droit d&apos;auteur et le droit de la propriete
            intellectuelle. Toute reproduction, meme partielle, est interdite sans autorisation
            prealable ecrite.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Responsabilite</h2>
          <p className="text-muted-foreground">
            CompliPilot fournit des outils d&apos;aide a la conformite et ne se substitue pas a un
            conseil juridique professionnel. Les informations fournies par la plateforme sont
            indicatives et ne constituent pas un avis juridique. L&apos;utilisateur reste seul
            responsable de ses decisions en matiere de conformite.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Donnees personnelles</h2>
          <p className="text-muted-foreground">
            Pour toute question relative au traitement de vos donnees personnelles, veuillez
            consulter notre{' '}
            <a href="/legal/confidentialite" className="text-primary hover:underline">
              Politique de confidentialite
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Cookies</h2>
          <p className="text-muted-foreground">
            Le site utilise des cookies strictement necessaires au fonctionnement du service
            (authentification, preferences). Des cookies analytiques (PostHog) peuvent etre utilises
            avec votre consentement pour ameliorer le service.
          </p>
        </section>
      </div>
    </div>
  );
}
