'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TOOL_CATEGORIES,
  TOOL_CATEGORY_LABELS,
  RISK_LEVELS,
  RISK_LEVEL_LABELS,
  TOOL_STATUSES,
  TOOL_STATUS_LABELS,
} from '@/features/scanner/schemas';

interface ScannerFiltersProps {
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

export function ScannerFilters({ viewMode, onViewModeChange }: ScannerFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`/scanner?${params.toString()}`);
    },
    [router, searchParams],
  );

  const clearFilters = useCallback(() => {
    router.push('/scanner');
  }, [router]);

  const hasFilters =
    searchParams.has('q') ||
    searchParams.has('category') ||
    searchParams.has('risk') ||
    searchParams.has('status');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un outil..."
            defaultValue={searchParams.get('q') ?? ''}
            onChange={(e) => updateParam('q', e.target.value || null)}
            className="pl-9"
          />
        </div>

        {/* Category filter */}
        <Select
          defaultValue={searchParams.get('category') ?? 'all'}
          onValueChange={(v) => updateParam('category', v)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {TOOL_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {TOOL_CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Risk filter */}
        <Select
          defaultValue={searchParams.get('risk') ?? 'all'}
          onValueChange={(v) => updateParam('risk', v)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Niveau de risque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous risques</SelectItem>
            {RISK_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {RISK_LEVEL_LABELS[level]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          defaultValue={searchParams.get('status') ?? 'all'}
          onValueChange={(v) => updateParam('status', v)}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {TOOL_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {TOOL_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex rounded-md border border-border">
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            aria-label="Vue liste"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            aria-label="Vue grille"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="w-fit">
          <X className="mr-1 h-3 w-3" />
          Effacer les filtres
        </Button>
      )}
    </div>
  );
}
