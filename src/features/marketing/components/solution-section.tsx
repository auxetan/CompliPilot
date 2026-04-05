import { ScanLine, ShieldAlert, FileText, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  {
    icon: ScanLine,
    title: 'Scanner IA',
    description:
      'Inventoriez tous vos outils IA en un clic. Detection automatique des categories et usages.',
  },
  {
    icon: ShieldAlert,
    title: 'Classification des risques',
    description:
      "Classification automatique selon l'EU AI Act : inacceptable, haut, limite, minimal.",
  },
  {
    icon: FileText,
    title: 'Generation de documents',
    description:
      "Documentation legale generee par IA : evaluations d'impact, registres, fiches transparence.",
  },
  {
    icon: Activity,
    title: 'Monitoring continu',
    description: 'Score de conformite en temps reel. Alertes quand une reglementation change.',
  },
] as const;

/**
 * Solution section — 4 key features in a grid.
 */
export function SolutionSection() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          CompliPilot <span className="text-primary">automatise tout</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          De l&apos;inventaire de vos outils IA a la generation de documents de conformite, tout est
          automatise.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
