import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Download, FileBarChart, Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createServerClient, getOrgId } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { ReportRow } from '@/features/monitoring/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rapports — CompliPilot',
  description: 'Rapports de conformite generes',
};

export default async function ReportsPage() {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');

  const supabase = await createServerClient();
  const { data: rawReports } = await supabase
    .from('reports')
    .select('id, title, created_at, pdf_url, generated_by')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(50);

  const reports: ReportRow[] = (rawReports ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    createdAt: r.created_at,
    pdfUrl: r.pdf_url,
    generatedBy: r.generated_by,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Rapports"
        description="Rapports de conformite generes automatiquement ou manuellement"
        actions={
          <Link href="/reports/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generer un rapport
            </Button>
          </Link>
        }
      />

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <FileBarChart className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium">Aucun rapport</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generez votre premier rapport de conformite pour commencer.
            </p>
            <Link href="/reports/new" className="mt-4">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Generer un rapport
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileBarChart className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{report.title}</p>
                <p className="text-xs text-muted-foreground">
                  Genere le {formatDate(report.createdAt)}
                  {report.generatedBy ? ` par ${report.generatedBy}` : ''}
                </p>
              </div>
              {report.pdfUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Telecharger le PDF"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
