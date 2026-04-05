'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { getOrgId } from '@/lib/supabase/server';
import { recalculateComplianceScore } from '../services/calculate-score';

type CheckStatus = 'compliant' | 'non_compliant' | 'partial' | 'not_applicable' | 'not_checked';

/**
 * Updates the status of a compliance check and recalculates the org score.
 */
export async function updateComplianceCheck(
  checkId: string,
  status: CheckStatus,
  evidence?: string,
): Promise<{ success: boolean; error?: string }> {
  const orgId = await getOrgId();
  if (!orgId) return { success: false, error: 'Non authentifie' };

  const supabase = await createServerClient();

  const { error } = await supabase
    .from('compliance_checks')
    .update({
      status,
      evidence: evidence ?? null,
      checked_at: new Date().toISOString(),
    })
    .eq('id', checkId)
    .eq('org_id', orgId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Recalculate compliance score
  await recalculateComplianceScore(orgId);

  revalidatePath('/risks');
  revalidatePath('/dashboard');

  return { success: true };
}
