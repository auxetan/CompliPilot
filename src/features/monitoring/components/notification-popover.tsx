'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Bell, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDate } from '@/lib/utils';
import { markAlertRead } from '@/features/monitoring/actions';
import { cn } from '@/lib/utils';
import type { AlertSeverity } from '../types';

interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}

interface NotificationPopoverProps {
  alerts: NotificationAlert[];
  unreadCount: number;
}

const SEVERITY_ICON: Record<AlertSeverity, typeof Bell> = {
  info: Info,
  warning: AlertTriangle,
  critical: ShieldAlert,
};

const SEVERITY_DOT: Record<AlertSeverity, string> = {
  info: 'bg-blue-500',
  warning: 'bg-orange-500',
  critical: 'bg-red-500',
};

/**
 * Notification bell popover for the topbar.
 * Shows up to 5 recent alerts with mark-as-read.
 */
export function NotificationPopover({ alerts, unreadCount }: NotificationPopoverProps) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const recent = alerts.slice(0, 5);

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markAlertRead(id);
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            className="relative inline-flex shrink-0 items-center justify-center rounded-lg px-2.5 h-7 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
          />
        }
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <Bell className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <p className="mt-2 text-xs text-muted-foreground">Aucune notification</p>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {recent.map((alert) => {
              const Icon = SEVERITY_ICON[alert.severity] ?? Bell;
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'flex gap-3 border-b px-4 py-3 last:border-0',
                    !alert.isRead && 'bg-muted/30',
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {!alert.isRead && (
                        <span
                          className={cn('h-1.5 w-1.5 rounded-full', SEVERITY_DOT[alert.severity])}
                        />
                      )}
                      <p className="truncate text-xs font-medium">{alert.title}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {alert.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(alert.createdAt)}
                      </span>
                      {!alert.isRead && (
                        <button
                          onClick={() => handleMarkRead(alert.id)}
                          className="text-[10px] text-primary hover:underline"
                        >
                          Lu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t px-4 py-2">
          <Link
            href="/monitoring"
            className="text-xs font-medium text-primary hover:underline"
            onClick={() => setOpen(false)}
          >
            Voir toutes les alertes
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
