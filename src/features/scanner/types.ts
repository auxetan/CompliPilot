/** Row returned from the ai_tools Supabase table (camelCase mapped). */
export interface AiToolRow {
  id: string;
  orgId: string;
  name: string;
  provider: string | null;
  category: string | null;
  description: string | null;
  url: string | null;
  usageContext: string | null;
  dataTypesProcessed: string[] | null;
  userCount: number | null;
  isCustomerFacing: boolean | null;
  automatedDecisions: boolean | null;
  riskLevel: string | null;
  riskScore: number | null;
  status: string | null;
  lastAssessedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface RiskAssessmentRow {
  id: string;
  orgId: string;
  aiToolId: string;
  regulation: string;
  riskLevel: string;
  riskScore: number | null;
  findings: unknown;
  recommendations: unknown;
  assessedBy: string | null;
  assessedAt: string | null;
  expiresAt: string | null;
  createdAt: string | null;
}

export interface ComplianceDocumentRow {
  id: string;
  orgId: string;
  aiToolId: string | null;
  title: string;
  type: string;
  regulation: string | null;
  status: string | null;
  version: number;
  content: string | null;
  pdfUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type AiToolWithAssessments = AiToolRow & {
  riskAssessments: RiskAssessmentRow[];
  complianceDocuments: ComplianceDocumentRow[];
};
