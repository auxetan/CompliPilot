import { cn } from '@/lib/utils';
import { DOCUMENT_STATUS_LABELS, type DocumentStatus } from '@/features/documents/types';

const STATUS_STYLES: Record<DocumentStatus, string> = {
  draft: 'bg-muted text-muted-foreground border-border',
  review: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  approved: 'bg-green-500/10 text-green-600 border-green-500/20',
  expired: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  archived: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

/**
 * Badge displaying the document workflow status with color coding.
 */
export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status] ?? STATUS_STYLES.draft,
        className,
      )}
    >
      {DOCUMENT_STATUS_LABELS[status] ?? status}
    </span>
  );
}
