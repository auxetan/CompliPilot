'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanLine,
  ShieldAlert,
  FileText,
  Activity,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SidebarProps {
  plan?: string;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scanner', label: 'Scanner IA', icon: ScanLine },
  { href: '/risks', label: 'Risques', icon: ShieldAlert },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/reports', label: 'Rapports', icon: BarChart3 },
] as const;

const BOTTOM_ITEMS = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '#', label: 'Aide', icon: HelpCircle },
] as const;

/**
 * Dashboard sidebar — collapsible, with navigation, plan badge, and tooltip support.
 */
export function Sidebar({ plan = 'free' }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const planLabel =
    plan === 'enterprise'
      ? 'Enterprise'
      : plan === 'growth'
        ? 'Growth'
        : plan === 'starter'
          ? 'Starter'
          : 'Free';

  return (
    <aside
      className={cn(
        'hidden h-screen flex-col border-r border-border bg-card transition-all duration-200 lg:flex',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <ShieldCheck className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
        {!collapsed && <span className="text-lg font-semibold">CompliPilot</span>}
      </div>

      {/* Main nav */}
      <nav
        className="flex-1 space-y-1 overflow-y-auto px-2 py-4"
        aria-label="Navigation principale"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isActive}
              collapsed={collapsed}
            />
          );
        })}
      </nav>

      <Separator />

      {/* Bottom nav */}
      <div className="space-y-1 px-2 py-4">
        {BOTTOM_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <SidebarLink
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isActive}
              collapsed={collapsed}
            />
          );
        })}
      </div>

      {/* Plan badge */}
      {!collapsed && (
        <div className="border-t border-border px-4 py-3">
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {planLabel} Plan
          </span>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-10 items-center justify-center border-t border-border text-muted-foreground hover:text-foreground transition-colors"
        aria-label={collapsed ? 'Etendre la sidebar' : 'Reduire la sidebar'}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}

/* ----- Internal SidebarLink component ----- */

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  collapsed: boolean;
}

function SidebarLink({ href, label, icon: Icon, isActive, collapsed }: SidebarLinkProps) {
  const content = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-primary/10 font-medium text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        collapsed && 'justify-center px-0',
      )}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span />}>{content}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
