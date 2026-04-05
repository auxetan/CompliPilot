'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  scanner: 'Scanner IA',
  risks: 'Risques',
  documents: 'Documents',
  monitoring: 'Monitoring',
  reports: 'Rapports',
  settings: 'Settings',
  team: 'Equipe',
  billing: 'Facturation',
  profile: 'Profil',
  new: 'Nouveau',
};

/**
 * Standard page header with auto-generated breadcrumb, title, and optional actions.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      {segments.length > 1 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            {segments.map((segment, i) => {
              const href = '/' + segments.slice(0, i + 1).join('/');
              const label = BREADCRUMB_LABELS[segment] ?? segment;
              const isLast = i === segments.length - 1;

              return (
                <li key={href} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden="true" />}
                  {isLast ? (
                    <span className="font-medium text-foreground">{label}</span>
                  ) : (
                    <Link href={href} className="hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Title + Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
