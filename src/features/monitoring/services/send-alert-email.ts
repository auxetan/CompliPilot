import { Resend } from 'resend';
import { createServiceRoleClient } from '@/lib/supabase/admin';
import type { AlertSeverity } from '../types';

const resend = new Resend(process.env.RESEND_API_KEY);

interface AlertEmailParams {
  orgId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  actionUrl?: string;
}

/**
 * Sends an alert email to all owners and admins of the org.
 * Only for "critical" severity. Rate-limited to 5 emails/day/org.
 */
export async function sendAlertEmail(params: AlertEmailParams): Promise<void> {
  if (params.severity !== 'critical') return;

  const admin = createServiceRoleClient();

  // Rate limit: max 5 critical emails per day per org
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from('alerts')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', params.orgId)
    .eq('severity', 'critical')
    .gte('created_at', since);

  if ((count ?? 0) > 5) return;

  // Fetch owners and admins emails
  const { data: members } = await admin
    .from('profiles')
    .select('email, full_name')
    .eq('org_id', params.orgId)
    .in('role', ['owner', 'admin']);

  if (!members || members.length === 0) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://complipilot.io';
  const actionLink = params.actionUrl ? `${appUrl}${params.actionUrl}` : `${appUrl}/monitoring`;

  for (const member of members) {
    try {
      await resend.emails.send({
        from: 'CompliPilot <alerts@complipilot.io>',
        to: member.email,
        subject: `[CompliPilot] Alerte critique : ${params.title}`,
        html: buildAlertEmailHtml({
          recipientName: member.full_name ?? member.email,
          title: params.title,
          message: params.message,
          actionLink,
        }),
      });
    } catch {
      // Silently fail — don't break the alert flow
    }
  }
}

function buildAlertEmailHtml(params: {
  recipientName: string;
  title: string;
  message: string;
  actionLink: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="font-family: Inter, sans-serif; background: #f8fafc; padding: 40px 0;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background: #0f172a; padding: 24px 32px;">
      <h1 style="color: #f8fafc; font-size: 18px; margin: 0;">CompliPilot</h1>
    </div>
    <div style="padding: 32px;">
      <p style="color: #334155; font-size: 14px;">Bonjour ${params.recipientName},</p>
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="font-weight: 600; color: #dc2626; margin: 0 0 8px;">⚠ ${params.title}</p>
        <p style="color: #7f1d1d; margin: 0; font-size: 14px;">${params.message}</p>
      </div>
      <a href="${params.actionLink}"
         style="display: inline-block; background: #3b82f6; color: #fff; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; margin-top: 8px;">
        Voir les details
      </a>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
        Cet email a ete envoye automatiquement par CompliPilot. Vous recevez cette notification car vous etes administrateur de votre organisation.
      </p>
    </div>
  </div>
</body>
</html>`;
}
