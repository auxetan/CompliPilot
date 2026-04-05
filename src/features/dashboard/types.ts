export interface DashboardStats {
  totalTools: number;
  highRiskTools: number;
  totalDocuments: number;
  unreadAlerts: number;
  complianceScore: number;
}

export interface RegulationScore {
  code: 'eu_ai_act' | 'gdpr' | 'nis2' | 'dora';
  name: string;
  score: number;
  totalChecks: number;
  completedChecks: number;
}

export interface PriorityAction {
  id: string;
  type: 'generate_doc' | 'assess_tool' | 'deadline' | 'review';
  title: string;
  description: string;
  urgency: 'critical' | 'high' | 'medium';
  href: string;
}

export interface ActivityEntry {
  id: string;
  action: string;
  entityType: string;
  description: string;
  createdAt: string;
}

export interface ComplianceHistoryPoint {
  date: string;
  score: number;
}
