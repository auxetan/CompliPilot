import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceScoreGauge } from '@/components/shared/compliance-score-gauge';
import type { RegulationScore } from '../types';

interface RegulationCardsProps {
  regulations: RegulationScore[];
}

/**
 * Row of 4 regulation compliance cards with mini gauge + progress bar.
 */
export function RegulationCards({ regulations }: RegulationCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {regulations.map((reg) => (
        <Card key={reg.code}>
          <CardHeader>
            <CardTitle className="text-sm">{reg.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <ComplianceScoreGauge score={reg.score} size="sm" showLabel={false} />
            <div className="w-full space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${reg.score}%` }}
                />
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {reg.completedChecks}/{reg.totalChecks} conformes
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
