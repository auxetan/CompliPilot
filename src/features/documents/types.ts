/** Document type enum values matching Supabase document_type. */
export const DOCUMENT_TYPES = [
  'impact_assessment',
  'transparency_notice',
  'technical_doc',
  'risk_register',
  'bias_audit',
  'data_processing_record',
  'conformity_declaration',
  'custom',
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

/** Human-readable labels for document types. */
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  impact_assessment: "Evaluation d'impact (AIPD)",
  transparency_notice: 'Notice de transparence',
  technical_doc: 'Documentation technique',
  risk_register: 'Registre des traitements',
  bias_audit: 'Audit de biais',
  data_processing_record: 'Registre des traitements de donnees',
  conformity_declaration: 'Declaration de conformite',
  custom: 'Document personnalise',
};

/** Short descriptions for document types (used in selection cards). */
export const DOCUMENT_TYPE_DESCRIPTIONS: Record<DocumentType, string> = {
  impact_assessment:
    'Requis pour les systemes IA a haut risque. Evalue les impacts sur les droits fondamentaux.',
  transparency_notice: "Information des utilisateurs sur l'usage d'IA dans vos systemes.",
  technical_doc:
    'Documentation technique detaillee du systeme IA selon les exigences reglementaires.',
  risk_register: 'Registre RGPD complet des traitements de donnees lies a vos outils IA.',
  bias_audit: "Rapport d'audit de biais algorithmique et mesures de mitigation.",
  data_processing_record:
    'Registre detaille conforme au RGPD pour les traitements de donnees par IA.',
  conformity_declaration: 'Declaration CE de conformite pour les systemes IA selon le AI Act.',
  custom: 'Document de conformite sur mesure selon vos besoins specifiques.',
};

/** Document status enum. */
export const DOCUMENT_STATUSES = ['draft', 'review', 'approved', 'expired', 'archived'] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  draft: 'Brouillon',
  review: 'En revision',
  approved: 'Approuve',
  expired: 'Expire',
  archived: 'Archive',
};

/** Document regulation enum. */
export const DOCUMENT_REGULATIONS = ['eu_ai_act', 'gdpr', 'nis2', 'dora', 'multi'] as const;

export type DocumentRegulation = (typeof DOCUMENT_REGULATIONS)[number];

/** Language options for generation. */
export const DOCUMENT_LANGUAGES = ['fr', 'en'] as const;
export type DocumentLanguage = (typeof DOCUMENT_LANGUAGES)[number];

export const DOCUMENT_LANGUAGE_LABELS: Record<DocumentLanguage, string> = {
  fr: 'Francais',
  en: 'English',
};

/** Row shape for the documents list (camelCase mapped from Supabase). */
export interface ComplianceDocumentRow {
  id: string;
  orgId: string;
  aiToolId: string | null;
  aiToolName: string | null;
  title: string;
  type: DocumentType;
  regulation: DocumentRegulation;
  contentMarkdown: string | null;
  content: Record<string, unknown>;
  status: DocumentStatus;
  version: number;
  generatedBy: 'ai' | 'manual';
  approvedBy: string | null;
  approvedAt: string | null;
  expiresAt: string | null;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Input for generating a new document. */
export interface GenerateDocumentInput {
  type: DocumentType;
  regulation: DocumentRegulation;
  aiToolId: string | null;
  language: DocumentLanguage;
  additionalContext: string;
}

/** Params for the list page filters. */
export interface DocumentFilters {
  type?: DocumentType;
  regulation?: DocumentRegulation;
  status?: DocumentStatus;
  aiToolId?: string;
  page?: number;
}
