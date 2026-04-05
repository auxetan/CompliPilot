'use client';

import { useState } from 'react';
import { ScannerFilters } from './scanner-filters';
import { ToolsTable } from './tools-table';
import { ToolsGrid } from './tools-grid';
import type { AiToolRow } from '../types';

interface ScannerListClientProps {
  tools: AiToolRow[];
}

export function ScannerListClient({ tools }: ScannerListClientProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="space-y-6">
      <ScannerFilters viewMode={viewMode} onViewModeChange={setViewMode} />
      {viewMode === 'list' ? <ToolsTable tools={tools} /> : <ToolsGrid tools={tools} />}
    </div>
  );
}
