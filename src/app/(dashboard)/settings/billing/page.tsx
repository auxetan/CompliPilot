import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { CreditCard, ExternalLink, Receipt } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrgId } from '@/lib/supabase/server';
import { createServerClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { PLANS, formatPrice } from '@/lib/stripe/config';
import { getUsage } from '@/lib/stripe/limits';
import { UsageMeter } from '@/features/billing/components/usage-meter';
import { createBillingPortalSession } from '@/features/billing/actions';
import { BillingPlansWithToggle } from './billing-interval-toggle';
import { formatDate } from '@/lib/utils';
import type { PlanId } from '@/lib/stripe/config';
import type { InvoiceSummary } from '@/features/billing/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facturation — CompliPilot',
  description: 'Gerez votre abonnement et suivez votre consommation',
};

function BillingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
      <div className="grid gap-6 md:grid-cols-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

async function BillingContent() {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');

  const supabase = await createServerClient();
  const { data: org } = await supabase
    .from('organizations')
    .select('plan, stripe_customer_id, stripe_subscription_id, plan_period_end')
    .eq('id', orgId)
    .single();

  const currentPlan = (org?.plan as PlanId) ?? 'free';
  const planConfig = PLANS[currentPlan];
  const usage = await getUsage(orgId);

  // Fetch invoices from Stripe if customer exists
  let invoices: InvoiceSummary[] = [];
  if (org?.stripe_customer_id) {
    try {
      const stripeInvoices = await stripe.invoices.list({
        customer: org.stripe_customer_id,
        limit: 10,
      });
      invoices = stripeInvoices.data.map((inv) => ({
        id: inv.id,
        number: inv.number,
        amountPaid: inv.amount_paid,
        currency: inv.currency,
        status: inv.status,
        created: inv.created,
        invoiceUrl: inv.hosted_invoice_url ?? null,
        pdfUrl: inv.invoice_pdf ?? null,
      }));
    } catch {
      // Stripe may not be configured in dev
    }
  }

  return (
    <>
      {/* Current plan summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Plan actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-2xl font-bold">{planConfig.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentPlan === 'free'
                  ? 'Plan gratuit avec fonctionnalites limitees'
                  : `${formatPrice(planConfig.priceMonthly)}/mois`}
              </p>
              {org?.plan_period_end && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Prochain renouvellement : {formatDate(org.plan_period_end)}
                </p>
              )}
            </div>
            {org?.stripe_customer_id && (
              <form action={createBillingPortalSession}>
                <Button variant="outline" type="submit">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Gerer l&apos;abonnement
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage meters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Consommation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UsageMeter label="Outils IA" current={usage.tools.current} limit={usage.tools.limit} />
          <UsageMeter
            label="Documents ce mois"
            current={usage.documents.current}
            limit={usage.documents.limit}
          />
          <UsageMeter
            label="Membres d'equipe"
            current={usage.teamMembers.current}
            limit={usage.teamMembers.limit}
          />
        </CardContent>
      </Card>

      {/* Plan comparison */}
      <BillingPlansWithToggle currentPlan={currentPlan} />

      {/* Invoice history */}
      {invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="h-4 w-4" aria-hidden="true" />
              Historique des factures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{inv.number ?? inv.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(inv.created * 1000).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatPrice(inv.amountPaid)}</span>
                    {inv.invoiceUrl && (
                      <a
                        href={inv.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Voir
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Facturation"
        description="Gerez votre abonnement, suivez votre consommation et consultez vos factures"
      />

      <Suspense fallback={<BillingSkeleton />}>
        <BillingContent />
      </Suspense>
    </div>
  );
}
