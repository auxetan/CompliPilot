'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, RefreshCw, Copy, CheckCircle, Clock, FileSearch, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentTypeBadge } from './document-type-badge';
import { DocumentStatusBadge } from './document-status-badge';
import { RegulationTag } from '@/components/shared/regulation-tag';
import { formatDate } from '@/lib/utils';
import { updateDocument, duplicateDocument, generatePdf } from '@/features/documents/actions';
import type { ComplianceDocumentRow, DocumentStatus } from '@/features/documents/types';

interface DocumentSidebarProps {
  document: ComplianceDocumentRow;
}

const STATUS_WORKFLOW: { from: DocumentStatus; to: DocumentStatus; label: string }[] = [
  { from: 'draft', to: 'review', label: 'Soumettre en revision' },
  { from: 'review', to: 'approved', label: 'Approuver' },
  { from: 'approved', to: 'archived', label: 'Archiver' },
];

/**
 * Sidebar with document metadata, status workflow, and action buttons.
 */
export function DocumentSidebar({ document: doc }: DocumentSidebarProps) {
  const [isPending, startTransition] = useTransition();

  const nextAction = STATUS_WORKFLOW.find((w) => w.from === doc.status);

  function handleStatusChange(newStatus: DocumentStatus) {
    startTransition(async () => {
      try {
        await updateDocument(doc.id, { status: newStatus });
        toast.success(`Statut mis a jour : ${newStatus}`);
      } catch {
        toast.error('Erreur lors de la mise a jour du statut');
      }
    });
  }

  function handlePdf() {
    startTransition(async () => {
      const result = await generatePdf(doc.id);
      if (result.success && result.url) {
        window.open(result.url, '_blank');
      } else {
        toast.error(result.error ?? 'Erreur PDF');
      }
    });
  }

  function handleDuplicate() {
    startTransition(async () => {
      try {
        await duplicateDocument(doc.id);
      } catch {
        toast.error('Erreur lors de la duplication');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Informations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metadata */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type</span>
            <DocumentTypeBadge type={doc.type} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Reglementation</span>
            {doc.regulation !== 'multi' ? (
              <RegulationTag
                regulation={doc.regulation as 'eu_ai_act' | 'gdpr' | 'nis2' | 'dora'}
              />
            ) : (
              <span className="text-xs">Multi</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Statut</span>
            <DocumentStatusBadge status={doc.status} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span>v{doc.version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cree le</span>
            <span>{formatDate(doc.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Modifie le</span>
            <span>{formatDate(doc.updatedAt)}</span>
          </div>
          {doc.approvedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Approuve le</span>
              <span>{formatDate(doc.approvedAt)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Source</span>
            <span>{doc.generatedBy === 'ai' ? 'IA' : 'Manuel'}</span>
          </div>
        </div>

        <Separator />

        {/* Status workflow */}
        {nextAction && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Workflow</p>
            <Button
              className="w-full"
              size="sm"
              onClick={() => handleStatusChange(nextAction.to)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : nextAction.to === 'approved' ? (
                <CheckCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              ) : nextAction.to === 'review' ? (
                <FileSearch className="mr-2 h-4 w-4" aria-hidden="true" />
              ) : (
                <Clock className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {nextAction.label}
            </Button>
          </div>
        )}

        <Separator />

        {/* Action buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handlePdf}
            disabled={isPending}
          >
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Telecharger PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleDuplicate}
            disabled={isPending}
          >
            <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
            Dupliquer
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              window.location.href = `/documents/new?regenerate=${doc.id}`;
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Regenerer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
