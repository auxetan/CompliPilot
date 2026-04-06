'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_STATUSES,
  DOCUMENT_STATUS_LABELS,
  type DocumentType,
  type DocumentStatus,
} from '@/features/documents/types';
import { REGULATION_LABELS } from '@/lib/constants';

interface AiToolOption {
  id: string;
  name: string;
}

interface DocumentFiltersProps {
  tools: AiToolOption[];
}

/**
 * Filter bar for the documents list page.
 */
export function DocumentFilters({ tools }: DocumentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get('type') ?? '';
  const currentRegulation = searchParams.get('regulation') ?? '';
  const currentStatus = searchParams.get('status') ?? '';
  const currentTool = searchParams.get('toolId') ?? '';

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== '__all__') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`/documents?${params.toString()}`);
    },
    [router, searchParams],
  );

  const hasFilters = currentType || currentRegulation || currentStatus || currentTool;

  const clearAll = useCallback(() => {
    router.push('/documents');
  }, [router]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={currentType || '__all__'}
        onValueChange={(v: string | null) => updateParam('type', v ?? '')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tous les types</SelectItem>
          {DOCUMENT_TYPES.filter((t) => t !== 'custom').map((t) => (
            <SelectItem key={t} value={t}>
              {DOCUMENT_TYPE_LABELS[t]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentRegulation || '__all__'}
        onValueChange={(v: string | null) => updateParam('regulation', v ?? '')}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Reglementation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Toutes</SelectItem>
          {Object.entries(REGULATION_LABELS).map(([code, label]) => (
            <SelectItem key={code} value={code}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentStatus || '__all__'}
        onValueChange={(v: string | null) => updateParam('status', v ?? '')}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tous</SelectItem>
          {DOCUMENT_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {DOCUMENT_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentTool || '__all__'}
        onValueChange={(v: string | null) => updateParam('toolId', v ?? '')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Outil IA" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tous les outils</SelectItem>
          {tools.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll}>
          <X className="mr-1 h-4 w-4" aria-hidden="true" />
          Effacer
        </Button>
      )}
    </div>
  );
}
