import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/** Skeleton for the score gauge + stat cards row. */
export function StatsRowSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Gauge skeleton */}
      <Card className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-[140px] w-[140px] rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </Card>
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/** Skeleton for regulation compliance cards row. */
export function RegulationRowSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="w-full space-y-1">
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="mx-auto h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/** Skeleton for priority actions + activity timeline row. */
export function ActionsActivitySkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Priority actions skeleton */}
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <Skeleton className="h-8 w-8 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      {/* Activity timeline skeleton */}
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-2.5 w-2.5 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/** Skeleton for the compliance history chart. */
export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
