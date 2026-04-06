/**
 * Stripe plan configuration — single source of truth for all pricing & limits.
 * Stripe Price IDs should be set via environment variables in production.
 */

export type PlanId = 'free' | 'starter' | 'growth' | 'enterprise';
export type BillingInterval = 'monthly' | 'yearly';

export interface PlanLimits {
  tools: number;
  documentsPerMonth: number;
  teamMembers: number;
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  priceMonthly: number; // in cents (EUR)
  priceYearly: number; // in cents (EUR) — full year price
  stripePriceMonthly: string;
  stripePriceYearly: string;
  limits: PlanLimits;
  features: string[];
  recommended?: boolean;
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceMonthly: '',
    stripePriceYearly: '',
    limits: { tools: 2, documentsPerMonth: 1, teamMembers: 1 },
    features: ['2 outils IA', '1 document/mois', '1 utilisateur', 'Dashboard de base'],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 19900, // 199 EUR
    priceYearly: 191000, // ~159 EUR/mois, -20%
    stripePriceMonthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? 'price_starter_monthly',
    stripePriceYearly: process.env.STRIPE_PRICE_STARTER_YEARLY ?? 'price_starter_yearly',
    limits: { tools: 5, documentsPerMonth: 5, teamMembers: 2 },
    features: [
      '5 outils IA',
      '5 documents/mois',
      "2 membres d'equipe",
      'Scanner IA complet',
      'Alertes email',
    ],
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    priceMonthly: 49900, // 499 EUR
    priceYearly: 479000, // ~399 EUR/mois, -20%
    stripePriceMonthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY ?? 'price_growth_monthly',
    stripePriceYearly: process.env.STRIPE_PRICE_GROWTH_YEARLY ?? 'price_growth_yearly',
    limits: { tools: 20, documentsPerMonth: 50, teamMembers: 10 },
    recommended: true,
    features: [
      '20 outils IA',
      '50 documents/mois',
      "10 membres d'equipe",
      'Toutes les reglementations',
      'Rapports auditeurs',
      'Support prioritaire',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 149900, // 1499 EUR
    priceYearly: 1439000, // ~1199 EUR/mois, -20%
    stripePriceMonthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY ?? 'price_enterprise_monthly',
    stripePriceYearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY ?? 'price_enterprise_yearly',
    limits: { tools: Infinity, documentsPerMonth: Infinity, teamMembers: Infinity },
    features: [
      'Outils IA illimites',
      'Documents illimites',
      'Membres illimites',
      'API access',
      'SSO & SAML',
      'Account manager dedie',
      'SLA garanti',
    ],
  },
};

/** Ordered list of plan IDs for comparison. */
export const PLAN_ORDER: PlanId[] = ['free', 'starter', 'growth', 'enterprise'];

/** Check if planA is higher than planB. */
export function isHigherPlan(planA: PlanId, planB: PlanId): boolean {
  return PLAN_ORDER.indexOf(planA) > PLAN_ORDER.indexOf(planB);
}

/** Format cents to EUR display string. */
export function formatPrice(cents: number): string {
  if (cents === 0) return 'Gratuit';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
