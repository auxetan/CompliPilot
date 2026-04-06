import { createServerClient } from '@/lib/supabase/server';
import type { AlertType, AlertSeverity } from '../types';

interface CreateAlertParams {
  orgId: string;
  type: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Creates an alert for an organization, with dedup check.
 * Returns the alert ID or null if a duplicate exists.
 */
export async function createAlert(params: CreateAlertParams): Promise<string | null> {
  const supabase = await createServerClient();

  // Dedup: check if same type + title exists unread in last 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: existing } = await supabase
    .from('alerts')
    .select('id')
    .eq('org_id', params.orgId)
    .eq('type', params.type)
    .eq('title', params.title)
    .eq('is_read', false)
    .gte('created_at', since)
    .limit(1);

  if (existing && existing.length > 0) return null;

  const { data, error } = await supabase
    .from('alerts')
    .insert({
      org_id: params.orgId,
      type: params.type,
      title: params.title,
      message: params.message,
      severity: params.severity,
      action_url: params.actionUrl ?? null,
      metadata: params.metadata ?? {},
    })
    .select('id')
    .single();

  if (error || !data) return null;
  return data.id;
}

/**
 * Fetches unread alert count for the topbar badge.
 */
export async function getUnreadAlertCount(orgId: string): Promise<number> {
  const supabase = await createServerClient();
  const { count } = await supabase
    .from('alerts')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('is_read', false);
  return count ?? 0;
}

/**
 * Fetches recent alerts (for the popover and monitoring page).
 */
export async function getRecentAlerts(
  orgId: string,
  limit = 20,
): Promise<
  {
    id: string;
    type: AlertType;
    title: string;
    message: string;
    severity: AlertSeverity;
    isRead: boolean;
    actionUrl: string | null;
    createdAt: string;
  }[]
> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('alerts')
    .select('id, type, title, message, severity, is_read, action_url, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data ?? []).map((a) => ({
    id: a.id,
    type: a.type as AlertType,
    title: a.title,
    message: a.message,
    severity: a.severity as AlertSeverity,
    isRead: a.is_read,
    actionUrl: a.action_url,
    createdAt: a.created_at,
  }));
}
