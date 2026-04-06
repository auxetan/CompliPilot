import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
} from 'drizzle-orm/pg-core';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const userRoleEnum = pgEnum('user_role', ['owner', 'admin', 'member', 'viewer']);

export const orgPlanEnum = pgEnum('org_plan', ['free', 'starter', 'growth', 'enterprise']);

export const aiToolCategoryEnum = pgEnum('ai_tool_category', [
  'chatbot',
  'recruitment',
  'scoring',
  'content',
  'analytics',
  'automation',
  'other',
]);

export const riskLevelEnum = pgEnum('risk_level', [
  'unacceptable',
  'high',
  'limited',
  'minimal',
  'not_assessed',
]);

export const toolStatusEnum = pgEnum('tool_status', [
  'active',
  'under_review',
  'deprecated',
  'blocked',
]);

export const regulationCodeEnum = pgEnum('regulation_code', ['eu_ai_act', 'gdpr', 'nis2', 'dora']);

export const assessmentSourceEnum = pgEnum('assessment_source', ['ai', 'manual', 'auditor']);

export const documentTypeEnum = pgEnum('document_type', [
  'impact_assessment',
  'transparency_notice',
  'technical_doc',
  'risk_register',
  'bias_audit',
  'data_processing_record',
  'conformity_declaration',
  'custom',
]);

export const documentRegulationEnum = pgEnum('document_regulation', [
  'eu_ai_act',
  'gdpr',
  'nis2',
  'dora',
  'multi',
]);

export const documentStatusEnum = pgEnum('document_status', [
  'draft',
  'review',
  'approved',
  'expired',
  'archived',
]);

export const documentSourceEnum = pgEnum('document_source', ['ai', 'manual']);

export const checkStatusEnum = pgEnum('check_status', [
  'compliant',
  'non_compliant',
  'partial',
  'not_applicable',
  'not_checked',
]);

export const alertTypeEnum = pgEnum('alert_type', [
  'regulation_update',
  'deadline_approaching',
  'score_dropped',
  'document_expired',
  'new_requirement',
  'tool_risk_changed',
]);

export const alertSeverityEnum = pgEnum('alert_severity', ['info', 'warning', 'critical']);

export const invitationStatusEnum = pgEnum('invitation_status', ['pending', 'accepted', 'expired']);

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

/** Organisation (tenant) — every resource belongs to one org. */
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  logoUrl: text('logo_url'),
  industry: text('industry'),
  country: text('country').default('FR'),
  employeeCount: integer('employee_count'),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id'),
  plan: orgPlanEnum('plan').default('free'),
  planPeriodEnd: timestamp('plan_period_end', {
    withTimezone: true,
    mode: 'string',
  }),
  complianceScore: integer('compliance_score').default(0),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
});

/** User profile — linked to Supabase Auth; one profile per user. */
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').default('member'),
  orgId: uuid('org_id').references(() => organizations.id),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
});

/** AI tool registered by an organisation for compliance tracking. */
export const aiTools = pgTable('ai_tools', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  provider: text('provider'),
  category: aiToolCategoryEnum('category').default('other'),
  description: text('description'),
  url: text('url'),
  usageContext: text('usage_context'),
  dataTypesProcessed: text('data_types_processed').array().default([]),
  userCount: integer('user_count'),
  isCustomerFacing: boolean('is_customer_facing').default(false),
  automatedDecisions: boolean('automated_decisions').default(false),
  riskLevel: riskLevelEnum('risk_level').default('not_assessed'),
  riskScore: integer('risk_score'),
  lastAssessedAt: timestamp('last_assessed_at', {
    withTimezone: true,
    mode: 'string',
  }),
  status: toolStatusEnum('status').default('active'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
});

/** Risk assessment produced for a given AI tool against a regulation. */
export const riskAssessments = pgTable('risk_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  aiToolId: uuid('ai_tool_id')
    .notNull()
    .references(() => aiTools.id, { onDelete: 'cascade' }),
  regulationCode: regulationCodeEnum('regulation_code').notNull(),
  riskLevel: riskLevelEnum('risk_level').notNull(),
  riskScore: integer('risk_score'),
  findings: jsonb('findings').default({}),
  recommendations: jsonb('recommendations').default({}),
  assessedBy: assessmentSourceEnum('assessed_by').default('ai'),
  assessedAt: timestamp('assessed_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
});

/** Compliance document (generated or uploaded) tied to an org and optionally an AI tool. */
export const complianceDocuments = pgTable('compliance_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  aiToolId: uuid('ai_tool_id').references(() => aiTools.id, {
    onDelete: 'set null',
  }),
  title: text('title').notNull(),
  type: documentTypeEnum('type').notNull(),
  regulation: documentRegulationEnum('regulation').notNull(),
  content: jsonb('content').default({}),
  contentMarkdown: text('content_markdown'),
  status: documentStatusEnum('status').default('draft'),
  version: integer('version').default(1),
  generatedBy: documentSourceEnum('generated_by').default('ai'),
  approvedBy: uuid('approved_by').references(() => profiles.id, {
    onDelete: 'set null',
  }),
  approvedAt: timestamp('approved_at', {
    withTimezone: true,
    mode: 'string',
  }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
});

/** Reference regulation (EU AI Act, GDPR, NIS2, DORA, etc.). */
export const regulations = pgTable('regulations', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').unique().notNull(),
  name: text('name').notNull(),
  fullName: text('full_name'),
  jurisdiction: text('jurisdiction'),
  description: text('description'),
  effectiveDate: date('effective_date', { mode: 'string' }),
  lastUpdated: date('last_updated', { mode: 'string' }),
  requirements: jsonb('requirements').default([]),
  penalties: jsonb('penalties').default({}),
  sourceUrl: text('source_url'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
});

/** Individual compliance check for a specific requirement on a regulation. */
export const complianceChecks = pgTable('compliance_checks', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  regulationId: uuid('regulation_id')
    .notNull()
    .references(() => regulations.id, { onDelete: 'cascade' }),
  aiToolId: uuid('ai_tool_id').references(() => aiTools.id, {
    onDelete: 'set null',
  }),
  requirementKey: text('requirement_key').notNull(),
  requirementLabel: text('requirement_label').notNull(),
  status: checkStatusEnum('status').default('not_checked'),
  evidence: text('evidence'),
  notes: text('notes'),
  checkedAt: timestamp('checked_at', { withTimezone: true, mode: 'string' }),
  checkedBy: uuid('checked_by').references(() => profiles.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
});

/** Alert notification sent to an organisation. */
export const alerts = pgTable('alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  type: alertTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  severity: alertSeverityEnum('severity').default('info'),
  isRead: boolean('is_read').default(false),
  actionUrl: text('action_url'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
});

/** Immutable audit log for every significant action within an org. */
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => profiles.id, {
    onDelete: 'set null',
  }),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: uuid('entity_id'),
  details: jsonb('details').default({}),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
});

/** Pending invitation to join an organisation. */
export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: userRoleEnum('role').default('member'),
  invitedBy: uuid('invited_by')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  status: invitationStatusEnum('status').default('pending'),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).$defaultFn(() =>
    new Date().toISOString(),
  ),
});
