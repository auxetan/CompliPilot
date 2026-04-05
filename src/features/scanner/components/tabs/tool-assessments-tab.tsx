import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskBadge } from '../risk-badge';
import { AssessButton } from '../assess-button';
import { REGULATION_LABELS } from '@/features/scanner/schemas';
import type { AssessmentFinding, AssessmentRecommendation } from '@/features/scanner/schemas';
import type { AiToolWithAssessments } from '../../types';

interface ToolAssessmentsTabProps {
  tool: AiToolWithAssessments;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'text-red-600 dark:text-red-400',
  high: 'text-orange-600 dark:text-orange-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  low: 'text-green-600 dark:text-green-400',
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
};

export function ToolAssessmentsTab({ tool }: ToolAssessmentsTabProps) {
  if (tool.riskAssessments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <p className="mb-1 text-sm font-medium">Aucune évaluation</p>
        <p className="mb-6 text-sm text-muted-foreground">
          Lancez une évaluation IA pour analyser les risques de cet outil
        </p>
        <AssessButton toolId={tool.id} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tool.riskAssessments.map((assessment) => {
        const findings = (assessment.findings ?? []) as AssessmentFinding[];
        const recommendations = (assessment.recommendations ?? []) as AssessmentRecommendation[];

        return (
          <Card key={assessment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {REGULATION_LABELS[assessment.regulation as keyof typeof REGULATION_LABELS] ??
                    assessment.regulation}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <RiskBadge level={assessment.riskLevel} />
                  {assessment.riskScore != null && (
                    <span className="text-sm text-muted-foreground">
                      Score: {assessment.riskScore}/100
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Évalué le{' '}
                {assessment.assessedAt
                  ? new Date(assessment.assessedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'}{' '}
                par {assessment.assessedBy === 'ai' ? 'IA' : assessment.assessedBy}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {findings.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-medium">Constats</h4>
                  <div className="space-y-3">
                    {findings.map((finding, i) => (
                      <div key={i} className="rounded-md border border-border p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{finding.finding}</p>
                          <span
                            className={`text-xs font-medium uppercase ${
                              SEVERITY_COLORS[finding.severity] ?? ''
                            }`}
                          >
                            {finding.severity}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{finding.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-medium">Recommandations</h4>
                  <div className="space-y-2">
                    {recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-md border border-border p-3"
                      >
                        <Badge variant="secondary" className={PRIORITY_COLORS[rec.priority] ?? ''}>
                          {rec.priority}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm">{rec.action}</p>
                          {rec.deadlineSuggested && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Échéance suggérée : {rec.deadlineSuggested}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
