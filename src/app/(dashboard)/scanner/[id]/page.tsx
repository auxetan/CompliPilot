import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil } from 'lucide-react';
import { createServerClient, getOrgId } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { RiskBadge } from '@/features/scanner/components/risk-badge';
import { StatusBadge } from '@/features/scanner/components/status-badge';
import { ToolDetailTabs } from '@/features/scanner/components/tool-detail-tabs';
import type {
  AiToolWithAssessments,
  RiskAssessmentRow,
  ComplianceDocumentRow,
} from '@/features/scanner/types';
import type { AuditLogEntry } from '@/features/scanner/components/tabs/tool-history-tab';
import type { Metadata } from 'next';

interface ToolDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: tool } = await supabase.from('ai_tools').select('name').eq('id', id).single();

  return {
    title: tool ? `${tool.name} — Scanner IA — CompliPilot` : 'Outil non trouvé',
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { id } = await params;
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');

  const supabase = await createServerClient();

  // Fetch tool, assessments, documents, and audit logs in parallel
  const [toolResult, assessmentsResult, documentsResult, logsResult] = await Promise.all([
    supabase.from('ai_tools').select('*').eq('id', id).eq('org_id', orgId).single(),
    supabase
      .from('risk_assessments')
      .select('*')
      .eq('ai_tool_id', id)
      .eq('org_id', orgId)
      .order('created_at', { ascending: false }),
    supabase
      .from('compliance_documents')
      .select('*')
      .eq('ai_tool_id', id)
      .eq('org_id', orgId)
      .order('created_at', { ascending: false }),
    supabase
      .from('audit_logs')
      .select('id, action, created_at, details')
      .eq('entity_id', id)
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  if (!toolResult.data) notFound();

  const t = toolResult.data;

  // Map to camelCase types
  const tool: AiToolWithAssessments = {
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
    riskAssessments: (assessmentsResult.data ?? []).map(
      (r): RiskAssessmentRow => ({
        id: r.id,
        orgId: r.org_id,
        aiToolId: r.ai_tool_id,
        regulation: r.regulation_code,
        riskLevel: r.risk_level,
        riskScore: r.risk_score,
        findings: r.findings,
        recommendations: r.recommendations,
        assessedBy: r.assessed_by,
        assessedAt: r.assessed_at,
        expiresAt: r.expires_at,
        createdAt: r.created_at,
      }),
    ),
    complianceDocuments: (documentsResult.data ?? []).map(
      (d): ComplianceDocumentRow => ({
        id: d.id,
        orgId: d.org_id,
        aiToolId: d.ai_tool_id,
        title: d.title,
        type: d.type,
        regulation: d.regulation,
        status: d.status,
        version: d.version,
        content: d.content,
        pdfUrl: d.pdf_url,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }),
    ),
  };

  const auditLogs: AuditLogEntry[] = (logsResult.data ?? []).map((log) => ({
    id: log.id,
    action: log.action,
    createdAt: log.created_at,
    details: log.details as Record<string, string | number | boolean | null> | null,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title={tool.name}
        description={tool.provider ?? undefined}
        actions={
          <>
            <div className="flex items-center gap-2">
              <RiskBadge level={tool.riskLevel ?? 'not_assessed'} />
              <StatusBadge status={tool.status ?? 'active'} />
            </div>
            <Link href={`/scanner/${id}?edit=true`}>
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </Link>
            <Link href="/scanner">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </Link>
          </>
        }
      />

      <ToolDetailTabs tool={tool} auditLogs={auditLogs} />
    </div>
  );
}
