import type { PlanId, BillingInterval } from '@/lib/stripe/config';

/** Stripe invoice summary for display. */
export interface InvoiceSummary {
  id: string;
  number: string | null;
  amountPaid: number;
  currency: string;
  status: string | null;
  created: number;
  invoiceUrl: string | null;
  pdfUrl: string | null;
}

/** Subscription details for the billing page. */
export interface SubscriptionDetails {
  plan: PlanId;
  interval: BillingInterval;
  status: string;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
}
