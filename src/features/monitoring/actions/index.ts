'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient, getOrgId } from '@/lib/supabase/server';

/**
 * Marks a single alert as read.
 */
export async function markAlertRead(alertId: string): Promise<void> {
  const orgId = await getOrgId();
  if (!orgId) return;

  const supabase = await createServerClient();
  await supabase.from('alerts').update({ is_read: true }).eq('id', alertId).eq('org_id', orgId);

  revalidatePath('/monitoring');
}

/**
 * Marks all alerts as read for the current org.
 */
export async function markAllAlertsRead(): Promise<void> {
  const orgId = await getOrgId();
  if (!orgId) return;

  const supabase = await createServerClient();
  await supabase.from('alerts').update({ is_read: true }).eq('org_id', orgId).eq('is_read', false);

  revalidatePath('/monitoring');
}
