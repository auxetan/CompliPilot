import Link from 'next/link';
import { FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DOCUMENT_TYPE_LABELS } from '@/features/documents/types';
import type { DocumentType } from '@/features/documents/types';
import type { ExpiringDocument } from '../types';

interface ExpiringDocsListProps {
  documents: ExpiringDocument[];
}

/**
 * List of documents expiring within 30 days.
 */
export function ExpiringDocsList({ documents }: ExpiringDocsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <FileText className="h-4 w-4" aria-hidden="true" />
          Documents expirant bientot
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun document en expiration prochaine.</p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <Clock
                  className={cn(
                    'h-4 w-4 shrink-0',
                    doc.daysUntil <= 7 ? 'text-red-500' : 'text-orange-500',
                  )}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {DOCUMENT_TYPE_LABELS[doc.type as DocumentType] ?? doc.type}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                    doc.daysUntil <= 7
                      ? 'bg-red-500/10 text-red-600'
                      : 'bg-orange-500/10 text-orange-600',
                  )}
                >
                  {doc.daysUntil}j
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
