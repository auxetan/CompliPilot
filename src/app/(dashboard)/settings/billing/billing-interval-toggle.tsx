'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PLANS, PLAN_ORDER } from '@/lib/stripe/config';
import { PricingCard } from '@/features/billing/components/pricing-card';
import type { PlanId, BillingInterval } from '@/lib/stripe/config';

interface BillingPlansWithToggleProps {
  currentPlan: PlanId;
}

/**
 * Client component managing billing interval state and rendering pricing cards.
 */
export function BillingPlansWithToggle({ currentPlan }: BillingPlansWithToggleProps) {
  const [interval, setInterval] = useState<BillingInterval>('monthly');

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Changer de plan</h2>
        <div className="inline-flex items-center gap-1 rounded-lg border bg-muted p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 rounded-md px-3 text-xs',
              interval === 'monthly' && 'bg-background shadow-sm',
            )}
            onClick={() => setInterval('monthly')}
          >
            Mensuel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 rounded-md px-3 text-xs',
              interval === 'yearly' && 'bg-background shadow-sm',
            )}
            onClick={() => setInterval('yearly')}
          >
            Annuel
            <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              -20%
            </span>
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PLAN_ORDER.map((planId) => (
          <PricingCard
            key={planId}
            plan={PLANS[planId]}
            currentPlan={currentPlan}
            interval={interval}
          />
        ))}
      </div>
    </div>
  );
}
