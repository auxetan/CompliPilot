'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Monthly / Yearly toggle for the billing page.
 * Purely visual for now — the pricing cards read this via props.
 */
export function BillingIntervalToggle() {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');

  return (
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
  );
}
