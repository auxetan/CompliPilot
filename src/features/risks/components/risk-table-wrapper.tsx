'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { RiskTable } from './risk-table';
import { exportRisksCsv } from '../actions/export-csv';
import type { RiskTableRow } from '../types';

interface RiskTableWrapperProps {
  rows: RiskTableRow[];
}

export function RiskTableWrapper({ rows }: RiskTableWrapperProps) {
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      try {
        const csv = await exportRisksCsv();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compli-pilot-risks-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export CSV telecharge');
      } catch {
        toast.error("Erreur lors de l'export");
      }
    });
  }

  return <RiskTable rows={rows} onExportCsv={handleExport} />;
}
