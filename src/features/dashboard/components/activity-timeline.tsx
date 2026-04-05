import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { ActivityEntry } from '../types';

interface ActivityTimelineProps {
  entries: ActivityEntry[];
}

const ACTION_DOTS: Record<string, string> = {
  'tool.created': 'bg-primary',
  'tool.assessed': 'bg-warning',
  'document.created': 'bg-success',
  'document.approved': 'bg-success',
  'settings.updated': 'bg-muted-foreground',
};

/**
 * Card showing the 10 most recent audit log entries as a timeline.
 */
export function ActivityTimeline({ entries }: ActivityTimelineProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Activite recente</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucune activite recente.</p>
        ) : (
          <ul className="space-y-4">
            {entries.map((entry, idx) => {
              const dotColor = ACTION_DOTS[entry.action] ?? 'bg-muted-foreground';
              const isLast = idx === entries.length - 1;
              return (
                <li key={entry.id} className="relative flex gap-3">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`} />
                    {!isLast && <div className="w-px flex-1 bg-border" />}
                  </div>
                  {/* Content */}
                  <div className="-mt-0.5 flex-1 pb-4">
                    <p className="text-sm">{entry.description}</p>
                    <time className="text-xs text-muted-foreground" dateTime={entry.createdAt}>
                      {formatDate(entry.createdAt)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
