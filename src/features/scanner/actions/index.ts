'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerClient, getOrgId, getUser } from '@/lib/supabase/server';
import {
  createToolSchema,
  updateToolSchema,
  type CreateToolInput,
  type UpdateToolInput,
} from '@/features/scanner/schemas';
import { assessAiTool as assessAiToolService } from '@/features/scanner/services/assess-tool';

/**
 * Crée un nouvel outil IA dans l'inventaire de l'organisation.
 */
export async function createAiTool(data: CreateToolInput): Promise<{ id: string }> {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');
  const user = await getUser();

  const validated = createToolSchema.parse(data);
  const supabase = await createServerClient();

  const { data: tool, error } = await supabase
    .from('ai_tools')
    .insert({
      org_id: orgId,
      name: validated.name,
      provider: validated.provider,
      category: validated.category,
      description: validated.description ?? null,
      url: validated.url || null,
      usage_context: validated.usageContext,
      data_types_processed: validated.dataTypesProcessed,
      user_count: validated.userCount,
      is_customer_facing: validated.isCustomerFacing,
      automated_decisions: validated.automatedDecisions,
      risk_level: 'not_assessed',
      status: 'active',
    })
    .select('id')
    .single();

  if (error || !tool) throw new Error(error?.message ?? 'Erreur lors de la création');

  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: user?.id ?? null,
    action: 'tool.created',
    entity_type: 'ai_tool',
    entity_id: tool.id,
    details: { name: validated.name, provider: validated.provider },
  });

  revalidatePath('/scanner');
  redirect(`/scanner/${tool.id}`);
}

/**
 * Met à jour un outil IA existant.
 */
export async function updateAiTool(id: string, data: UpdateToolInput): Promise<void> {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');
  const user = await getUser();

  const validated = updateToolSchema.parse(data);
  const supabase = await createServerClient();

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (validated.name !== undefined) updateData.name = validated.name;
  if (validated.provider !== undefined) updateData.provider = validated.provider;
  if (validated.category !== undefined) updateData.category = validated.category;
  if (validated.description !== undefined) updateData.description = validated.description;
  if (validated.url !== undefined) updateData.url = validated.url || null;
  if (validated.usageContext !== undefined) updateData.usage_context = validated.usageContext;
  if (validated.dataTypesProcessed !== undefined)
    updateData.data_types_processed = validated.dataTypesProcessed;
  if (validated.userCount !== undefined) updateData.user_count = validated.userCount;
  if (validated.isCustomerFacing !== undefined)
    updateData.is_customer_facing = validated.isCustomerFacing;
  if (validated.automatedDecisions !== undefined)
    updateData.automated_decisions = validated.automatedDecisions;

  await supabase.from('ai_tools').update(updateData).eq('id', id).eq('org_id', orgId);

  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: user?.id ?? null,
    action: 'tool.updated',
    entity_type: 'ai_tool',
    entity_id: id,
    details: validated,
  });

  revalidatePath('/scanner');
  revalidatePath(`/scanner/${id}`);
}

/**
 * Supprime un outil IA (soft delete → status 'deprecated').
 */
export async function deleteAiTool(id: string): Promise<void> {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');
  const user = await getUser();

  const supabase = await createServerClient();

  await supabase
    .from('ai_tools')
    .update({ status: 'deprecated', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('org_id', orgId);

  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: user?.id ?? null,
    action: 'tool.deleted',
    entity_type: 'ai_tool',
    entity_id: id,
  });

  revalidatePath('/scanner');
}

/**
 * Lance l'évaluation IA d'un outil.
 */
export async function assessAiTool(id: string): Promise<{ success: boolean; error?: string }> {
  const orgId = await getOrgId();
  if (!orgId) return { success: false, error: 'Non authentifié' };
  const user = await getUser();

  try {
    await assessAiToolService(id, orgId, user?.id);
    revalidatePath(`/scanner/${id}`);
    revalidatePath('/scanner');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de l'évaluation";
    return { success: false, error: message };
  }
}
