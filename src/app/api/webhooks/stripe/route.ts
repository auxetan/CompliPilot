import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createServiceRoleClient } from '@/lib/supabase/admin';
import { createAlert } from '@/features/monitoring/services/alert-service';
import type Stripe from 'stripe';
import type { PlanId } from '@/lib/stripe/config';

/**
 * Stripe webhook handler.
 * Verifies the signature and processes subscription lifecycle events.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const admin = createServiceRoleClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.org_id;
        const planId = session.metadata?.plan_id as PlanId | undefined;

        if (orgId && planId && session.subscription) {
          const subscriptionId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id;

          // Fetch subscription to get period_end
          let periodEnd: string | null = null;
          try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            if (sub.items.data[0]?.current_period_end) {
              periodEnd = new Date(sub.items.data[0].current_period_end * 1000).toISOString();
            }
          } catch {
            // Non-blocking — period_end will be set on next subscription.updated event
          }

          await admin
            .from('organizations')
            .update({
              plan: planId,
              stripe_subscription_id: subscriptionId,
              ...(periodEnd ? { plan_period_end: periodEnd } : {}),
            })
            .eq('id', orgId);

          // Audit log
          await admin.from('audit_logs').insert({
            org_id: orgId,
            action: 'subscription_created',
            details: { plan: planId, session_id: session.id },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const orgId = subscription.metadata?.org_id;

        if (orgId) {
          const planId = (subscription.metadata?.plan_id as PlanId) ?? 'free';
          const periodEnd = subscription.items.data[0]?.current_period_end;

          await admin
            .from('organizations')
            .update({
              plan: planId,
              plan_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
            })
            .eq('id', orgId);

          await admin.from('audit_logs').insert({
            org_id: orgId,
            action: 'subscription_updated',
            details: { plan: planId, status: subscription.status },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const orgId = subscription.metadata?.org_id;

        if (orgId) {
          await admin
            .from('organizations')
            .update({
              plan: 'free',
              stripe_subscription_id: null,
              plan_period_end: null,
            })
            .eq('id', orgId);

          await createAlert({
            orgId,
            type: 'score_dropped',
            title: 'Abonnement annule',
            message:
              'Votre abonnement a ete annule. Vous etes repasse sur le plan Free avec des limites reduites.',
            severity: 'warning',
            actionUrl: '/settings/billing',
          });

          await admin.from('audit_logs').insert({
            org_id: orgId,
            action: 'subscription_canceled',
            details: { subscription_id: subscription.id },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

        if (customerId) {
          const { data: org } = await admin
            .from('organizations')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (org) {
            await createAlert({
              orgId: org.id,
              type: 'score_dropped',
              title: 'Echec de paiement',
              message:
                'Le paiement de votre abonnement a echoue. Veuillez mettre a jour vos informations de paiement.',
              severity: 'critical',
              actionUrl: '/settings/billing',
            });

            await admin.from('audit_logs').insert({
              org_id: org.id,
              action: 'payment_failed',
              details: { invoice_id: invoice.id },
            });
          }
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

        if (customerId) {
          const { data: org } = await admin
            .from('organizations')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (org && invoice.lines?.data?.[0]?.period?.end) {
            await admin
              .from('organizations')
              .update({
                plan_period_end: new Date(invoice.lines.data[0].period.end * 1000).toISOString(),
              })
              .eq('id', org.id);
          }
        }
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[stripe-webhook] Processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
