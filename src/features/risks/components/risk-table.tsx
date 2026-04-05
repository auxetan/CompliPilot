'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Download, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable, type DataTableColumn } from '@/components/shared/data-table';
import { RiskBadge } from '@/components/shared/risk-badge';
import { Badge } from '@/components/ui/badge';
import { REGULATIONS, REGULATION_LABELS, RISK_LEVELS, RISK_LEVEL_LABELS } from '@/lib/constants';
import type { RiskTableRow } from '../types';

interface RiskTableProps {
  rows: RiskTableRow[];
  onExportCsv: () => void;
}

const RISK_ORDER: Record<string, number> = {
  unacceptable: 0,
  high: 1,
  limited: 2,
  minimal: 3,
};

export function RiskTable({ rows, onExportCsv }: RiskTableProps) {
  const router = useRouter();
  const [regulationFilter, setRegulationFilter] = useState<string>('all');
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(
    new Set(['unacceptable', 'high', 'limited', 'minimal']),
  );

  const filtered = useMemo(() => {
    if (regulationFilter === 'all') return rows;
    return rows.filter((r) => r.regulation === regulationFilter);
  }, [rows, regulationFilter]);

  // Group by risk level
  const groups = useMemo(() => {
    const map = new Map<string, RiskTableRow[]>();
    for (const level of RISK_LEVELS) {
      map.set(level, []);
    }
    for (const row of filtered) {
      const level = row.riskLevel;
      if (!map.has(level)) map.set(level, []);
      map.get(level)!.push(row);
    }
    return [...map.entries()]
      .filter(([, items]) => items.length > 0)
      .sort(([a], [b]) => (RISK_ORDER[a] ?? 99) - (RISK_ORDER[b] ?? 99));
  }, [filtered]);

  function toggleLevel(level: string) {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }

  const columns: DataTableColumn<RiskTableRow>[] = [
    {
      key: 'tool',
      header: 'Outil',
      sortable: true,
      searchValue: (r) => r.toolName,
      render: (r) => (
        <div>
          <span className="font-medium">{r.toolName}</span>
          {r.provider && <span className="ml-1 text-xs text-muted-foreground">({r.provider})</span>}
        </div>
      ),
    },
    {
      key: 'risk',
      header: 'Risque',
      render: (r) => (
        <RiskBadge
          level={r.riskLevel as 'high' | 'limited' | 'minimal' | 'unacceptable' | 'not_assessed'}
        />
      ),
    },
    {
      key: 'regulation',
      header: 'Reglementation',
      render: (r) => <Badge variant="secondary">{r.regulationLabel}</Badge>,
    },
    {
      key: 'finding',
      header: 'Constat principal',
      className: 'max-w-[200px]',
      render: (r) => (
        <span className="line-clamp-2 text-sm text-muted-foreground">{r.topFinding ?? '—'}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action requise',
      className: 'max-w-[200px]',
      render: (r) => <span className="line-clamp-2 text-sm">{r.actionRequired ?? '—'}</span>,
    },
    {
      key: 'deadline',
      header: 'Echeance',
      render: (r) => <span className="text-sm text-muted-foreground">{r.deadline ?? '—'}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Select value={regulationFilter} onValueChange={(v) => setRegulationFilter(v ?? 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Reglementation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {REGULATIONS.map((code) => (
              <SelectItem key={code} value={code}>
                {REGULATION_LABELS[code]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={onExportCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <ShieldAlert className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Aucun risque identifie. Evaluez vos outils IA pour commencer.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(([level, items]) => {
            const expanded = expandedLevels.has(level);
            const levelLabel = RISK_LEVEL_LABELS[level as keyof typeof RISK_LEVEL_LABELS] ?? level;

            return (
              <div key={level} className="rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => toggleLevel(level)}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                  aria-expanded={expanded}
                >
                  {expanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <RiskBadge
                    level={
                      level as 'high' | 'limited' | 'minimal' | 'unacceptable' | 'not_assessed'
                    }
                  />
                  <span className="text-sm font-medium">{levelLabel}</span>
                  <span className="text-sm text-muted-foreground">
                    ({items.length} evaluation{items.length > 1 ? 's' : ''})
                  </span>
                </button>

                {expanded && (
                  <div className="border-t border-border">
                    <DataTable
                      columns={columns}
                      data={items}
                      searchPlaceholder="Rechercher un outil..."
                      emptyTitle="Aucun risque"
                      emptyDescription="Pas d'evaluations dans cette categorie."
                      onRowClick={(row) => router.push(`/risks/${row.assessmentId}`)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
