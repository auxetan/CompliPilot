'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ExternalLink } from 'lucide-react';
import { RiskBadge } from './risk-badge';
import { CategoryBadge } from './category-badge';
import { StatusBadge } from './status-badge';
import type { AiToolRow } from '../types';

interface ToolsGridProps {
  tools: AiToolRow[];
}

export function ToolsGrid({ tools }: ToolsGridProps) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">Aucun outil IA trouvé.</p>
        <Link href="/scanner/new">
          <Button className="mt-4" size="sm">
            Ajouter votre premier outil
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <Link key={tool.id} href={`/scanner/${tool.id}`}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{tool.name}</CardTitle>
                  {tool.provider && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{tool.provider}</p>
                  )}
                </div>
                <RiskBadge level={tool.riskLevel ?? 'not_assessed'} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {tool.category && <CategoryBadge category={tool.category} />}
                <StatusBadge status={tool.status ?? 'active'} />
              </div>

              {tool.description && (
                <p className="line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{tool.userCount ?? 0} utilisateurs</span>
                </div>
                {tool.isCustomerFacing && (
                  <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                    <ExternalLink className="h-3 w-3" />
                    <span>Client-facing</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
