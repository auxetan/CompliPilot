import Link from 'next/link';
import { RefreshCw, ScanLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StaleToolItem } from '../types';

interface StaleToolsListProps {
  tools: StaleToolItem[];
}

/**
 * List of tools not assessed in 90+ days.
 */
export function StaleToolsList({ tools }: StaleToolsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Outils a re-evaluer
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tools.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tous les outils sont a jour.</p>
        ) : (
          <div className="space-y-2">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/scanner/${tool.id}`}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <ScanLine className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {tool.provider ?? 'Fournisseur inconnu'}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-600">
                  {tool.daysSinceAssessment > 365
                    ? 'Jamais evalue'
                    : `${tool.daysSinceAssessment}j`}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
