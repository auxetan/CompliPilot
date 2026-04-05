import {
  RiskStatsRowSkeleton,
  RiskMatrixSkeleton,
  RiskTableSkeleton,
  RiskRecommendationsSkeleton,
} from '@/features/risks/components/risk-skeletons';

export default function RisksLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded bg-muted" />
      </div>
      <RiskStatsRowSkeleton />
      <RiskMatrixSkeleton />
      <RiskTableSkeleton />
      <RiskRecommendationsSkeleton />
    </div>
  );
}
