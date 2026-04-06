import { Calendar, AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DeadlineItem, AlertSeverity } from '../types';

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  critical: 'text-red-600 bg-red-500/10 border-red-500/20',
  warning: 'text-orange-600 bg-orange-500/10 border-orange-500/20',
  info: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
};

const SEVERITY_ICONS: Record<AlertSeverity, typeof Info> = {
  critical: ShieldAlert,
  warning: AlertTriangle,
  info: Info,
};

interface DeadlinesListProps {
  deadlines: DeadlineItem[];
}

/**
 * Upcoming regulatory deadlines list.
 */
export function DeadlinesList({ deadlines }: DeadlinesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          Prochaines deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        {deadlines.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune deadline a venir.</p>
        ) : (
          <div className="space-y-3">
            {deadlines.map((d) => {
              const Icon = SEVERITY_ICONS[d.severity];
              const isPast = d.daysUntil < 0;
              return (
                <div
                  key={d.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3',
                    SEVERITY_STYLES[d.severity],
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs opacity-80">
                      {d.regulation} — {d.date}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold">
                    {isPast
                      ? `${Math.abs(d.daysUntil)}j depasse`
                      : d.daysUntil === 0
                        ? "Aujourd'hui"
                        : `${d.daysUntil}j`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
