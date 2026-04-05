import Link from 'next/link';
import { AlertTriangle, FileWarning, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PriorityAction } from '../types';

const URGENCY_STYLES: Record<PriorityAction['urgency'], { label: string; className: string }> = {
  critical: {
    label: 'Critique',
    className: 'border-destructive/30 bg-destructive/10 text-destructive',
  },
  high: { label: 'Haute', className: 'border-warning/30 bg-warning/10 text-warning' },
  medium: { label: 'Moyenne', className: 'border-primary/30 bg-primary/10 text-primary' },
};

const TYPE_ICONS: Record<PriorityAction['type'], React.ComponentType<{ className?: string }>> = {
  assess_tool: AlertTriangle,
  generate_doc: FileWarning,
  deadline: Clock,
  review: Clock,
};

interface PriorityActionsProps {
  actions: PriorityAction[];
}

/**
 * Card listing top 5 priority actions for the organization.
 */
export function PriorityActions({ actions }: PriorityActionsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Actions prioritaires</CardTitle>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aucune action requise pour le moment.
          </p>
        ) : (
          <ul className="space-y-3">
            {actions.map((action) => {
              const Icon = TYPE_ICONS[action.type];
              const urgency = URGENCY_STYLES[action.urgency];
              return (
                <li key={action.id}>
                  <Link
                    href={action.href}
                    className="group flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{action.title}</span>
                        <Badge variant="outline" className={urgency.className}>
                          {urgency.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight
                      className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
