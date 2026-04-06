import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createServerClient, getOrgId } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { DocumentEditor } from '@/features/documents/components/document-editor';
import { DocumentSidebar } from '@/features/documents/components/document-sidebar';
import type { ComplianceDocumentRow } from '@/features/documents/types';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Document ${id.slice(0, 8)} — CompliPilot`,
  };
}

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Document detail page — view and edit a compliance document.
 */
export default async function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const { id } = await params;
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');

  const supabase = await createServerClient();

  const { data: raw } = await supabase
    .from('compliance_documents')
    .select('*, ai_tools(name)')
    .eq('id', id)
    .eq('org_id', orgId)
    .single();

  if (!raw) notFound();

  const toolJoin = raw.ai_tools as unknown as { name: string } | null;

  const doc: ComplianceDocumentRow = {
    id: raw.id,
    orgId: raw.org_id,
    aiToolId: raw.ai_tool_id,
    aiToolName: toolJoin?.name ?? null,
    title: raw.title,
    type: raw.type,
    regulation: raw.regulation,
    contentMarkdown: raw.content_markdown,
    content: (raw.content ?? {}) as Record<string, unknown>,
    status: raw.status,
    version: raw.version ?? 1,
    generatedBy: raw.generated_by,
    approvedBy: raw.approved_by,
    approvedAt: raw.approved_at,
    expiresAt: raw.expires_at,
    pdfUrl: raw.pdf_url,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={doc.title}
        description={doc.aiToolName ? `Outil : ${doc.aiToolName}` : 'Document global'}
        actions={
          <Link href="/documents">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Retour
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main content — editor / preview */}
        <DocumentEditor documentId={doc.id} initialContent={doc.contentMarkdown ?? ''} />

        {/* Sidebar — metadata, status workflow, actions */}
        <DocumentSidebar document={doc} />
      </div>
    </div>
  );
}
