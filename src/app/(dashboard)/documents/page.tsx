import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { createServerClient, getOrgId } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { DocumentsTable } from '@/features/documents/components/documents-table';
import { DocumentFilters } from '@/features/documents/components/document-filters';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import type { ComplianceDocumentRow } from '@/features/documents/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documents de conformite — CompliPilot',
  description: 'Generez et gerez vos documents de conformite IA.',
};

const PAGE_SIZE = 20;

interface DocumentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');

  const params = await searchParams;
  const typeFilter = typeof params.type === 'string' ? params.type : undefined;
  const regulationFilter = typeof params.regulation === 'string' ? params.regulation : undefined;
  const statusFilter = typeof params.status === 'string' ? params.status : undefined;
  const toolIdFilter = typeof params.toolId === 'string' ? params.toolId : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const supabase = await createServerClient();

  // Build filtered query
  let docsQuery = supabase
    .from('compliance_documents')
    .select('*, ai_tools(name)', { count: 'exact' })
    .eq('org_id', orgId)
    .neq('status', 'archived')
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (typeFilter) docsQuery = docsQuery.eq('type', typeFilter);
  if (regulationFilter) docsQuery = docsQuery.eq('regulation', regulationFilter);
  if (statusFilter) docsQuery = docsQuery.eq('status', statusFilter);
  if (toolIdFilter) docsQuery = docsQuery.eq('ai_tool_id', toolIdFilter);

  const { data: rawDocs, count } = await docsQuery;

  // Fetch tools for the filter selector
  const { data: tools } = await supabase
    .from('ai_tools')
    .select('id, name')
    .eq('org_id', orgId)
    .neq('status', 'deprecated')
    .order('name');

  const toolOptions = (tools ?? []).map((t) => ({ id: t.id, name: t.name }));

  // Map to camelCase
  const documents: ComplianceDocumentRow[] = (rawDocs ?? []).map((d) => {
    const toolJoin = d.ai_tools as unknown as { name: string } | null;
    return {
      id: d.id,
      orgId: d.org_id,
      aiToolId: d.ai_tool_id,
      aiToolName: toolJoin?.name ?? null,
      title: d.title,
      type: d.type,
      regulation: d.regulation,
      contentMarkdown: d.content_markdown,
      content: (d.content ?? {}) as Record<string, unknown>,
      status: d.status,
      version: d.version ?? 1,
      generatedBy: d.generated_by,
      approvedBy: d.approved_by,
      approvedAt: d.approved_at,
      expiresAt: d.expires_at,
      pdfUrl: d.pdf_url,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    };
  });

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents de conformite"
        description="Generez, editez et exportez vos documents reglementaires."
        actions={
          <Link href="/documents/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Generer un document
            </Button>
          </Link>
        }
      />

      <Suspense fallback={<LoadingSkeleton variant="table-row" />}>
        <DocumentFilters tools={toolOptions} />
      </Suspense>

      <DocumentsTable documents={documents} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {count} document{(count ?? 0) > 1 ? 's' : ''} au total
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/documents?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => typeof v === 'string') as [string, string][]), page: String(page - 1) }).toString()}`}
              >
                <Button variant="outline" size="sm">
                  Precedent
                </Button>
              </Link>
            )}
            <span className="flex items-center px-3 text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/documents?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => typeof v === 'string') as [string, string][]), page: String(page + 1) }).toString()}`}
              >
                <Button variant="outline" size="sm">
                  Suivant
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
