'use client';

import Link from 'next/link';
import { FileText, Download, Copy, Archive, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DocumentTypeBadge } from './document-type-badge';
import { DocumentStatusBadge } from './document-status-badge';
import { RegulationTag } from '@/components/shared/regulation-tag';
import { formatDate } from '@/lib/utils';
import { archiveDocument, duplicateDocument, generatePdf } from '@/features/documents/actions';
import { toast } from 'sonner';
import type { ComplianceDocumentRow } from '@/features/documents/types';

interface DocumentsTableProps {
  documents: ComplianceDocumentRow[];
}

/**
 * Table listing compliance documents with actions.
 */
export function DocumentsTable({ documents }: DocumentsTableProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <FileText className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium">Aucun document</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Generez votre premier document de conformite.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Titre</th>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-left font-medium">Reglementation</th>
            <th className="px-4 py-3 text-left font-medium">Outil IA</th>
            <th className="px-4 py-3 text-left font-medium">Statut</th>
            <th className="px-4 py-3 text-left font-medium">Version</th>
            <th className="px-4 py-3 text-left font-medium">Cree le</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <Link href={`/documents/${doc.id}`} className="font-medium hover:underline">
                  {doc.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <DocumentTypeBadge type={doc.type} />
              </td>
              <td className="px-4 py-3">
                {doc.regulation !== 'multi' ? (
                  <RegulationTag
                    regulation={doc.regulation as 'eu_ai_act' | 'gdpr' | 'nis2' | 'dora'}
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">Multi</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{doc.aiToolName ?? 'Global'}</td>
              <td className="px-4 py-3">
                <DocumentStatusBadge status={doc.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">v{doc.version}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(doc.createdAt)}</td>
              <td className="px-4 py-3 text-right">
                <DocumentActions doc={doc} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentActions({ doc }: { doc: ComplianceDocumentRow }) {
  async function handlePdf() {
    const result = await generatePdf(doc.id);
    if (result.success && result.url) {
      window.open(result.url, '_blank');
    } else {
      toast.error(result.error ?? 'Erreur PDF');
    }
  }

  async function handleDuplicate() {
    try {
      await duplicateDocument(doc.id);
      toast.success('Document duplique');
    } catch {
      toast.error('Erreur lors de la duplication');
    }
  }

  async function handleArchive() {
    try {
      await archiveDocument(doc.id);
      toast.success('Document archive');
    } catch {
      toast.error("Erreur lors de l'archivage");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="sm" aria-label="Actions du document" />}
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={`/documents/${doc.id}`} />}>
          <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
          Voir / Editer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePdf}>
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          Telecharger PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
          Dupliquer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleArchive} className="text-destructive">
          <Archive className="mr-2 h-4 w-4" aria-hidden="true" />
          Archiver
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
