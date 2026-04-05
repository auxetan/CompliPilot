import type { Metadata } from 'next';
import { HeroSection } from '@/features/marketing/components/hero-section';
import { ProblemSection } from '@/features/marketing/components/problem-section';
import { SolutionSection } from '@/features/marketing/components/solution-section';
import { HowItWorksSection } from '@/features/marketing/components/how-it-works-section';
import { PricingSection } from '@/features/marketing/components/pricing-section';
import { TestimonialsSection } from '@/features/marketing/components/testimonials-section';
import { FaqSection } from '@/features/marketing/components/faq-section';
import { CtaSection } from '@/features/marketing/components/cta-section';

export const metadata: Metadata = {
  title: 'CompliPilot — AI-Powered Compliance on Autopilot',
  description:
    "CompliPilot aide les PME a se mettre en conformite avec l'EU AI Act, le RGPD, NIS2 et DORA. Scanner IA, classification des risques, generation automatique de documents.",
  openGraph: {
    title: 'CompliPilot — AI-Powered Compliance on Autopilot',
    description:
      'Scannez vos outils IA, evaluez les risques, generez votre documentation de conformite automatiquement.',
    type: 'website',
  },
};

/** Schema.org JSON-LD for SEO. */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'CompliPilot',
      url: 'https://complipilot.com',
      logo: 'https://complipilot.com/images/logo.png',
      description: 'SaaS de conformite IA pour PME europeennes.',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'CompliPilot',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice: '199',
        highPrice: '1499',
      },
      description:
        "Plateforme SaaS qui aide les PME a se conformer a l'EU AI Act, au RGPD, NIS2 et DORA grace a l'IA.",
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
