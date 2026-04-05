import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    question: "Qu'est-ce que l'EU AI Act et suis-je concerne ?",
    answer:
      "L'EU AI Act est le premier cadre legislatif au monde reglementant l'intelligence artificielle. Si votre entreprise utilise, developpe ou deploie des systemes d'IA dans l'UE, vous etes concerne. Les premieres obligations entrent en vigueur le 2 aout 2026.",
  },
  {
    question: 'Comment CompliPilot classifie-t-il les risques ?',
    answer:
      "CompliPilot analyse chaque outil IA selon les criteres de l'EU AI Act : type d'utilisation, donnees traitees, impact sur les personnes. L'IA classifie automatiquement en 4 niveaux : inacceptable, haut risque, risque limite, risque minimal.",
  },
  {
    question: 'Les documents generes sont-ils juridiquement valides ?',
    answer:
      "Les documents generes par CompliPilot suivent les templates officiels et les exigences de l'EU AI Act. Ils servent de base solide pour votre conformite. Nous recommandons une relecture par votre equipe juridique avant approbation finale.",
  },
  {
    question: 'Mes donnees sont-elles en securite ?',
    answer:
      'Oui. Vos donnees sont hebergees en Europe (Supabase EU), chiffrees au repos et en transit. Nous ne partageons jamais vos donnees avec des tiers. CompliPilot est lui-meme conforme au RGPD.',
  },
  {
    question: 'Puis-je essayer CompliPilot gratuitement ?',
    answer:
      "Oui ! Le plan Starter inclut un essai gratuit de 14 jours. Aucune carte bancaire requise. Vous pouvez scanner jusqu'a 5 outils IA et generer 5 documents.",
  },
  {
    question: 'CompliPilot couvre-t-il aussi le RGPD et NIS2 ?',
    answer:
      "Oui. CompliPilot est multi-reglementations. En plus de l'EU AI Act, nous couvrons le RGPD (registre de traitements, DPIA), NIS2 (securite reseau) et DORA (resilience operationnelle digitale).",
  },
  {
    question: 'Combien de temps faut-il pour etre conforme ?',
    answer:
      "Avec CompliPilot, la plupart des PME atteignent un score de conformite superieur a 80% en moins de 2 semaines. Le processus complet depend du nombre d'outils IA et de la complexite de votre organisation.",
  },
] as const;

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items?: readonly FaqItem[];
}

/**
 * FAQ accordion section.
 */
export function FaqSection({ items = FAQ_ITEMS }: FaqSectionProps) {
  return (
    <section id="faq" className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Questions frequentes
        </h2>
        <Accordion className="mt-12" defaultValue={[items[0]?.question ?? '']}>
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-left text-sm font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
