import Stripe from 'stripe';

/**
 * Server-side Stripe client singleton.
 * Only import this in server-side code (Server Actions, Route Handlers).
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
  typescript: true,
});
