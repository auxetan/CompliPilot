import { createServerClient } from '@/lib/supabase/server';
import { REGULATIONS, REGULATION_LABELS } from '@/lib/constants';

const SEVERITY_WEIGHT: Record<string, number> = {
  high: 3,
  limited: 2,
  minimal: 1,
  unacceptable: 3,
};

/**
 * Recalculates the global compliance score for an organization.
 *
 * Algorithm:
 * - For each regulation: count compliant vs total compliance_checks
 *   weighted by severity (high=3, limited=2, minimal=1).
 * - Regulation score = (compliant_weighted / total_weighted) * 100
 * - Global score = weighted average across regulations.
 * - Updates organizations.compliance_score.
 */
export async function recalculateComplianceScore(orgId: string): Promise<number> {
  const supabase = await createServerClient();

  // Get all tools with their risk levels for weighting
  const { data: tools } = await supabase
    .from('ai_tools')
    .select('id, risk_level')
    .eq('org_id', orgId)
    .neq('status', 'deprecated');

  const toolWeights = new Map<string, number>();
  if (tools) {
    for (const t of tools) {
      toolWeights.set(t.id, SEVERITY_WEIGHT[t.risk_level] ?? 1);
    }
  }

  // Get all compliance checks
  const { data: checks } = await supabase
    .from('compliance_checks')
    .select('id, regulation_id, ai_tool_id, status')
    .eq('org_id', orgId);

  if (!checks || checks.length === 0) {
    await supabase.from('organizations').update({ compliance_score: 0 }).eq('id', orgId);
    return 0;
  }

  // Get regulation IDs
  const { data: regulations } = await supabase
    .from('regulations')
    .select('id, code')
    .in('code', [...REGULATIONS]);

  const regIdToCode = new Map<string, string>();
  if (regulations) {
    for (const r of regulations) {
      regIdToCode.set(r.id, r.code);
    }
  }

  // Calculate per-regulation scores
  const regScores: { code: string; score: number; weight: number }[] = [];

  for (const regCode of REGULATIONS) {
    const regId = regulations?.find((r) => r.code === regCode)?.id;
    if (!regId) continue;

    const regChecks = checks.filter((c) => c.regulation_id === regId);
    if (regChecks.length === 0) continue;

    let totalWeighted = 0;
    let compliantWeighted = 0;

    for (const check of regChecks) {
      const weight = check.ai_tool_id ? (toolWeights.get(check.ai_tool_id) ?? 1) : 1;
      totalWeighted += weight;
      if (check.status === 'compliant') {
        compliantWeighted += weight;
      } else if (check.status === 'partial') {
        compliantWeighted += weight * 0.5;
      }
    }

    const score = totalWeighted > 0 ? Math.round((compliantWeighted / totalWeighted) * 100) : 0;

    regScores.push({ code: regCode, score, weight: regChecks.length });
  }

  // Global score = weighted average
  const totalWeight = regScores.reduce((s, r) => s + r.weight, 0);
  const globalScore =
    totalWeight > 0
      ? Math.round(regScores.reduce((s, r) => s + r.score * r.weight, 0) / totalWeight)
      : 0;

  // Update org
  await supabase.from('organizations').update({ compliance_score: globalScore }).eq('id', orgId);

  return globalScore;
}
