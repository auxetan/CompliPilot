'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import type { Finding } from '../types';

const SEVERITY_STYLES: Record<string, { label: string; className: string }> = {
  critical: {
    label: 'Critique',
    className: 'text-destructive bg-destructive/10 border-destructive/20',
  },
  high: { label: 'Eleve', className: 'text-orange-600 bg-orange-500/10 border-orange-500/20' },
  medium: { label: 'Moyen', className: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20' },
  low: { label: 'Faible', className: 'text-green-600 bg-green-500/10 border-green-500/20' },
};

interface FindingsListProps {
  findings: Finding[];
}

export function FindingsList({ findings }: FindingsListProps) {
  if (findings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Constats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Aucun constat pour cette evaluation.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Constats ({findings.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {findings.map((f, i) => {
          const fallback = {
            label: 'Moyen',
            className: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20',
          };
          const severity = SEVERITY_STYLES[f.severity] ?? fallback;
          return (
            <div key={i} className={`rounded-lg border p-4 ${severity.className}`}>
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{f.finding}</p>
                    <span className="shrink-0 rounded px-1.5 py-0.5 text-xs font-medium uppercase">
                      {severity.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm opacity-80">{f.details}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
