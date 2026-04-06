'use client';

import { useTransition } from 'react';
import { Loader2, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PLANS, formatPrice } from '@/lib/stripe/config';
import { createCheckoutSession } from '@/features/billing/actions';
import type { PlanId, BillingInterval } from '@/lib/stripe/config';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: PlanId;
  /** Which resource triggered the dialog. */
  resource: string;
}

/**
 * Modal dialog encouraging the user to upgrade.
 * Shows the next plan's benefits and a CTA.
 */
export function UpgradeDialog({ open, onOpenChange, currentPlan, resource }: UpgradeDialogProps) {
  const [isPending, startTransition] = useTransition();

  // Determine which plan to suggest
  const nextPlan: PlanId =
    currentPlan === 'free' ? 'starter' : currentPlan === 'starter' ? 'growth' : 'enterprise';

  const plan = PLANS[nextPlan];
  const interval: BillingInterval = 'monthly';

  function handleUpgrade() {
    startTransition(async () => {
      await createCheckoutSession(nextPlan, interval);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            Limite atteinte
          </DialogTitle>
          <DialogDescription>
            Vous avez atteint la limite de {resource} de votre plan{' '}
            <span className="font-medium">{PLANS[currentPlan].name}</span>. Passez au plan{' '}
            <span className="font-medium">{plan.name}</span> pour continuer.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
          <h4 className="text-sm font-semibold">
            Plan {plan.name} — {formatPrice(plan.priceMonthly)}/mois
          </h4>
          <ul className="mt-3 space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Plus tard
          </Button>
          <Button onClick={handleUpgrade} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Passer au plan {plan.name}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
