'use client';

import dynamic from 'next/dynamic';
import type { ComplianceTimelinePoint } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ComplianceTimelineChart = dynamic(
  () => import('./compliance-timeline-chart').then((mod) => mod.ComplianceTimelineChart),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="mb-4 h-4 w-48" />
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    ),
  },
);

export function ComplianceTimelineChartLazy({ data }: { data: ComplianceTimelinePoint[] }) {
  return <ComplianceTimelineChart data={data} />;
}
