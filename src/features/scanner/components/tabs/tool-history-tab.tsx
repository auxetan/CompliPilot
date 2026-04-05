'use client';

import { ScanLine, Pencil, Plus, FileText, Trash2, Activity } from 'lucide-react';

const ACTION_CONFIG: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string }
> = {
  'tool.created': { icon: Plus, label: 'Outil créé', color: 'text-green-500' },
  'tool.updated': { icon: Pencil, label: 'Outil modifié', color: 'text-blue-500' },
  'tool.assessed': { icon: ScanLine, label: 'Évaluation IA', color: 'text-purple-500' },
  'tool.deleted': { icon: Trash2, label: 'Outil archivé', color: 'text-red-500' },
  'document.created': { icon: FileText, label: 'Document généré', color: 'text-primary' },
};

export interface AuditLogEntry {
  id: string;
  action: string;
  createdAt: Date | string | null;
  details: Record<string, string | number | boolean | null> | null;
}

interface ToolHistoryTabProps {
  logs: AuditLogEntry[];
}

export function ToolHistoryTab({ logs }: ToolHistoryTabProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <Activity className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Aucune activité enregistrée</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {logs.map((log, index) => {
        const config = ACTION_CONFIG[log.action] ?? {
          icon: Activity,
          label: log.action,
          color: 'text-muted-foreground',
        };
        const Icon = config.icon;
        const isLast = index === logs.length - 1;

        return (
          <div key={log.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card ${config.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border" />}
            </div>

            <div className="pb-6">
              <p className="text-sm font-medium">{config.label}</p>
              <p className="text-xs text-muted-foreground">
                {log.createdAt
                  ? new Date(log.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </p>
              {log.details != null && (
                <div className="mt-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {Object.entries(log.details)
                    .filter(([, v]) => v != null)
                    .map(([key, value]) => (
                      <span key={key} className="mr-3">
                        <span className="font-medium">{key}</span>: {String(value)}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
