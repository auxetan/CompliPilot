import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const TESTIMONIALS = [
  {
    quote:
      "CompliPilot nous a fait gagner 3 mois de travail. La generation automatique des evaluations d'impact est bluffante.",
    name: 'Marie Laurent',
    title: 'DPO',
    company: 'FinTech Solutions, Paris',
    initials: 'ML',
  },
  {
    quote:
      "En tant que CTO d'une PME de 80 personnes, je n'avais ni le temps ni l'expertise pour gerer la conformite IA. CompliPilot a tout change.",
    name: 'Thomas Weber',
    title: 'CTO',
    company: 'DataFlow GmbH, Berlin',
    initials: 'TW',
  },
  {
    quote:
      "Le score de conformite en temps reel rassure notre board. On voit exactement ou on en est et ce qu'il reste a faire.",
    name: 'Sofia Rodriguez',
    title: 'Head of Legal',
    company: 'CloudServe, Amsterdam',
    initials: 'SR',
  },
] as const;

/**
 * Testimonials section — 3 customer quotes in cards.
 */
export function TestimonialsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Ils nous font confiance
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="border-border bg-card">
              <CardContent className="pt-6">
                {/* Decorative quote */}
                <span className="text-4xl leading-none text-primary/20" aria-hidden="true">
                  &ldquo;
                </span>
                <p className="mt-1 text-sm text-muted-foreground">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs">{t.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.title}, {t.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
