import { createServerClient } from '@/lib/supabase/server';
import type {
  DashboardStats,
  RegulationScore,
  PriorityAction,
  ActivityEntry,
  ComplianceHistoryPoint,
} from '../types';

/**
 * Fetches aggregate stats for the dashboard header cards.
 */
export async function getDashboardStats(orgId: string): Promise<DashboardStats> {
  const supabase = await createServerClient();

  const [toolsRes, highRiskRes, docsRes, alertsRes, orgRes] = await Promise.all([
    supabase.from('ai_tools').select('id', { count: 'exact', head: true }).eq('org_id', orgId),
    supabase
      .from('ai_tools')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .in('risk_level', ['high', 'unacceptable']),
    supabase
      .from('compliance_documents')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId),
    supabase
      .from('alerts')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('is_read', false),
    supabase.from('organizations').select('compliance_score').eq('id', orgId).single(),
  ]);

  return {
    totalTools: toolsRes.count ?? 0,
    highRiskTools: highRiskRes.count ?? 0,
    totalDocuments: docsRes.count ?? 0,
    unreadAlerts: alertsRes.count ?? 0,
    complianceScore: orgRes.data?.compliance_score ?? 0,
  };
}

/**
 * Fetches compliance score per regulation.
 */
export async function getComplianceByRegulation(orgId: string): Promise<RegulationScore[]> {
  const supabase = await createServerClient();

  const regulations = [
    { code: 'eu_ai_act' as const, name: 'EU AI Act' },
    { code: 'gdpr' as const, name: 'RGPD' },
    { code: 'nis2' as const, name: 'NIS2' },
    { code: 'dora' as const, name: 'DORA' },
  ];

  const results = await Promise.all(
    regulations.map(async (reg) => {
      const { data: regRow } = await supabase
        .from('regulations')
        .select('id')
        .eq('code', reg.code)
        .single();

      if (!regRow) {
        return { ...reg, score: 0, totalChecks: 0, completedChecks: 0 };
      }

      const [totalRes, compliantRes] = await Promise.all([
        supabase
          .from('compliance_checks')
          .select('id', { count: 'exact', head: true })
          .eq('org_id', orgId)
          .eq('regulation_id', regRow.id),
        supabase
          .from('compliance_checks')
          .select('id', { count: 'exact', head: true })
          .eq('org_id', orgId)
          .eq('regulation_id', regRow.id)
          .eq('status', 'compliant'),
      ]);

      const total = totalRes.count ?? 0;
      const completed = compliantRes.count ?? 0;
      const score = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { ...reg, score, totalChecks: total, completedChecks: completed };
    }),
  );

  return results;
}

/**
 * Fetches top 5 priority actions for the organization.
 */
export async function getPriorityActions(orgId: string): Promise<PriorityAction[]> {
  const supabase = await createServerClient();

  const actions: PriorityAction[] = [];

  // Tools not assessed
  const { data: unassessedTools } = await supabase
    .from('ai_tools')
    .select('id, name')
    .eq('org_id', orgId)
    .eq('risk_level', 'not_assessed')
    .limit(3);

  if (unassessedTools) {
    for (const tool of unassessedTools) {
      actions.push({
        id: `assess-${tool.id}`,
        type: 'assess_tool',
        title: `Evaluer ${tool.name}`,
        description: `Cet outil n'a pas encore ete evalue. Lancez une classification des risques.`,
        urgency: 'high',
        href: `/scanner/${tool.id}`,
      });
    }
  }

  // Expired documents
  const { data: expiredDocs } = await supabase
    .from('compliance_documents')
    .select('id, title')
    .eq('org_id', orgId)
    .eq('status', 'expired')
    .limit(2);

  if (expiredDocs) {
    for (const doc of expiredDocs) {
      actions.push({
        id: `renew-${doc.id}`,
        type: 'generate_doc',
        title: `Renouveler "${doc.title}"`,
        description: 'Ce document a expire et doit etre regenere.',
        urgency: 'critical',
        href: `/documents/${doc.id}`,
      });
    }
  }

  return actions.slice(0, 5);
}

/**
 * Fetches the 10 most recent audit log entries.
 */
export async function getRecentActivity(orgId: string): Promise<ActivityEntry[]> {
  const supabase = await createServerClient();

  const { data } = await supabase
    .from('audit_logs')
    .select('id, action, entity_type, details, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!data) return [];

  return data.map((log) => ({
    id: log.id,
    action: log.action,
    entityType: log.entity_type ?? '',
    description: formatAction(log.action, log.details as Record<string, string> | null),
    createdAt: log.created_at,
  }));
}

function formatAction(action: string, details: Record<string, string> | null): string {
  const name = details?.name ?? '';
  switch (action) {
    case 'tool.created':
      return `Outil "${name}" ajoute`;
    case 'tool.assessed':
      return `Outil "${name}" evalue`;
    case 'document.created':
      return `Document "${name}" genere`;
    case 'document.approved':
      return `Document "${name}" approuve`;
    case 'settings.updated':
      return 'Parametres mis a jour';
    default:
      return action;
  }
}

/**
 * Fetches compliance score history for the chart.
 */
export async function getComplianceHistory(
  orgId: string,
  days = 30,
): Promise<ComplianceHistoryPoint[]> {
  // In a real app this would query a history table.
  // For now, generate mock data based on the current score.
  const supabase = await createServerClient();
  const { data: org } = await supabase
    .from('organizations')
    .select('compliance_score')
    .eq('id', orgId)
    .single();

  const currentScore = org?.compliance_score ?? 0;
  const points: ComplianceHistoryPoint[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Simulate gradual increase towards current score
    const progress = (days - i) / days;
    const startScore = Math.max(0, currentScore - 30);
    const score = Math.round(startScore + (currentScore - startScore) * progress);
    points.push({
      date: date.toISOString().split('T')[0] ?? date.toISOString(),
      score,
    });
  }

  return points;
}
