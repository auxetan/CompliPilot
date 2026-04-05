import { ClipboardList, BarChart3, Download } from 'lucide-react';

const STEPS = [
  {
    number: '1',
    icon: ClipboardList,
    title: 'Declarez vos outils IA',
    description:
      'Ajoutez vos outils IA en quelques clics : nom, usage, donnees traitees. CompliPilot fait le reste.',
  },
  {
    number: '2',
    icon: BarChart3,
    title: 'Obtenez votre evaluation des risques',
    description:
      "Notre IA classifie chaque outil selon l'EU AI Act et identifie les points de non-conformite.",
  },
  {
    number: '3',
    icon: Download,
    title: 'Generez vos documents de conformite',
    description:
      "Evaluations d'impact, registres, fiches transparence — tout est genere et pret pour l'audit.",
  },
] as const;

/**
 * How it works section — 3 numbered steps.
 */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          3 etapes pour etre <span className="text-primary">conforme</span>
        </h2>
        <div className="mt-16 grid gap-12 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="relative text-center">
              {/* Step number */}
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
                {step.number}
              </div>
              <div className="mb-4 flex justify-center">
                <step.icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
