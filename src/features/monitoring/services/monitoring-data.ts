import { createServerClient } from '@/lib/supabase/server';
import type {
  ComplianceTimelinePoint,
  ExpiringDocument,
  StaleToolItem,
  DeadlineItem,
} from '../types';

/**
 * Fetches compliance score history for timeline charts.
 */
export async function getComplianceTimeline(
  orgId: string,
  days: number = 30,
): Promise<ComplianceTimelinePoint[]> {
  const supabase = await createServerClient();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('risk_assessments')
    .select('regulation_code, risk_score, assessed_at')
    .eq('org_id', orgId)
    .gte('assessed_at', since)
    .order('assessed_at', { ascending: true });

  if (!data || data.length === 0) return [];

  // Group by date and regulation, compute average score per day
  const byDate = new Map<string, Record<string, number[]>>();

  for (const row of data) {
    const date = row.assessed_at?.slice(0, 10) ?? '';
    if (!date) continue;
    if (!byDate.has(date)) byDate.set(date, {});
    const reg = row.regulation_code ?? 'unknown';
    const bucket = byDate.get(date)!;
    if (!bucket[reg]) bucket[reg] = [];
    bucket[reg].push(row.risk_score ?? 0);
  }

  const points: ComplianceTimelinePoint[] = [];
  for (const [date, regs] of byDate) {
    const avg = (arr: number[] | undefined) =>
      arr && arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    points.push({
      date,
      euAiAct: 100 - avg(regs['eu_ai_act']),
      gdpr: 100 - avg(regs['gdpr']),
      nis2: 100 - avg(regs['nis2']),
      dora: 100 - avg(regs['dora']),
    });
  }

  return points;
}

/**
 * Fetches documents expiring within the next 30 days.
 */
export async function getExpiringDocuments(orgId: string): Promise<ExpiringDocument[]> {
  const supabase = await createServerClient();
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('compliance_documents')
    .select('id, title, type, expires_at')
    .eq('org_id', orgId)
    .eq('status', 'approved')
    .not('expires_at', 'is', null)
    .lte('expires_at', in30Days)
    .gte('expires_at', now.toISOString())
    .order('expires_at', { ascending: true })
    .limit(10);

  return (data ?? []).map((d) => {
    const expiresAt = d.expires_at ?? '';
    const daysUntil = Math.max(
      0,
      Math.ceil((new Date(expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );
    return {
      id: d.id,
      title: d.title,
      type: d.type,
      expiresAt,
      daysUntil,
    };
  });
}

/**
 * Fetches tools not assessed in the last 90 days.
 */
export async function getStaleTools(orgId: string): Promise<StaleToolItem[]> {
  const supabase = await createServerClient();
  const threshold = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date();

  const { data } = await supabase
    .from('ai_tools')
    .select('id, name, provider, last_assessed_at')
    .eq('org_id', orgId)
    .neq('status', 'deprecated')
    .or(`last_assessed_at.is.null,last_assessed_at.lt.${threshold}`)
    .order('last_assessed_at', { ascending: true, nullsFirst: true })
    .limit(10);

  return (data ?? []).map((t) => {
    const lastDate = t.last_assessed_at ? new Date(t.last_assessed_at) : null;
    const daysSince = lastDate
      ? Math.ceil((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    return {
      id: t.id,
      name: t.name,
      provider: t.provider,
      lastAssessedAt: t.last_assessed_at,
      daysSinceAssessment: daysSince,
    };
  });
}

/**
 * Fetches upcoming regulatory deadlines from the regulations table,
 * with fallback milestones for known EU regulations.
 */
export async function getUpcomingDeadlines(): Promise<DeadlineItem[]> {
  const supabase = await createServerClient();
  const now = new Date();

  // Fetch real deadlines from regulations table
  const { data: regulations } = await supabase
    .from('regulations')
    .select('id, code, name, effective_date')
    .order('effective_date', { ascending: true });

  // Known upcoming milestones (supplementary to DB effective_date)
  const milestones = [
    {
      id: 'eu-ai-act-2026-high-risk',
      title: 'EU AI Act — Obligations systemes a haut risque',
      regulation: 'EU AI Act',
      date: '2026-08-02',
    },
    {
      id: 'eu-ai-act-2027-general',
      title: 'EU AI Act — Obligations pour tous les systemes IA',
      regulation: 'EU AI Act',
      date: '2027-08-02',
    },
  ];

  // Add regulation effective dates from DB
  const dbDeadlines = (regulations ?? []).map((r) => ({
    id: `reg-${r.code}`,
    title: `${r.name} — Date d'application`,
    regulation: r.name,
    date: r.effective_date ?? '',
  }));

  const allDeadlines = [...dbDeadlines, ...milestones].filter((d) => d.date);

  return allDeadlines
    .map((d) => {
      const target = new Date(d.date);
      const daysUntil = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      let severity: 'info' | 'warning' | 'critical' = 'info';
      if (daysUntil <= 0) severity = 'critical';
      else if (daysUntil <= 30) severity = 'warning';
      return { ...d, daysUntil, severity };
    })
    .filter((d) => d.daysUntil > -30)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}
