import { createServerClient } from '@/lib/supabase/server';
import { PLANS } from './config';
import type { PlanId, PlanLimits } from './config';

export type LimitResource = 'tools' | 'documents' | 'team_members';

interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  plan: PlanId;
  resource: LimitResource;
}

/**
 * Checks if the organization can create a new resource based on plan limits.
 * Call this BEFORE creating tools, documents, or sending invitations.
 */
export async function checkLimit(
  orgId: string,
  resource: LimitResource,
): Promise<LimitCheckResult> {
  const supabase = await createServerClient();

  // Fetch current plan
  const { data: org } = await supabase
    .from('organizations')
    .select('plan')
    .eq('id', orgId)
    .single();

  const plan = (org?.plan as PlanId) ?? 'free';
  const limits: PlanLimits = PLANS[plan]?.limits ?? PLANS.free.limits;

  let current = 0;
  let limit = 0;

  switch (resource) {
    case 'tools': {
      const { count } = await supabase
        .from('ai_tools')
        .select('id', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .neq('status', 'deprecated');
      current = count ?? 0;
      limit = limits.tools;
      break;
    }

    case 'documents': {
      // Count documents created this month (UTC for consistency)
      const startOfMonth = new Date();
      startOfMonth.setUTCDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);
      const { count } = await supabase
        .from('compliance_documents')
        .select('id', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .gte('created_at', startOfMonth.toISOString());
      current = count ?? 0;
      limit = limits.documentsPerMonth;
      break;
    }

    case 'team_members': {
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('org_id', orgId);
      current = count ?? 0;
      limit = limits.teamMembers;
      break;
    }
  }

  return {
    allowed: limit === Infinity || current < limit,
    current,
    limit,
    plan,
    resource,
  };
}

/**
 * Fetches current usage for all resources (for the billing page).
 */
export async function getUsage(orgId: string): Promise<{
  plan: PlanId;
  tools: { current: number; limit: number };
  documents: { current: number; limit: number };
  teamMembers: { current: number; limit: number };
}> {
  const [toolsCheck, docsCheck, membersCheck] = await Promise.all([
    checkLimit(orgId, 'tools'),
    checkLimit(orgId, 'documents'),
    checkLimit(orgId, 'team_members'),
  ]);

  return {
    plan: toolsCheck.plan,
    tools: { current: toolsCheck.current, limit: toolsCheck.limit },
    documents: { current: docsCheck.current, limit: docsCheck.limit },
    teamMembers: { current: membersCheck.current, limit: membersCheck.limit },
  };
}
