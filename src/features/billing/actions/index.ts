'use server';

import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe/client';
import { PLANS } from '@/lib/stripe/config';
import { createServerClient, getOrgId, getUser } from '@/lib/supabase/server';
import type { PlanId, BillingInterval } from '@/lib/stripe/config';

/**
 * Creates a Stripe Checkout Session for subscribing to a plan.
 * Redirects the user to the checkout page.
 */
export async function createCheckoutSession(planId: PlanId, interval: BillingInterval) {
  const orgId = await getOrgId();
  const user = await getUser();
  if (!orgId || !user) redirect('/login');

  const plan = PLANS[planId];
  if (!plan || planId === 'free') {
    throw new Error('Invalid plan');
  }

  const priceId = interval === 'yearly' ? plan.stripePriceYearly : plan.stripePriceMonthly;

  const supabase = await createServerClient();

  // Get or create Stripe customer
  const { data: org } = await supabase
    .from('organizations')
    .select('stripe_customer_id, name')
    .eq('id', orgId)
    .single();

  let customerId = org?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: org?.name ?? undefined,
      metadata: { org_id: orgId },
    });
    customerId = customer.id;

    await supabase.from('organizations').update({ stripe_customer_id: customerId }).eq('id', orgId);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/settings/billing?success=true`,
    cancel_url: `${appUrl}/settings/billing?canceled=true`,
    metadata: { org_id: orgId, plan_id: planId },
    subscription_data: {
      metadata: { org_id: orgId, plan_id: planId },
    },
    allow_promotion_codes: true,
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  redirect(session.url);
}

/**
 * Creates a Stripe Billing Portal session for managing subscriptions.
 * Redirects the user to the portal.
 */
export async function createBillingPortalSession() {
  const orgId = await getOrgId();
  if (!orgId) redirect('/login');

  const supabase = await createServerClient();

  const { data: org } = await supabase
    .from('organizations')
    .select('stripe_customer_id')
    .eq('id', orgId)
    .single();

  if (!org?.stripe_customer_id) {
    throw new Error('No Stripe customer found. Subscribe to a plan first.');
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const session = await stripe.billingPortal.sessions.create({
    customer: org.stripe_customer_id,
    return_url: `${appUrl}/settings/billing`,
  });

  redirect(session.url);
}
