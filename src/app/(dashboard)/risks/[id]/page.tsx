import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getOrgId } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { RiskBadge } from '@/components/shared/risk-badge';
import { ComplianceScoreGauge } from '@/components/shared/compliance-score-gauge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ExternalLink, Calendar, Clock } from 'lucide-react';
import { REGULATION_LABELS } from '@/lib/constants';
import { FindingsList } from '@/features/risks/components/findings-list';
import { ComplianceChecklist } from '@/features/risks/components/compliance-checklist';
import { AssessmentHistory } from '@/features/risks/components/assessment-history';
import {
  getRiskAssessmentDetail,
  getComplianceChecks,
  getAssessmentHistory,
} from '@/features/risks/services/get-risk-detail';

interface RiskDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RiskDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const orgId = await getOrgId();
  if (!orgId) return { title: 'Risque | CompliPilot' };

  const detail = await getRiskAssessmentDetail(id, orgId);
  if (!detail) return { title: 'Risque introuvable | CompliPilot' };

  const regLabel =
    REGULATION_LABELS[detail.regulation as keyof typeof REGULATION_LABELS] ?? detail.regulation;
  return {
    title: `${detail.toolName} — ${regLabel} | CompliPilot`,
  };
}

async function requireOrgId(): Promise<string> {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');
  return orgId;
}

/* ---------- Async sections ---------- */

async function ChecklistSection({
  orgId,
  toolId,
  regulation,
}: {
  orgId: string;
  toolId: string;
  regulation: string;
}) {
  const checks = await getComplianceChecks(orgId, toolId, regulation);
  return <ComplianceChecklist checks={checks} />;
}

async function HistorySection({ orgId, toolId }: { orgId: string; toolId: string }) {
  const entries = await getAssessmentHistory(orgId, toolId);
  return <AssessmentHistory entries={entries} />;
}

/* ---------- Page ---------- */

export default async function RiskDetailPage({ params }: RiskDetailPageProps) {
  const { id } = await params;
  const orgId = await requireOrgId();

  const detail = await getRiskAssessmentDetail(id, orgId);
  if (!detail) notFound();

  const regLabel =
    REGULATION_LABELS[detail.regulation as keyof typeof REGULATION_LABELS] ?? detail.regulation;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${detail.toolName} — ${regLabel}`}
        actions={
          <>
            <div className="flex items-center gap-2">
              <RiskBadge
                level={
                  detail.riskLevel as
                    | 'high'
                    | 'limited'
                    | 'minimal'
                    | 'unacceptable'
                    | 'not_assessed'
                }
              />
              <Badge variant="secondary">{regLabel}</Badge>
            </div>
            <Link href={`/scanner/${detail.toolId}`}>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir l&apos;outil
              </Button>
            </Link>
            <Link href="/risks">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Findings + checklist */}
        <div className="space-y-6 lg:col-span-2">
          <FindingsList findings={detail.findings} />

          <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
            <ChecklistSection orgId={orgId} toolId={detail.toolId} regulation={detail.regulation} />
          </Suspense>
        </div>

        {/* Right column: Score + metadata + history */}
        <div className="space-y-6">
          {/* Score card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Score de risque</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
              <ComplianceScoreGauge score={100 - detail.riskScore} size="md" />
              <p className="text-sm text-muted-foreground">
                Score de risque : {detail.riskScore}/100
              </p>
            </CardContent>
          </Card>

          {/* Metadata card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Evalue le :</span>
                <span>
                  {detail.assessedAt
                    ? new Date(detail.assessedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '—'}
                </span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Expire le :</span>
                <span>
                  {detail.expiresAt
                    ? new Date(detail.expiresAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '—'}
                </span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Evalue par :</span>
                <Badge variant="secondary">
                  {detail.assessedBy === 'ai' ? 'IA' : detail.assessedBy}
                </Badge>
              </div>
              {detail.toolProvider && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Fournisseur :</span>
                    <span>{detail.toolProvider}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recommendations card */}
          {detail.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Recommandations ({detail.recommendations.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {detail.recommendations.map((rec, i) => (
                  <div key={i} className="rounded-lg border border-border p-3">
                    <p className="text-sm">{rec.action}</p>
                    {rec.deadlineSuggested && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Echeance : {rec.deadlineSuggested}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* History */}
          <Suspense fallback={<Skeleton className="h-48 w-full rounded-xl" />}>
            <HistorySection orgId={orgId} toolId={detail.toolId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
