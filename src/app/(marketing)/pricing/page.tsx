import type { Metadata } from 'next';
import { PricingSection } from '@/features/marketing/components/pricing-section';
import { FaqSection } from '@/features/marketing/components/faq-section';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Decouvrez les plans CompliPilot : Starter a 199EUR/mois, Growth a 499EUR/mois, Enterprise a 1499EUR/mois. Essai gratuit 14 jours.',
};

const PRICING_FAQ = [
  {
    question: 'Puis-je changer de plan a tout moment ?',
    answer:
      'Oui, vous pouvez upgrader ou downgrader a tout moment. Le changement est effectif immediatement et le prorata est applique automatiquement.',
  },
  {
    question: 'Y a-t-il un engagement minimum ?',
    answer:
      'Non, tous nos plans sont sans engagement. Vous pouvez annuler a tout moment. Le plan annuel offre 20% de reduction.',
  },
  {
    question: "Qu'est-ce qui est inclus dans l'essai gratuit ?",
    answer:
      "L'essai gratuit de 14 jours inclut toutes les fonctionnalites du plan Starter : scanner jusqu'a 5 outils IA, classification des risques, et 5 documents generes.",
  },
  {
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer:
      'Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) via Stripe. Pour le plan Enterprise, nous proposons aussi le virement bancaire.',
  },
  {
    question: 'Proposez-vous des tarifs pour les startups ?',
    answer:
      'Oui ! Contactez-nous pour decouvrir notre programme startup avec des tarifs preferientiels pour les entreprises de moins de 2 ans.',
  },
] as const;

const PRICING_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CompliPilot',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter',
      price: '199',
      priceCurrency: 'EUR',
      description: 'Pour les petites equipes — 5 outils IA, 5 documents/mois',
    },
    {
      '@type': 'Offer',
      name: 'Growth',
      price: '499',
      priceCurrency: 'EUR',
      description: 'Pour les PME en croissance — 20 outils IA, 50 documents/mois',
    },
    {
      '@type': 'Offer',
      name: 'Enterprise',
      price: '1499',
      priceCurrency: 'EUR',
      description: 'Pour les grandes organisations — illimite',
    },
  ],
};

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PRICING_FAQ.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRICING_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <div className="pt-12">
        <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
          Des tarifs transparents
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Choisissez le plan adapte a la taille et aux besoins de votre entreprise.
        </p>
      </div>
      <PricingSection showFullComparison />
      <FaqSection items={PRICING_FAQ} />
    </>
  );
}
