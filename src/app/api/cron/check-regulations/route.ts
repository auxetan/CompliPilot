import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/admin';
import { createAlert } from '@/features/monitoring/services/alert-service';
import { sendAlertEmail } from '@/features/monitoring/services/send-alert-email';

export const runtime = 'nodejs';

/**
 * Daily cron job to check regulatory compliance and create alerts.
 * Secured by CRON_SECRET header check.
 *
 * Checks:
 * 1. Documents expiring within 7 days
 * 2. Tools not assessed in 90+ days
 * 3. Approaching regulatory deadlines
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createServiceRoleClient();
  const now = new Date();
  let alertsCreated = 0;

  try {
    // Fetch all orgs
    const { data: orgs } = await admin.from('organizations').select('id');

    if (!orgs || orgs.length === 0) {
      return NextResponse.json({ message: 'No organizations found', alertsCreated: 0 });
    }

    for (const org of orgs) {
      const orgId = org.id;

      // --- 1. Expiring documents (within 7 days) ---
      const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: expiringDocs } = await admin
        .from('compliance_documents')
        .select('id, title, expires_at')
        .eq('org_id', orgId)
        .eq('status', 'approved')
        .not('expires_at', 'is', null)
        .lte('expires_at', in7Days)
        .gte('expires_at', now.toISOString());

      for (const doc of expiringDocs ?? []) {
        const daysUntil = Math.ceil(
          (new Date(doc.expires_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
        const severity = daysUntil <= 3 ? 'critical' : 'warning';
        const alertId = await createAlert({
          orgId,
          type: 'document_expired',
          title: `Document expire dans ${daysUntil}j : ${doc.title}`,
          message: `Le document "${doc.title}" expire le ${doc.expires_at.slice(0, 10)}. Pensez a le renouveler.`,
          severity: severity as 'critical' | 'warning',
          actionUrl: `/documents/${doc.id}`,
          metadata: { documentId: doc.id, daysUntil },
        });

        if (alertId && severity === 'critical') {
          await sendAlertEmail({
            orgId,
            title: `Document expire dans ${daysUntil}j : ${doc.title}`,
            message: `Le document "${doc.title}" expire le ${doc.expires_at.slice(0, 10)}.`,
            severity: 'critical',
            actionUrl: `/documents/${doc.id}`,
          });
        }

        if (alertId) alertsCreated++;
      }

      // --- 2. Stale tools (not assessed in 90+ days) ---
      const threshold90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      const { data: staleTools } = await admin
        .from('ai_tools')
        .select('id, name, last_assessed_at')
        .eq('org_id', orgId)
        .neq('status', 'deprecated')
        .or(`last_assessed_at.is.null,last_assessed_at.lt.${threshold90}`);

      for (const tool of staleTools ?? []) {
        const daysSince = tool.last_assessed_at
          ? Math.ceil(
              (now.getTime() - new Date(tool.last_assessed_at).getTime()) / (1000 * 60 * 60 * 24),
            )
          : 999;

        const alertId = await createAlert({
          orgId,
          type: 'tool_risk_changed',
          title: `Outil a re-evaluer : ${tool.name}`,
          message: `L'outil "${tool.name}" n'a pas ete evalue depuis ${daysSince > 365 ? "plus d'un an" : `${daysSince} jours`}. Une re-evaluation est recommandee.`,
          severity: daysSince > 180 ? 'warning' : 'info',
          actionUrl: `/scanner/${tool.id}`,
          metadata: { toolId: tool.id, daysSince },
        });

        if (alertId) alertsCreated++;
      }

      // --- 3. Approaching regulatory deadlines ---
      const knownDeadlines = [
        {
          id: 'eu-ai-act-2026',
          title: 'EU AI Act — Obligations systemes a haut risque',
          regulation: 'EU AI Act',
          date: '2026-08-02',
        },
      ];

      for (const deadline of knownDeadlines) {
        const target = new Date(deadline.date);
        const daysUntil = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Alert at 90, 30, 7 day milestones
        const milestones = [90, 30, 7];
        for (const milestone of milestones) {
          if (daysUntil <= milestone && daysUntil > milestone - 1) {
            const severity = milestone <= 7 ? 'critical' : milestone <= 30 ? 'warning' : 'info';
            const alertId = await createAlert({
              orgId,
              type: 'deadline_approaching',
              title: `${deadline.regulation} : ${daysUntil}j restants`,
              message: `${deadline.title} — echeance le ${deadline.date}.`,
              severity: severity as 'info' | 'warning' | 'critical',
              actionUrl: '/monitoring',
              metadata: { deadlineId: deadline.id, daysUntil },
            });

            if (alertId && severity === 'critical') {
              await sendAlertEmail({
                orgId,
                title: `${deadline.regulation} : ${daysUntil}j restants`,
                message: `${deadline.title} — echeance le ${deadline.date}.`,
                severity: 'critical',
                actionUrl: '/monitoring',
              });
            }

            if (alertId) alertsCreated++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      alertsCreated,
      checkedOrgs: orgs.length,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('[cron/check-regulations] Error:', error);
    return NextResponse.json({ error: 'Internal error during cron check' }, { status: 500 });
  }
}
