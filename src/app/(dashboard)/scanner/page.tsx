import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { createServerClient, getOrgId } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { ScannerListClient } from '@/features/scanner/components/scanner-list-client';
import { Pagination } from '@/features/scanner/components/pagination';
import type { AiToolRow } from '@/features/scanner/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scanner IA — CompliPilot',
  description: 'Inventaire et analyse de vos outils IA',
};

const PAGE_SIZE = 12;

interface ScannerPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ScannerPage({ searchParams }: ScannerPageProps) {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');

  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const risk = typeof params.risk === 'string' ? params.risk : undefined;
  const status = typeof params.status === 'string' ? params.status : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const supabase = await createServerClient();

  // Build query
  let toolsQuery = supabase
    .from('ai_tools')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId)
    .neq('status', 'deprecated')
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (query) {
    toolsQuery = toolsQuery.ilike('name', `%${query}%`);
  }
  if (category && category !== 'all') {
    toolsQuery = toolsQuery.eq('category', category);
  }
  if (risk && risk !== 'all') {
    toolsQuery = toolsQuery.eq('risk_level', risk);
  }
  if (status && status !== 'all') {
    toolsQuery = toolsQuery.eq('status', status);
  }

  const { data: rawTools, count } = await toolsQuery;

  const tools: AiToolRow[] = (rawTools ?? []).map((t) => ({
    id: t.id,
    orgId: t.org_id,
    name: t.name,
    provider: t.provider,
    category: t.category,
    description: t.description,
    url: t.url,
    usageContext: t.usage_context,
    dataTypesProcessed: t.data_types_processed as string[] | null,
    userCount: t.user_count,
    isCustomerFacing: t.is_customer_facing,
    automatedDecisions: t.automated_decisions,
    riskLevel: t.risk_level,
    riskScore: t.risk_score,
    status: t.status,
    lastAssessedAt: t.last_assessed_at,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }));

  const totalCount = count ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Scanner IA"
        description="Inventaire et analyse de conformité de vos outils d'intelligence artificielle"
        actions={
          <Link href="/scanner/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un outil
            </Button>
          </Link>
        }
      />

      <ScannerListClient tools={tools} />

      <Pagination totalCount={totalCount} pageSize={PAGE_SIZE} currentPage={page} />
    </div>
  );
}
