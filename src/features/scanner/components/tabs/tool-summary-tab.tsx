import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Globe, Users, ExternalLink, Zap, Database, Calendar } from 'lucide-react';
import { ScoreGauge } from '../score-gauge';
import { RiskBadge } from '../risk-badge';
import { AssessButton } from '../assess-button';
import {
  TOOL_CATEGORY_LABELS,
  DATA_TYPE_LABELS,
  REGULATION_LABELS,
} from '@/features/scanner/schemas';
import type { AiToolWithAssessments } from '../../types';

interface ToolSummaryTabProps {
  tool: AiToolWithAssessments;
}

export function ToolSummaryTab({ tool }: ToolSummaryTabProps) {
  const applicableRegulations = [...new Set(tool.riskAssessments.map((a) => a.regulation))];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations de l&apos;outil</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem icon={Globe} label="Fournisseur" value={tool.provider ?? '—'} />
              <InfoItem
                icon={Database}
                label="Catégorie"
                value={
                  tool.category
                    ? (TOOL_CATEGORY_LABELS[tool.category as keyof typeof TOOL_CATEGORY_LABELS] ??
                      tool.category)
                    : '—'
                }
              />
              <InfoItem
                icon={Users}
                label="Utilisateurs"
                value={tool.userCount ? String(tool.userCount) : '—'}
              />
              <InfoItem
                icon={ExternalLink}
                label="Client-facing"
                value={tool.isCustomerFacing ? 'Oui' : 'Non'}
              />
              <InfoItem
                icon={Zap}
                label="Décisions automatisées"
                value={tool.automatedDecisions ? 'Oui' : 'Non'}
              />
              <InfoItem
                icon={Calendar}
                label="Ajouté le"
                value={tool.createdAt ? new Date(tool.createdAt).toLocaleDateString('fr-FR') : '—'}
              />
            </dl>

            {tool.description && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="mt-1 text-sm">{tool.description}</p>
                </div>
              </>
            )}

            {tool.usageContext && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Contexte d&apos;utilisation
                  </p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{tool.usageContext}</p>
                </div>
              </>
            )}

            {tool.dataTypesProcessed && tool.dataTypesProcessed.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Types de données traitées
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.dataTypesProcessed.map((dt) => (
                      <Badge key={dt} variant="secondary">
                        {DATA_TYPE_LABELS[dt as keyof typeof DATA_TYPE_LABELS] ?? dt}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tool.url && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">URL</p>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    {tool.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score de risque</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {tool.riskScore != null ? (
              <>
                <ScoreGauge score={100 - tool.riskScore} size="lg" />
                <RiskBadge level={tool.riskLevel ?? 'not_assessed'} />
              </>
            ) : (
              <div className="text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                  Cet outil n&apos;a pas encore été évalué
                </p>
                <AssessButton toolId={tool.id} />
              </div>
            )}
          </CardContent>
        </Card>

        {applicableRegulations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Réglementations impactées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {applicableRegulations.map((reg) => (
                  <Badge key={reg} variant="outline">
                    {REGULATION_LABELS[reg as keyof typeof REGULATION_LABELS] ?? reg}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {tool.riskScore != null && (
          <AssessButton toolId={tool.id} variant="outline" className="w-full" />
        )}
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}
