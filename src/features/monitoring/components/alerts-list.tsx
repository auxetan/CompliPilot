'use client';

import Link from 'next/link';
import { AlertTriangle, Bell, Info, ShieldAlert, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { markAlertRead, markAllAlertsRead } from '@/features/monitoring/actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { AlertSeverity } from '../types';

interface AlertItem {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}

interface AlertsListProps {
  alerts: AlertItem[];
}

const SEVERITY_ICON: Record<AlertSeverity, typeof Bell> = {
  info: Info,
  warning: AlertTriangle,
  critical: ShieldAlert,
};

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  info: 'text-blue-500 bg-blue-500/10',
  warning: 'text-orange-500 bg-orange-500/10',
  critical: 'text-red-500 bg-red-500/10',
};

/**
 * List of alerts with mark-as-read and mark-all actions.
 */
export function AlertsList({ alerts }: AlertsListProps) {
  async function handleMarkRead(id: string) {
    await markAlertRead(id);
    toast.success('Alerte marquee comme lue');
  }

  async function handleMarkAllRead() {
    await markAllAlertsRead();
    toast.success('Toutes les alertes marquees comme lues');
  }

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-3">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" aria-hidden="true" />
            Tout marquer comme lu ({unreadCount})
          </Button>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="flex flex-col items-center py-8 text-center">
          <Bell className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <p className="mt-2 text-sm font-medium">Aucune alerte</p>
          <p className="text-sm text-muted-foreground">Tout est en ordre.</p>
        </div>
      )}

      <div className="space-y-2">
        {alerts.map((alert) => {
          const Icon = SEVERITY_ICON[alert.severity] ?? Bell;
          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                alert.isRead ? 'bg-card opacity-60' : 'bg-card',
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  SEVERITY_STYLES[alert.severity],
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(alert.createdAt)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
                <div className="mt-2 flex gap-2">
                  {alert.actionUrl && (
                    <Link
                      href={alert.actionUrl}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Voir
                    </Link>
                  )}
                  {!alert.isRead && (
                    <button
                      onClick={() => handleMarkRead(alert.id)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Marquer comme lu
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
