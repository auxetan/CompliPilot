'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import type { RiskActionItem } from '../types';

const PRIORITY_STYLES: Record<string, string> = {
  urgent: 'bg-destructive/10 text-destructive border-destructive/20',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-600 border-green-500/20',
};

const PRIORITY_LABELS: Record<string, string> = {
  urgent: 'Urgent',
  high: 'Haute',
  medium: 'Moyenne',
  low: 'Basse',
};

interface RiskRecommendationsProps {
  actions: RiskActionItem[];
}

export function RiskRecommendations({ actions }: RiskRecommendationsProps) {
  if (actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommandations prioritaires</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Target}
            title="Aucune recommandation"
            description="Lancez des evaluations IA pour obtenir des recommandations."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top {actions.length} recommandations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
          >
            <Badge
              variant="outline"
              className={`mt-0.5 shrink-0 ${PRIORITY_STYLES[item.priority] ?? ''}`}
            >
              {PRIORITY_LABELS[item.priority] ?? item.priority}
            </Badge>
            <div className="min-w-0 flex-1">
              <p className="text-sm">{item.action}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {item.regulationLabel}
                </Badge>
                <span>•</span>
                <span>{item.toolName}</span>
                {item.deadline && (
                  <>
                    <span>•</span>
                    <span>Echeance : {item.deadline}</span>
                  </>
                )}
              </div>
            </div>
            <Link href={`/scanner/${item.toolId}`}>
              <Button variant="ghost" size="icon-sm" aria-label={`Traiter ${item.toolName}`}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
