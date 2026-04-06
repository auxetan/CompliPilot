'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Moon, Sun, Search, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MobileNav } from './mobile-nav';
import { NotificationPopover } from '@/features/monitoring/components/notification-popover';
import { logoutAction } from '@/features/auth/actions/auth-actions';
import type { AlertSeverity } from '@/features/monitoring/types';

interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}

interface TopbarProps {
  userEmail?: string;
  userName?: string;
  alerts?: NotificationAlert[];
  unreadCount?: number;
}

/**
 * Dashboard topbar — mobile hamburger, search shortcut, notifications, theme toggle, user menu.
 */
export function Topbar({ userEmail, userName, alerts = [], unreadCount = 0 }: TopbarProps) {
  const { setTheme, resolvedTheme } = useTheme();

  const initials = userName
    ? userName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (userEmail?.slice(0, 2).toUpperCase() ?? '??');

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      {/* Left: mobile hamburger */}
      <div className="flex items-center gap-3">
        <MobileNav />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Search shortcut */}
        <Tooltip>
          <TooltipTrigger
            render={<Button variant="ghost" size="sm" aria-label="Rechercher (Cmd+K)" />}
          >
            <Search className="h-4 w-4" />
            <kbd className="ml-1.5 hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
              ⌘K
            </kbd>
          </TooltipTrigger>
          <TooltipContent>Rechercher</TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <NotificationPopover alerts={alerts} unreadCount={unreadCount} />

        {/* Theme toggle */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                aria-label="Changer le theme"
              />
            }
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </TooltipTrigger>
          <TooltipContent>Changer le theme</TooltipContent>
        </Tooltip>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 gap-2"
                aria-label="Menu utilisateur"
              />
            }
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm sm:inline">{userName ?? userEmail}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Link href="/settings/profile" className="flex w-full items-center gap-2">
                <User className="h-4 w-4" aria-hidden="true" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/settings" className="flex w-full items-center gap-2">
                <Settings className="h-4 w-4" aria-hidden="true" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutAction()}
              className="flex items-center gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Se deconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
