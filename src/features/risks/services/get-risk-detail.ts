import { createServerClient } from '@/lib/supabase/server';
import { REGULATION_LABELS } from '@/lib/constants';
import type {
  RiskAssessmentDetail,
  Finding,
  Recommendation,
  ComplianceCheckItem,
  AssessmentHistoryEntry,
} from '../types';

/**
 * Fetches the full detail of a single risk assessment.
 */
export async function getRiskAssessmentDetail(
  assessmentId: string,
  orgId: string,
): Promise<RiskAssessmentDetail | null> {
  const supabase = await createServerClient();

  const { data } = await supabase
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
      assessed_by,
      assessed_at,
      expires_at,
      ai_tools!inner ( id, name, provider, category )
    `,
    )
    .eq('id', assessmentId)
    .eq('org_id', orgId)
    .single();

  if (!data) return null;

  const tool = data.ai_tools as unknown as {
    id: string;
    name: string;
    provider: string | null;
    category: string | null;
  };

  return {
    id: data.id,
    toolId: tool.id,
    toolName: tool.name,
    toolProvider: tool.provider,
    toolCategory: tool.category,
    regulation: data.regulation_code,
    riskLevel: data.risk_level,
    riskScore: data.risk_score ?? 0,
    findings: (data.findings ?? []) as Finding[],
    recommendations: (data.recommendations ?? []) as Recommendation[],
    assessedBy: data.assessed_by ?? 'ai',
    assessedAt: data.assessed_at,
    expiresAt: data.expires_at,
  };
}

/**
 * Fetches compliance checks linked to a specific tool and regulation.
 */
export async function getComplianceChecks(
  orgId: string,
  toolId: string,
  regulationCode: string,
): Promise<ComplianceCheckItem[]> {
  const supabase = await createServerClient();

  // Get regulation ID
  const { data: reg } = await supabase
    .from('regulations')
    .select('id')
    .eq('code', regulationCode)
    .single();

  if (!reg) return [];

  const { data } = await supabase
    .from('compliance_checks')
    .select('id, requirement_key, requirement_label, status, evidence, notes, checked_at')
    .eq('org_id', orgId)
    .eq('ai_tool_id', toolId)
    .eq('regulation_id', reg.id)
    .order('requirement_key');

  if (!data) return [];

  return data.map((c) => ({
    id: c.id,
    requirementKey: c.requirement_key,
    requirementLabel: c.requirement_label,
    status: c.status as ComplianceCheckItem['status'],
    evidence: c.evidence,
    notes: c.notes,
    checkedAt: c.checked_at,
  }));
}

/**
 * Fetches previous assessments for the same tool (history tab).
 */
export async function getAssessmentHistory(
  orgId: string,
  toolId: string,
): Promise<AssessmentHistoryEntry[]> {
  const supabase = await createServerClient();

  const { data } = await supabase
    .from('risk_assessments')
    .select('id, regulation_code, risk_level, risk_score, assessed_by, assessed_at')
    .eq('org_id', orgId)
    .eq('ai_tool_id', toolId)
    .order('assessed_at', { ascending: false })
    .limit(20);

  if (!data) return [];

  return data.map((r) => ({
    id: r.id,
    regulation:
      REGULATION_LABELS[r.regulation_code as keyof typeof REGULATION_LABELS] ?? r.regulation_code,
    riskLevel: r.risk_level,
    riskScore: r.risk_score ?? 0,
    assessedBy: r.assessed_by ?? 'ai',
    assessedAt: r.assessed_at,
  }));
}
