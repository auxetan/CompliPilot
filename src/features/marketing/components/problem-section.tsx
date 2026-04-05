import { Banknote, FileStack, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PAIN_POINTS = [
  {
    icon: Banknote,
    title: 'Amendes massives',
    description: "Jusqu'a 35M EUR ou 7% du CA mondial pour non-conformite a l'EU AI Act.",
  },
  {
    icon: FileStack,
    title: 'Documentation interminable',
    description: 'Des centaines de pages de documentation technique requises par outil IA.',
  },
  {
    icon: RefreshCw,
    title: 'Reglementations qui changent',
    description: "EU AI Act, RGPD, NIS2, DORA... et ce n'est que le debut.",
  },
] as const;

/**
 * Problem section — pain points that CompliPilot solves.
 */
export function ProblemSection() {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          La conformite IA est un <span className="text-destructive">cauchemar</span> pour les PME
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {PAIN_POINTS.map((point) => (
            <Card
              key={point.title}
              className="border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <point.icon className="h-6 w-6 text-destructive" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
