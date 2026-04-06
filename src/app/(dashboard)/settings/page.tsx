import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { createServerClient, getOrgId, getUser } from '@/lib/supabase/server';
import { OrgSettingsForm } from '@/features/settings/components/org-settings-form';
import { RegulationsForm } from '@/features/settings/components/regulations-form';
import { NotificationPrefsForm } from '@/features/settings/components/notification-prefs-form';
import { DeleteOrgDialog } from '@/features/settings/components/delete-org-dialog';
import { AuditLogTable } from '@/features/settings/components/audit-log-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings — CompliPilot',
  description: "Parametres de l'organisation",
};

export default async function SettingsPage() {
  const orgId = await getOrgId();
  const user = await getUser();
  if (!orgId || !user) redirect('/onboarding');

  const supabase = await createServerClient();

  const { data: org } = await supabase
    .from('organizations')
    .select('name, industry, country, metadata')
    .eq('id', orgId)
    .single();

  if (!org) redirect('/onboarding');

  const metadata = (org.metadata ?? {}) as Record<string, unknown>;
  const regulations = (metadata.regulations as string[]) ?? [];
  const notifications = (metadata.notifications as Record<string, boolean>) ?? {};

  // Check user role for danger zone
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isOwner = profile?.role === 'owner';

  // Fetch audit logs
  const { data: rawLogs } = await supabase
    .from('audit_logs')
    .select('id, user_id, action, entity_type, details, ip_address, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch user names for logs
  const userIds = [...new Set((rawLogs ?? []).map((l) => l.user_id).filter(Boolean))];
  const { data: users } =
    userIds.length > 0
      ? await supabase.from('profiles').select('id, full_name').in('id', userIds)
      : { data: [] };

  const userMap = new Map((users ?? []).map((u) => [u.id, u.full_name]));

  const auditEntries = (rawLogs ?? []).map((l) => ({
    id: l.id,
    userId: l.user_id,
    userName: l.user_id ? (userMap.get(l.user_id) ?? null) : null,
    action: l.action,
    entityType: l.entity_type,
    details: (l.details ?? {}) as Record<string, unknown>,
    ipAddress: l.ip_address,
    createdAt: l.created_at,
  }));

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Parametres generaux de votre organisation" />

      <OrgSettingsForm org={{ name: org.name, industry: org.industry, country: org.country }} />

      <RegulationsForm activeRegulations={regulations} />

      <NotificationPrefsForm
        prefs={{
          emailCritical: notifications.emailCritical ?? true,
          weeklyDigest: notifications.weeklyDigest ?? false,
          documentReminders: notifications.documentReminders ?? true,
        }}
      />

      <AuditLogTable entries={auditEntries} />

      {isOwner && <DeleteOrgDialog orgName={org.name} />}
    </div>
  );
}
