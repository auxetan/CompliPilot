import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant: 'card' | 'table-row' | 'text-block' | 'stat-card';
  count?: number;
  className?: string;
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-8 w-24 mt-2" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border py-3 px-4">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/5" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-4 w-1/6 ml-auto" />
    </div>
  );
}

function TextBlockSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

const VARIANT_MAP = {
  card: CardSkeleton,
  'table-row': TableRowSkeleton,
  'text-block': TextBlockSkeleton,
  'stat-card': StatCardSkeleton,
};

/**
 * Loading skeleton with multiple variants for different content types.
 */
export function LoadingSkeleton({ variant, count = 1, className }: LoadingSkeletonProps) {
  const Component = VARIANT_MAP[variant];

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }, (_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}
