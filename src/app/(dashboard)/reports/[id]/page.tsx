import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, FileBarChart } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerClient, getOrgId } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detail du rapport — CompliPilot',
};

interface ReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');

  const supabase = await createServerClient();
  const { data: report } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .single();

  if (!report) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title={report.title ?? 'Rapport'}
        description={`Genere le ${formatDate(report.created_at)}`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/reports">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </Link>
            {report.pdf_url && (
              <a href={report.pdf_url} target="_blank" rel="noopener noreferrer">
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Telecharger PDF
                </Button>
              </a>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileBarChart className="h-4 w-4" aria-hidden="true" />
                Contenu du rapport
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.content ? (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {report.content}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucun contenu disponible pour ce rapport.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar metadata */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Date de creation</span>
                <p className="font-medium">{formatDate(report.created_at)}</p>
              </div>
              {report.generated_by && (
                <div>
                  <span className="text-muted-foreground">Genere par</span>
                  <p className="font-medium">{report.generated_by}</p>
                </div>
              )}
              {report.regulation && (
                <div>
                  <span className="text-muted-foreground">Reglementation</span>
                  <p className="font-medium">{report.regulation}</p>
                </div>
              )}
              {report.period_start && report.period_end && (
                <div>
                  <span className="text-muted-foreground">Periode</span>
                  <p className="font-medium">
                    {report.period_start} — {report.period_end}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
