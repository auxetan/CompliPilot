/** Risk level stat card data. */
export interface RiskLevelStat {
  level: 'unacceptable' | 'high' | 'limited' | 'minimal';
  count: number;
}

/** Data point for the risk matrix. */
export interface RiskMatrixPoint {
  toolId: string;
  toolName: string;
  provider: string | null;
  riskLevel: string;
  riskScore: number;
  /** 0-100 impact probability (derived from data types, customer-facing, etc.) */
  impactProbability: number;
  /** 0-100 severity (derived from risk score + automated decisions) */
  severity: number;
}

/** A risk row for the grouped data table. */
export interface RiskTableRow {
  assessmentId: string;
  toolId: string;
  toolName: string;
  provider: string | null;
  riskLevel: string;
  riskScore: number;
  regulation: string;
  regulationLabel: string;
  topFinding: string | null;
  actionRequired: string | null;
  deadline: string | null;
  assessedAt: string | null;
}

/** A prioritised action item. */
export interface RiskActionItem {
  id: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  action: string;
  regulation: string;
  regulationLabel: string;
  toolId: string;
  toolName: string;
  deadline: string | null;
}

/** Full risk assessment detail (for the detail page). */
export interface RiskAssessmentDetail {
  id: string;
  toolId: string;
  toolName: string;
  toolProvider: string | null;
  toolCategory: string | null;
  regulation: string;
  riskLevel: string;
  riskScore: number;
  findings: Finding[];
  recommendations: Recommendation[];
  assessedBy: string;
  assessedAt: string | null;
  expiresAt: string | null;
}

export interface Finding {
  regulation: string;
  finding: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  details: string;
}

export interface Recommendation {
  priority: 'urgent' | 'high' | 'medium' | 'low';
  action: string;
  regulation: string;
  deadlineSuggested: string | null;
}

/** Related compliance check (for the detail page checklist). */
export interface ComplianceCheckItem {
  id: string;
  requirementKey: string;
  requirementLabel: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable' | 'not_checked';
  evidence: string | null;
  notes: string | null;
  checkedAt: string | null;
}

/** Previous assessment for history tab. */
export interface AssessmentHistoryEntry {
  id: string;
  regulation: string;
  riskLevel: string;
  riskScore: number;
  assessedBy: string;
  assessedAt: string | null;
}
