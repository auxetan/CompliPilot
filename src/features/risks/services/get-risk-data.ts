import { createServerClient } from '@/lib/supabase/server';
import { REGULATIONS, REGULATION_LABELS } from '@/lib/constants';
import type { RiskLevelStat, RiskMatrixPoint, RiskTableRow, RiskActionItem } from '../types';

/**
 * Fetches risk level distribution for the stat cards.
 */
export async function getRiskOverview(orgId: string): Promise<RiskLevelStat[]> {
  const supabase = await createServerClient();

  const levels = ['unacceptable', 'high', 'limited', 'minimal'] as const;
  const results = await Promise.all(
    levels.map(async (level) => {
      const { count } = await supabase
        .from('ai_tools')
        .select('id', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .eq('risk_level', level)
        .neq('status', 'deprecated');
      return { level, count: count ?? 0 };
    }),
  );

  return results;
}

/**
 * Builds data points for the 2D risk matrix.
 */
export async function getRiskMatrix(orgId: string): Promise<RiskMatrixPoint[]> {
  const supabase = await createServerClient();

  const { data: tools } = await supabase
    .from('ai_tools')
    .select(
      'id, name, provider, risk_level, risk_score, data_types_processed, is_customer_facing, automated_decisions, user_count',
    )
    .eq('org_id', orgId)
    .neq('status', 'deprecated')
    .neq('risk_level', 'not_assessed');

  if (!tools) return [];

  return tools.map((tool) => {
    const dataTypes = (tool.data_types_processed as string[] | null) ?? [];
    const sensitiveTypes = dataTypes.filter((d) =>
      ['personal_data', 'financial', 'health'].includes(d),
    );

    // Impact probability: customer-facing + sensitive data + user count
    let impactProb = 20;
    if (tool.is_customer_facing) impactProb += 30;
    if (sensitiveTypes.length > 0) impactProb += sensitiveTypes.length * 15;
    if ((tool.user_count ?? 0) > 50) impactProb += 15;
    impactProb = Math.min(100, impactProb);

    // Severity: risk score + automated decisions
    let severity = tool.risk_score ?? 50;
    if (tool.automated_decisions) severity = Math.min(100, severity + 20);

    return {
      toolId: tool.id,
      toolName: tool.name,
      provider: tool.provider,
      riskLevel: tool.risk_level,
      riskScore: tool.risk_score ?? 0,
      impactProbability: impactProb,
      severity,
    };
  });
}

/**
 * Fetches all risk assessments for the grouped table.
 */
export async function getRisksByRegulation(
  orgId: string,
  regulation?: string,
): Promise<RiskTableRow[]> {
  const supabase = await createServerClient();

  let query = supabase
    .from('risk_assessments')
    .select(
      `
      id,
      ai_tool_id,
      regulation_code,
      risk_level,
      risk_score,
      findings,
      recommendations,
      assessed_at,
      ai_tools!inner ( id, name, provider )
    `,
    )
    .eq('org_id', orgId)
    .order('risk_score', { ascending: false });

  if (regulation) {
    query = query.eq('regulation_code', regulation);
  }

  const { data } = await query;
  if (!data) return [];

  const regLabels = REGULATION_LABELS;

  return data.map((row) => {
    const findings = (row.findings ?? []) as Array<{ finding?: string }>;
    const recs = (row.recommendations ?? []) as Array<{
      action?: string;
      deadlineSuggested?: string | null;
    }>;
    const tool = row.ai_tools as unknown as { id: string; name: string; provider: string | null };

    return {
      assessmentId: row.id,
      toolId: tool.id,
      toolName: tool.name,
      provider: tool.provider,
      riskLevel: row.risk_level,
      riskScore: row.risk_score ?? 0,
      regulation: row.regulation_code,
      regulationLabel:
        regLabels[row.regulation_code as keyof typeof regLabels] ?? row.regulation_code,
      topFinding: findings[0]?.finding ?? null,
      actionRequired: recs[0]?.action ?? null,
      deadline: recs[0]?.deadlineSuggested ?? null,
      assessedAt: row.assessed_at,
    };
  });
}

/**
 * Fetches the top 10 action items sorted by urgency.
 */
export async function getActionItems(orgId: string): Promise<RiskActionItem[]> {
  const supabase = await createServerClient();

  const { data } = await supabase
    .from('risk_assessments')
    .select(
      `
      id,
      ai_tool_id,
      regulation_code,
      recommendations,
      ai_tools!inner ( id, name )
    `,
    )
    .eq('org_id', orgId)
    .order('risk_score', { ascending: false });

  if (!data) return [];

  const regLabels = REGULATION_LABELS;

  const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 } as const;

  const items: RiskActionItem[] = [];

  for (const row of data) {
    const recs = (row.recommendations ?? []) as Array<{
      priority?: string;
      action?: string;
      regulation?: string;
      deadlineSuggested?: string | null;
    }>;
    const tool = row.ai_tools as unknown as { id: string; name: string };

    for (const rec of recs) {
      if (!rec.action) continue;
      items.push({
        id: `${row.id}-${items.length}`,
        priority: (rec.priority as RiskActionItem['priority']) ?? 'medium',
        action: rec.action,
        regulation: rec.regulation ?? row.regulation_code,
        regulationLabel:
          regLabels[(rec.regulation ?? row.regulation_code) as keyof typeof regLabels] ??
          row.regulation_code,
        toolId: tool.id,
        toolName: tool.name,
        deadline: rec.deadlineSuggested ?? null,
      });
    }
  }

  items.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3));

  return items.slice(0, 10);
}
