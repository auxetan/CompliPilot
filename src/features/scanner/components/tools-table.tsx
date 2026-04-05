'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import { RiskBadge } from './risk-badge';
import { CategoryBadge } from './category-badge';
import { DeleteToolDialog } from './delete-tool-dialog';
import type { AiToolRow } from '../types';

interface ToolsTableProps {
  tools: AiToolRow[];
}

function formatRelativeDate(date: Date | string | null): string {
  if (!date) return '—';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function ToolsTable({ tools }: ToolsTableProps) {
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
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Outil</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Risque</TableHead>
            <TableHead className="text-right">Utilisateurs</TableHead>
            <TableHead>Client-facing</TableHead>
            <TableHead>Dernier scan</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.map((tool) => (
            <TableRow key={tool.id} className="group">
              <TableCell>
                <Link
                  href={`/scanner/${tool.id}`}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {tool.name}
                </Link>
                {tool.provider && (
                  <span className="ml-1 text-xs text-muted-foreground">({tool.provider})</span>
                )}
              </TableCell>
              <TableCell>{tool.category && <CategoryBadge category={tool.category} />}</TableCell>
              <TableCell>
                <RiskBadge level={tool.riskLevel ?? 'not_assessed'} />
              </TableCell>
              <TableCell className="text-right">{tool.userCount ?? '—'}</TableCell>
              <TableCell>
                {tool.isCustomerFacing ? (
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    Oui
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Non</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatRelativeDate(tool.lastAssessedAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/scanner/${tool.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Voir {tool.name}</span>
                    </Button>
                  </Link>
                  <Link href={`/scanner/${tool.id}?edit=true`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Modifier {tool.name}</span>
                    </Button>
                  </Link>
                  <DeleteToolDialog toolId={tool.id} toolName={tool.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
