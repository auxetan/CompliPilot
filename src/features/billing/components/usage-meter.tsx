import { cn } from '@/lib/utils';

interface UsageMeterProps {
  label: string;
  current: number;
  limit: number;
}

/**
 * Progress bar showing usage vs. plan limit.
 * Infinity limits display as "Illimite".
 */
export function UsageMeter({ label, current, limit }: UsageMeterProps) {
  const isUnlimited = !isFinite(limit);
  const percentage = isUnlimited ? 0 : Math.min(100, Math.round((current / limit) * 100));
  const isNearLimit = !isUnlimited && percentage >= 80;
  const isAtLimit = !isUnlimited && percentage >= 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span
          className={cn('text-muted-foreground', isAtLimit && 'font-semibold text-destructive')}
        >
          {current} / {isUnlimited ? '∞' : limit}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isAtLimit ? 'bg-destructive' : isNearLimit ? 'bg-orange-500' : 'bg-primary',
          )}
          style={{ width: isUnlimited ? '0%' : `${percentage}%` }}
        />
      </div>
      {isAtLimit && (
        <p className="text-xs text-destructive">Limite atteinte — passez au plan superieur</p>
      )}
    </div>
  );
}
