import { z } from 'zod';

// ── Tool categories & risk levels ──────────────────────────────────

export const TOOL_CATEGORIES = [
  'chatbot',
  'recruitment',
  'scoring',
  'content',
  'analytics',
  'automation',
  'other',
] as const;

export const TOOL_CATEGORY_LABELS: Record<(typeof TOOL_CATEGORIES)[number], string> = {
  chatbot: 'Chatbot / Assistant',
  recruitment: 'Recrutement',
  scoring: 'Scoring / Notation',
  content: 'Génération de contenu',
  analytics: 'Analytics / BI',
  automation: 'Automatisation',
  other: 'Autre',
};

export const RISK_LEVELS = ['unacceptable', 'high', 'limited', 'minimal', 'not_assessed'] as const;

export const RISK_LEVEL_LABELS: Record<(typeof RISK_LEVELS)[number], string> = {
  unacceptable: 'Inacceptable',
  high: 'Haut risque',
  limited: 'Risque limité',
  minimal: 'Risque minimal',
  not_assessed: 'Non évalué',
};

export const TOOL_STATUSES = ['active', 'under_review', 'deprecated', 'blocked'] as const;

export const TOOL_STATUS_LABELS: Record<(typeof TOOL_STATUSES)[number], string> = {
  active: 'Actif',
  under_review: 'En révision',
  deprecated: 'Déprécié',
  blocked: 'Bloqué',
};

export const DATA_TYPES = ['personal_data', 'financial', 'health', 'public', 'internal'] as const;

export const DATA_TYPE_LABELS: Record<(typeof DATA_TYPES)[number], string> = {
  personal_data: 'Données personnelles',
  financial: 'Données financières',
  health: 'Données de santé',
  public: 'Données publiques',
  internal: 'Données internes',
};

export const PROVIDER_SUGGESTIONS = [
  'OpenAI',
  'Google',
  'Microsoft',
  'Meta',
  'Anthropic',
  'Mistral AI',
  'Custom / Interne',
];

export const REGULATIONS = ['eu_ai_act', 'gdpr', 'nis2', 'dora'] as const;

export const REGULATION_LABELS: Record<(typeof REGULATIONS)[number], string> = {
  eu_ai_act: 'EU AI Act',
  gdpr: 'RGPD',
  nis2: 'NIS2',
  dora: 'DORA',
};

// ── Zod Schemas ────────────────────────────────────────────────────

export const createToolStep1Schema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, '100 caractères maximum'),
  provider: z.string().min(1, 'Le fournisseur est requis'),
  category: z.enum(TOOL_CATEGORIES, {
    message: 'La catégorie est requise',
  }),
  description: z.string().max(500, '500 caractères maximum').optional(),
  url: z.string().url('URL invalide').optional().or(z.literal('')),
});

export const createToolStep2Schema = z.object({
  usageContext: z
    .string()
    .min(10, "Décrivez l'utilisation en au moins 10 caractères")
    .max(2000, '2000 caractères maximum'),
  dataTypesProcessed: z
    .array(z.enum(DATA_TYPES))
    .min(1, 'Sélectionnez au moins un type de données'),
  userCount: z.coerce
    .number()
    .int()
    .min(1, 'Au moins 1 utilisateur')
    .max(100000, '100 000 maximum'),
  isCustomerFacing: z.boolean().default(false),
  automatedDecisions: z.boolean().default(false),
});

export const createToolSchema = createToolStep1Schema.merge(createToolStep2Schema);

export const updateToolSchema = createToolSchema.partial();

export type CreateToolStep1Input = z.infer<typeof createToolStep1Schema>;
export type CreateToolStep2Input = z.infer<typeof createToolStep2Schema>;
export type CreateToolInput = z.infer<typeof createToolSchema>;
export type UpdateToolInput = z.infer<typeof updateToolSchema>;

// ── AI Assessment Output Schema ────────────────────────────────────

export const assessmentFindingSchema = z.object({
  regulation: z.enum(REGULATIONS),
  finding: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  details: z.string(),
});

export const assessmentRecommendationSchema = z.object({
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  action: z.string(),
  regulation: z.enum(REGULATIONS),
  deadlineSuggested: z.string().optional(),
});

export const assessmentOutputSchema = z.object({
  riskLevel: z.enum(['unacceptable', 'high', 'limited', 'minimal']),
  riskScore: z.number().min(0).max(100),
  findings: z.array(assessmentFindingSchema),
  recommendations: z.array(assessmentRecommendationSchema),
  applicableRegulations: z.array(z.enum(REGULATIONS)),
});

export type AssessmentFinding = z.infer<typeof assessmentFindingSchema>;
export type AssessmentRecommendation = z.infer<typeof assessmentRecommendationSchema>;
export type AssessmentOutput = z.infer<typeof assessmentOutputSchema>;
