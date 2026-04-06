'use client';

import { useTransition } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/stripe/config';
import { createCheckoutSession } from '@/features/billing/actions';
import type { PlanConfig, PlanId, BillingInterval } from '@/lib/stripe/config';

interface PricingCardProps {
  plan: PlanConfig;
  currentPlan: PlanId;
  interval: BillingInterval;
}

/**
 * Pricing card for a single plan. Shows features, price, and upgrade/current badge.
 */
export function PricingCard({ plan, currentPlan, interval }: PricingCardProps) {
  const [isPending, startTransition] = useTransition();

  const isCurrent = plan.id === currentPlan;
  const price = interval === 'yearly' ? plan.priceYearly : plan.priceMonthly;
  const monthlyEquivalent =
    interval === 'yearly' && plan.priceYearly > 0
      ? Math.round(plan.priceYearly / 12)
      : plan.priceMonthly;

  function handleSubscribe() {
    if (isCurrent || plan.id === 'free') return;
    startTransition(async () => {
      await createCheckoutSession(plan.id, interval);
    });
  }

  return (
    <Card className={cn('relative flex flex-col', plan.recommended && 'border-primary shadow-md')}>
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
          Recommande
        </div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{plan.name}</CardTitle>
        <div className="mt-2">
          {price === 0 ? (
            <span className="text-3xl font-bold">Gratuit</span>
          ) : (
            <>
              <span className="text-3xl font-bold">{formatPrice(monthlyEquivalent)}</span>
              <span className="text-sm text-muted-foreground">/mois</span>
              {interval === 'yearly' && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatPrice(price)}/an (economisez 20%)
                </p>
              )}
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <ul className="flex-1 space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className="mt-6 w-full"
          variant={isCurrent ? 'outline' : plan.recommended ? 'default' : 'outline'}
          disabled={isCurrent || isPending}
          onClick={handleSubscribe}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isCurrent ? 'Plan actuel' : plan.id === 'free' ? 'Plan gratuit' : 'Choisir ce plan'}
        </Button>
      </CardContent>
    </Card>
  );
}
