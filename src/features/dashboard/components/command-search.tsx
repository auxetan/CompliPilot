'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ScanLine,
  FileText,
  Bell,
  Settings,
  CreditCard,
  Users,
  ShieldCheck,
} from 'lucide-react';
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';

interface CommandRoute {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ROUTES: CommandRoute[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Scanner IA', href: '/scanner', icon: ScanLine },
  { label: 'Documents', href: '/documents', icon: FileText },
  { label: 'Monitoring', href: '/monitoring', icon: Bell },
  { label: 'Conformite', href: '/compliance', icon: ShieldCheck },
];

const SETTINGS_ROUTES: CommandRoute[] = [
  { label: 'Parametres generaux', href: '/settings', icon: Settings },
  { label: 'Equipe', href: '/settings/team', icon: Users },
  { label: 'Facturation', href: '/settings/billing', icon: CreditCard },
];

/**
 * Cmd+K global search command palette.
 */
export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Recherche"
      description="Naviguez rapidement vers une page"
    >
      <Command>
        <CommandInput placeholder="Rechercher une page..." />
        <CommandList>
          <CommandEmpty>Aucun resultat.</CommandEmpty>

          <CommandGroup heading="Navigation">
            {NAV_ROUTES.map((route) => (
              <CommandItem key={route.href} onSelect={() => handleSelect(route.href)}>
                <route.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                {route.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Parametres">
            {SETTINGS_ROUTES.map((route) => (
              <CommandItem key={route.href} onSelect={() => handleSelect(route.href)}>
                <route.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                {route.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
