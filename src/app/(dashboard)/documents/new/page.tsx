import { redirect } from 'next/navigation';
import { createServerClient, getOrgId } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { GenerateDocumentForm } from '@/features/documents/components/generate-document-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generer un document — CompliPilot',
  description: 'Generez un document de conformite IA avec Claude.',
};

/**
 * Document generation page — multi-step form for creating compliance documents.
 */
export default async function NewDocumentPage() {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');

  const supabase = await createServerClient();

  // Fetch tools for the tool selector (Step 2)
  const { data: tools } = await supabase
    .from('ai_tools')
    .select('id, name')
    .eq('org_id', orgId)
    .neq('status', 'deprecated')
    .order('name');

  const toolOptions = (tools ?? []).map((t) => ({ id: t.id, name: t.name }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generer un document"
        description="Creez un document de conformite adapte a votre outil IA et a la reglementation ciblee."
      />
      <GenerateDocumentForm tools={toolOptions} />
    </div>
  );
}
