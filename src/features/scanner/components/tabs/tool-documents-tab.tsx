import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Download } from 'lucide-react';
import { REGULATION_LABELS } from '@/features/scanner/schemas';
import type { AiToolWithAssessments } from '../../types';

const DOC_TYPE_LABELS: Record<string, string> = {
  impact_assessment: "Évaluation d'impact",
  transparency_notice: 'Notice de transparence',
  technical_doc: 'Documentation technique',
  risk_register: 'Registre des risques',
  bias_audit: 'Audit de biais',
  data_processing_record: 'Registre de traitement',
  conformity_declaration: 'Déclaration de conformité',
  custom: 'Personnalisé',
};

const DOC_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400',
  review: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  expired: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  archived: 'bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400',
};

interface ToolDocumentsTabProps {
  tool: AiToolWithAssessments;
}

export function ToolDocumentsTab({ tool }: ToolDocumentsTabProps) {
  if (tool.complianceDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium">Aucun document</p>
        <p className="mb-6 text-sm text-muted-foreground">
          Les documents de conformité seront disponibles après évaluation
        </p>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Générer un document
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tool.complianceDocuments.length} document
          {tool.complianceDocuments.length > 1 ? 's' : ''}
        </p>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Générer un document
        </Button>
      </div>

      {tool.complianceDocuments.map((doc) => (
        <Card key={doc.id}>
          <CardContent className="flex items-center gap-4 py-4">
            <FileText className="h-8 w-8 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{doc.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {DOC_TYPE_LABELS[doc.type] ?? doc.type}
                </Badge>
                {doc.regulation && (
                  <Badge variant="outline" className="text-xs">
                    {REGULATION_LABELS[doc.regulation as keyof typeof REGULATION_LABELS] ??
                      doc.regulation}
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={DOC_STATUS_COLORS[doc.status ?? 'draft'] ?? ''}
                >
                  {doc.status}
                </Badge>
                <span className="text-xs text-muted-foreground">v{doc.version}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {doc.pdfUrl && (
                <Link href={doc.pdfUrl} target="_blank">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
