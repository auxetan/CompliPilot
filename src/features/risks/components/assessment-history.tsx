import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskBadge } from '@/components/shared/risk-badge';
import { History, ScanLine } from 'lucide-react';
import type { AssessmentHistoryEntry } from '../types';

interface AssessmentHistoryProps {
  entries: AssessmentHistoryEntry[];
}

export function AssessmentHistory({ entries }: AssessmentHistoryProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historique des evaluations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8 text-center">
          <History className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Aucune evaluation precedente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Historique des evaluations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {entries.map((entry, index) => {
            const isLast = index === entries.length - 1;
            return (
              <div key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-primary">
                    <ScanLine className="h-4 w-4" />
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="pb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{entry.regulation}</span>
                    <RiskBadge
                      level={
                        entry.riskLevel as
                          | 'high'
                          | 'limited'
                          | 'minimal'
                          | 'unacceptable'
                          | 'not_assessed'
                      }
                    />
                    <span className="text-xs text-muted-foreground">
                      Score : {entry.riskScore}/100
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {entry.assessedAt
                      ? new Date(entry.assessedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '—'}
                    {' — '}
                    {entry.assessedBy === 'ai' ? 'Evaluation IA' : entry.assessedBy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
