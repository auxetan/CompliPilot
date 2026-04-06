import { cn } from '@/lib/utils';
import { DOCUMENT_TYPE_LABELS, type DocumentType } from '@/features/documents/types';

const TYPE_STYLES: Record<DocumentType, string> = {
  impact_assessment: 'bg-red-500/10 text-red-600 border-red-500/20',
  transparency_notice: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  technical_doc: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  risk_register: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  bias_audit: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  data_processing_record: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  conformity_declaration: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  custom: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

interface DocumentTypeBadgeProps {
  type: DocumentType;
  className?: string;
}

/**
 * Badge displaying the document type with color coding.
 */
export function DocumentTypeBadge({ type, className }: DocumentTypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        TYPE_STYLES[type] ?? TYPE_STYLES.custom,
        className,
      )}
    >
      {DOCUMENT_TYPE_LABELS[type] ?? type}
    </span>
  );
}
