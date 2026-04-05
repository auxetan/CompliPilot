/** Application name */
export const APP_NAME = 'CompliPilot';

/** Application tagline */
export const APP_TAGLINE = 'AI-Powered Compliance on Autopilot';

/** Supported regulations */
export const REGULATIONS = ['eu_ai_act', 'gdpr', 'nis2', 'dora'] as const;

/** Regulation display labels */
export const REGULATION_LABELS: Record<(typeof REGULATIONS)[number], string> = {
  eu_ai_act: 'EU AI Act',
  gdpr: 'RGPD',
  nis2: 'NIS2',
  dora: 'DORA',
};

/** Risk levels as defined by EU AI Act */
export const RISK_LEVELS = ['unacceptable', 'high', 'limited', 'minimal', 'not_assessed'] as const;

/** Risk level display labels */
export const RISK_LEVEL_LABELS: Record<(typeof RISK_LEVELS)[number], string> = {
  unacceptable: 'Inacceptable',
  high: 'Haut',
  limited: 'Limite',
  minimal: 'Minimal',
  not_assessed: 'Non evalue',
};

/** Subscription plans */
export const PLANS = ['free', 'starter', 'growth', 'enterprise'] as const;

/** Plan pricing in EUR/month */
export const PLAN_PRICING: Record<(typeof PLANS)[number], number> = {
  free: 0,
  starter: 199,
  growth: 499,
  enterprise: 1499,
};

/** Compliance score thresholds */
export const SCORE_THRESHOLDS = {
  NON_COMPLIANT: 39,
  IN_PROGRESS: 69,
  ALMOST_COMPLIANT: 89,
  COMPLIANT: 100,
} as const;
