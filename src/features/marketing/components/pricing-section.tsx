'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlanFeature {
  label: string;
  starter: boolean;
  growth: boolean;
  enterprise: boolean;
}

const FEATURES: PlanFeature[] = [
  { label: "Jusqu'a 5 outils IA", starter: true, growth: true, enterprise: true },
  { label: "Jusqu'a 20 outils IA", starter: false, growth: true, enterprise: true },
  { label: 'Outils IA illimites', starter: false, growth: false, enterprise: true },
  { label: 'Classification des risques IA', starter: true, growth: true, enterprise: true },
  { label: 'Generation de documents (5/mois)', starter: true, growth: false, enterprise: false },
  { label: 'Generation de documents (illimite)', starter: false, growth: true, enterprise: true },
  { label: 'Monitoring temps reel', starter: false, growth: true, enterprise: true },
  { label: 'Rapports auditeur PDF', starter: false, growth: true, enterprise: true },
  { label: "Gestion d'equipe", starter: false, growth: true, enterprise: true },
  { label: 'SSO & audit logs', starter: false, growth: false, enterprise: true },
  { label: 'Support prioritaire', starter: false, growth: false, enterprise: true },
  { label: 'Account manager dedie', starter: false, growth: false, enterprise: true },
];

const PLANS = [
  {
    name: 'Starter',
    monthlyPrice: 199,
    description: 'Pour les petites equipes qui debutent leur mise en conformite.',
    popular: false,
    cta: 'Commencer',
    featureKey: 'starter' as const,
  },
  {
    name: 'Growth',
    monthlyPrice: 499,
    description: 'Pour les PME qui veulent une conformite complete et automatisee.',
    popular: true,
    cta: 'Essayer gratuitement',
    featureKey: 'growth' as const,
  },
  {
    name: 'Enterprise',
    monthlyPrice: 1499,
    description: 'Pour les entreprises avec des besoins avances et un accompagnement dedie.',
    popular: false,
    cta: 'Contacter les ventes',
    featureKey: 'enterprise' as const,
  },
] as const;

interface PricingSectionProps {
  showFullComparison?: boolean;
}

/**
 * Pricing section with monthly/annual toggle and feature list per plan.
 */
export function PricingSection({ showFullComparison = false }: PricingSectionProps) {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Un plan pour chaque entreprise
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Commencez gratuitement, evoluez quand vous etes pret.
        </p>

        {/* Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Label htmlFor="billing-toggle" className={cn(!annual && 'font-semibold')}>
            Mensuel
          </Label>
          <Switch id="billing-toggle" checked={annual} onCheckedChange={setAnnual} />
          <Label htmlFor="billing-toggle" className={cn(annual && 'font-semibold')}>
            Annuel
            <Badge variant="outline" className="ml-2 bg-success/10 text-success border-success/20">
              -20%
            </Badge>
          </Label>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const price = annual ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice;

            return (
              <Card
                key={plan.name}
                className={cn(
                  'relative flex flex-col border-border transition-all hover:-translate-y-0.5 hover:shadow-md',
                  plan.popular && 'border-primary ring-1 ring-primary',
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Populaire
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-semibold">{price}&#8364;</span>
                    <span className="text-muted-foreground">/mois</span>
                    {annual && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Facture annuellement ({price * 12}&#8364;/an)
                      </p>
                    )}
                  </div>
                  <ul className="space-y-2.5">
                    {FEATURES.map((feature) => {
                      const included = feature[plan.featureKey];
                      return (
                        <li key={feature.label} className="flex items-start gap-2 text-sm">
                          {included ? (
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0 text-success"
                              aria-hidden="true"
                            />
                          ) : (
                            <X
                              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40"
                              aria-hidden="true"
                            />
                          )}
                          <span className={cn(!included && 'text-muted-foreground/60')}>
                            {feature.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({
                        variant: plan.popular ? 'default' : 'outline',
                      }),
                      'w-full justify-center',
                    )}
                  >
                    {plan.cta}
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Full comparison table (pricing page only) */}
        {showFullComparison && (
          <div className="mt-16 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-medium text-muted-foreground">
                    Fonctionnalite
                  </th>
                  <th className="px-4 py-3 text-center font-medium">Starter</th>
                  <th className="px-4 py-3 text-center font-medium text-primary">Growth</th>
                  <th className="px-4 py-3 text-center font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((f, i) => (
                  <tr
                    key={f.label}
                    className={cn('border-b border-border', i % 2 === 0 && 'bg-muted/30')}
                  >
                    <td className="py-3">{f.label}</td>
                    <td className="px-4 py-3 text-center">
                      {f.starter ? (
                        <Check className="mx-auto h-4 w-4 text-success" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {f.growth ? (
                        <Check className="mx-auto h-4 w-4 text-success" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {f.enterprise ? (
                        <Check className="mx-auto h-4 w-4 text-success" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
