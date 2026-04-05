import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getOrgId } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { ComplianceScoreGauge } from '@/components/shared/compliance-score-gauge';
import { StatCards } from '@/features/dashboard/components/stat-cards';
import { RegulationCards } from '@/features/dashboard/components/regulation-cards';
import { PriorityActions } from '@/features/dashboard/components/priority-actions';
import { ActivityTimeline } from '@/features/dashboard/components/activity-timeline';
import { ComplianceChart } from '@/features/dashboard/components/compliance-chart';
import {
  StatsRowSkeleton,
  RegulationRowSkeleton,
  ActionsActivitySkeleton,
  ChartSkeleton,
} from '@/features/dashboard/components/dashboard-skeletons';
import {
  getDashboardStats,
  getComplianceByRegulation,
  getPriorityActions,
  getRecentActivity,
  getComplianceHistory,
} from '@/features/dashboard/services/get-dashboard-data';

export const metadata: Metadata = {
  title: 'Dashboard | CompliPilot',
  description: "Vue d'ensemble de votre conformite IA.",
};

async function requireOrgId(): Promise<string> {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');
  return orgId;
}

/* ---------- Async data sections ---------- */

async function StatsRow() {
  const orgId = await requireOrgId();
  const stats = await getDashboardStats(orgId);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="flex items-center justify-center rounded-xl border border-border bg-card py-8">
        <ComplianceScoreGauge score={stats.complianceScore} size="lg" />
      </div>
      <StatCards stats={stats} />
    </div>
  );
}

async function RegulationRow() {
  const orgId = await requireOrgId();
  const regulations = await getComplianceByRegulation(orgId);
  return <RegulationCards regulations={regulations} />;
}

async function ActionsActivityRow() {
  const orgId = await requireOrgId();
  const [actions, activity] = await Promise.all([
    getPriorityActions(orgId),
    getRecentActivity(orgId),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <PriorityActions actions={actions} />
      <ActivityTimeline entries={activity} />
    </div>
  );
}

async function ChartRow() {
  const orgId = await requireOrgId();
  const history = await getComplianceHistory(orgId);
  return <ComplianceChart data={history} />;
}

/* ---------- Page ---------- */

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Vue d'ensemble de votre conformite IA." />

      {/* Line 1: Score gauge + stat cards */}
      <Suspense fallback={<StatsRowSkeleton />}>
        <StatsRow />
      </Suspense>

      {/* Line 2: Regulation compliance cards */}
      <Suspense fallback={<RegulationRowSkeleton />}>
        <RegulationRow />
      </Suspense>

      {/* Line 3: Priority actions + activity timeline */}
      <Suspense fallback={<ActionsActivitySkeleton />}>
        <ActionsActivityRow />
      </Suspense>

      {/* Line 4: Compliance history chart */}
      <Suspense fallback={<ChartSkeleton />}>
        <ChartRow />
      </Suspense>
    </div>
  );
}
