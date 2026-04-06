import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { getOrgId } from '@/lib/supabase/server';
import { getRecentAlerts } from '@/features/monitoring/services/alert-service';
import {
  getComplianceTimeline,
  getExpiringDocuments,
  getStaleTools,
  getUpcomingDeadlines,
} from '@/features/monitoring/services/monitoring-data';
import { ComplianceTimelineChart } from '@/features/monitoring/components/compliance-timeline-chart';
import { AlertsList } from '@/features/monitoring/components/alerts-list';
import { DeadlinesList } from '@/features/monitoring/components/deadlines-list';
import { ExpiringDocsList } from '@/features/monitoring/components/expiring-docs-list';
import { StaleToolsList } from '@/features/monitoring/components/stale-tools-list';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monitoring — CompliPilot',
  description: 'Suivi de conformite, alertes et deadlines reglementaires',
};

function ChartSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Skeleton className="mb-4 h-4 w-48" />
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}

function ListSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </CardContent>
    </Card>
  );
}

async function MonitoringContent() {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');

  const [timeline, alerts, deadlines, expiringDocs, staleTools] = await Promise.all([
    getComplianceTimeline(orgId, 365),
    getRecentAlerts(orgId, 50),
    getUpcomingDeadlines(),
    getExpiringDocuments(orgId),
    getStaleTools(orgId),
  ]);

  return (
    <>
      {/* Timeline chart — full width */}
      <ComplianceTimelineChart data={timeline} />

      {/* 3-column grid: Deadlines, Expiring Docs, Stale Tools */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DeadlinesList deadlines={deadlines} />
        <ExpiringDocsList documents={expiringDocs} />
        <StaleToolsList tools={staleTools} />
      </div>

      {/* Alerts — full width */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Alertes recentes</h2>
        <AlertsList alerts={alerts} />
      </div>
    </>
  );
}

export default function MonitoringPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Monitoring"
        description="Suivi en temps reel de votre conformite, alertes et echeances reglementaires"
      />

      <Suspense
        fallback={
          <div className="space-y-8">
            <ChartSkeleton />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ListSkeleton />
              <ListSkeleton />
              <ListSkeleton />
            </div>
            <ListSkeleton />
          </div>
        }
      >
        <MonitoringContent />
      </Suspense>
    </div>
  );
}
