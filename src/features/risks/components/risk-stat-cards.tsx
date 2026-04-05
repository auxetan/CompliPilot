'use client';

import { ShieldAlert, AlertTriangle, Info, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { RiskLevelStat } from '../types';

const LEVEL_CONFIG = {
  unacceptable: {
    label: 'Inacceptable',
    icon: ShieldAlert,
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/20',
  },
  high: {
    label: 'Haut risque',
    icon: AlertTriangle,
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/20',
  },
  limited: {
    label: 'Risque limite',
    icon: Info,
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-600',
    border: 'border-yellow-500/20',
  },
  minimal: {
    label: 'Risque minimal',
    icon: ShieldCheck,
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/20',
  },
} as const;

interface RiskStatCardsProps {
  stats: RiskLevelStat[];
}

export function RiskStatCards({ stats }: RiskStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const config = LEVEL_CONFIG[stat.level];
        const Icon = config.icon;

        return (
          <Card key={stat.level} className={`border ${config.border}`}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${config.bg}`}>
                <Icon className={`h-6 w-6 ${config.text}`} aria-hidden="true" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${config.text}`}>{stat.count}</p>
                <p className="text-sm text-muted-foreground">{config.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
