import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { PlanId } from '@/lib/stripe/config';

interface PlanBadgeProps {
  plan: PlanId;
  collapsed?: boolean;
}

const PLAN_STYLES: Record<PlanId, string> = {
  free: 'bg-muted text-muted-foreground',
  starter: 'bg-blue-500/10 text-blue-600',
  growth: 'bg-primary/10 text-primary',
  enterprise: 'bg-amber-500/10 text-amber-600',
};

const PLAN_LABELS: Record<PlanId, string> = {
  free: 'Free',
  starter: 'Starter',
  growth: 'Growth',
  enterprise: 'Enterprise',
};

/**
 * Badge displaying the current plan. Links to the billing page.
 */
export function PlanBadge({ plan, collapsed }: PlanBadgeProps) {
  if (collapsed) return null;

  return (
    <div className="border-t border-border px-4 py-3">
      <Link href="/settings/billing">
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors hover:opacity-80',
            PLAN_STYLES[plan],
          )}
        >
          {PLAN_LABELS[plan]} Plan
        </span>
      </Link>
    </div>
  );
}
