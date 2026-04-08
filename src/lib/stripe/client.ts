import Stripe from 'stripe';

/**
 * Server-side Stripe client singleton.
 * Only import this in server-side code (Server Actions, Route Handlers).
 */
let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required to use Stripe server features.');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-03-31.basil',
      typescript: true,
    });
  }

  return stripeClient;
}
