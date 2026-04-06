/** Alert type enum matching Supabase alert_type. */
export const ALERT_TYPES = [
  'regulation_update',
  'deadline_approaching',
  'score_dropped',
  'document_expired',
  'new_requirement',
  'tool_risk_changed',
] as const;

export type AlertType = (typeof ALERT_TYPES)[number];

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  regulation_update: 'Mise a jour reglementaire',
  deadline_approaching: 'Deadline approchante',
  score_dropped: 'Baisse du score',
  document_expired: 'Document expire',
  new_requirement: 'Nouvelle exigence',
  tool_risk_changed: 'Risque outil modifie',
};

/** Alert severity enum. */
export const ALERT_SEVERITIES = ['info', 'warning', 'critical'] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export const ALERT_SEVERITY_LABELS: Record<AlertSeverity, string> = {
  info: 'Information',
  warning: 'Attention',
  critical: 'Critique',
};

/** Alert row (camelCase mapped from Supabase). */
export interface AlertRow {
  id: string;
  orgId: string;
  type: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  isRead: boolean;
  actionUrl: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

/** Compliance timeline point for charts. */
export interface ComplianceTimelinePoint {
  date: string;
  euAiAct: number;
  gdpr: number;
  nis2: number;
  dora: number;
}

/** Deadline item. */
export interface DeadlineItem {
  id: string;
  title: string;
  regulation: string;
  date: string;
  daysUntil: number;
  severity: AlertSeverity;
}

/** Expiring document. */
export interface ExpiringDocument {
  id: string;
  title: string;
  type: string;
  expiresAt: string;
  daysUntil: number;
}

/** Tool needing re-evaluation. */
export interface StaleToolItem {
  id: string;
  name: string;
  provider: string | null;
  lastAssessedAt: string | null;
  daysSinceAssessment: number;
}

/** Report row for the reports list. */
export interface ReportRow {
  id: string;
  title: string;
  createdAt: string;
  pdfUrl: string | null;
  generatedBy: string | null;
}
