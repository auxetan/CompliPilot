'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerClient, getOrgId, getUser } from '@/lib/supabase/server';
import { updateDocumentSchema, type UpdateDocumentValues } from '@/features/documents/schemas';
import { exportDocumentToPdf } from '@/features/documents/services/export-pdf';

/**
 * Updates a compliance document (title, content, status).
 */
export async function updateDocument(id: string, data: UpdateDocumentValues): Promise<void> {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');
  const user = await getUser();

  const validated = updateDocumentSchema.parse(data);
  const supabase = await createServerClient();

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (validated.title !== undefined) updateData.title = validated.title;
  if (validated.contentMarkdown !== undefined)
    updateData.content_markdown = validated.contentMarkdown;
  if (validated.content !== undefined) updateData.content = validated.content;
  if (validated.status !== undefined) {
    updateData.status = validated.status;
    if (validated.status === 'approved') {
      updateData.approved_by = user?.id ?? null;
      updateData.approved_at = new Date().toISOString();
    }
  }

  await supabase.from('compliance_documents').update(updateData).eq('id', id).eq('org_id', orgId);

  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: user?.id ?? null,
    action: `document.${validated.status ? 'status_changed' : 'updated'}`,
    entity_type: 'compliance_document',
    entity_id: id,
    details: validated,
  });

  revalidatePath('/documents');
  revalidatePath(`/documents/${id}`);
}

/**
 * Duplicates an existing document as a new draft.
 */
export async function duplicateDocument(id: string): Promise<{ newId: string }> {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');
  const user = await getUser();

  const supabase = await createServerClient();

  const { data: original } = await supabase
    .from('compliance_documents')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .single();

  if (!original) throw new Error('Document introuvable');

  const { data: copy, error } = await supabase
    .from('compliance_documents')
    .insert({
      org_id: orgId,
      ai_tool_id: original.ai_tool_id,
      title: `${original.title} (copie)`,
      type: original.type,
      regulation: original.regulation,
      content: original.content,
      content_markdown: original.content_markdown,
      status: 'draft',
      version: 1,
      generated_by: original.generated_by,
    })
    .select('id')
    .single();

  if (error || !copy) throw new Error('Erreur lors de la duplication');

  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: user?.id ?? null,
    action: 'document.duplicated',
    entity_type: 'compliance_document',
    entity_id: copy.id,
    details: { originalId: id },
  });

  revalidatePath('/documents');
  redirect(`/documents/${copy.id}`);
}

/**
 * Archives a document (soft delete).
 */
export async function archiveDocument(id: string): Promise<void> {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');
  const user = await getUser();

  const supabase = await createServerClient();

  await supabase
    .from('compliance_documents')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('org_id', orgId);

  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: user?.id ?? null,
    action: 'document.archived',
    entity_type: 'compliance_document',
    entity_id: id,
  });

  revalidatePath('/documents');
}

/**
 * Generates a PDF for a document and returns the download URL.
 */
export async function generatePdf(
  id: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  const orgId = await getOrgId();
  if (!orgId) return { success: false, error: 'Non authentifie' };

  const supabase = await createServerClient();

  const { data: doc } = await supabase
    .from('compliance_documents')
    .select('id, title, content_markdown')
    .eq('id', id)
    .eq('org_id', orgId)
    .single();

  if (!doc || !doc.content_markdown) {
    return { success: false, error: 'Document introuvable ou vide' };
  }

  try {
    const url = await exportDocumentToPdf(doc.id, orgId, doc.title, doc.content_markdown);
    revalidatePath(`/documents/${id}`);
    return { success: true, url };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur PDF';
    return { success: false, error: message };
  }
}
