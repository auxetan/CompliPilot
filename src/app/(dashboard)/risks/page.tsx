import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getOrgId } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { RiskStatCards } from '@/features/risks/components/risk-stat-cards';
import { RiskMatrix } from '@/features/risks/components/risk-matrix';
import { RiskTableWrapper } from '@/features/risks/components/risk-table-wrapper';
import { RiskRecommendations } from '@/features/risks/components/risk-recommendations';
import {
  RiskStatsRowSkeleton,
  RiskMatrixSkeleton,
  RiskTableSkeleton,
  RiskRecommendationsSkeleton,
} from '@/features/risks/components/risk-skeletons';
import {
  getRiskOverview,
  getRiskMatrix,
  getRisksByRegulation,
  getActionItems,
} from '@/features/risks/services/get-risk-data';

export const metadata: Metadata = {
  title: 'Risques | CompliPilot',
  description: "Vue d'ensemble des risques IA de votre organisation.",
};

async function requireOrgId(): Promise<string> {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');
  return orgId;
}

/* ---------- Async data sections ---------- */

async function StatsRow() {
  const orgId = await requireOrgId();
  const stats = await getRiskOverview(orgId);
  return <RiskStatCards stats={stats} />;
}

async function MatrixRow() {
  const orgId = await requireOrgId();
  const data = await getRiskMatrix(orgId);
  return <RiskMatrix data={data} />;
}

async function TableRow() {
  const orgId = await requireOrgId();
  const rows = await getRisksByRegulation(orgId);
  return <RiskTableWrapper rows={rows} />;
}

async function RecommendationsRow() {
  const orgId = await requireOrgId();
  const actions = await getActionItems(orgId);
  return <RiskRecommendations actions={actions} />;
}

/* ---------- Page ---------- */

export default function RisksPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Risques"
        description="Vue d'ensemble de tous les risques identifies dans votre organisation."
      />

      {/* Risk level stat cards */}
      <Suspense fallback={<RiskStatsRowSkeleton />}>
        <StatsRow />
      </Suspense>

      {/* Risk matrix */}
      <Suspense fallback={<RiskMatrixSkeleton />}>
        <MatrixRow />
      </Suspense>

      {/* Grouped risk table + CSV export */}
      <Suspense fallback={<RiskTableSkeleton />}>
        <TableRow />
      </Suspense>

      {/* Top 10 recommendations */}
      <Suspense fallback={<RiskRecommendationsSkeleton />}>
        <RecommendationsRow />
      </Suspense>
    </div>
  );
}
