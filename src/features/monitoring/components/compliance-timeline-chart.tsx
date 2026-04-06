'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ComplianceTimelinePoint } from '../types';

interface ComplianceTimelineChartProps {
  data: ComplianceTimelinePoint[];
}

const PERIOD_OPTIONS = [
  { label: '30j', value: 30 },
  { label: '90j', value: 90 },
  { label: '1 an', value: 365 },
] as const;

const REGULATION_COLORS: Record<string, string> = {
  euAiAct: '#3b82f6',
  gdpr: '#8b5cf6',
  nis2: '#f59e0b',
  dora: '#16a34a',
};

/**
 * Area chart showing compliance score evolution per regulation.
 */
export function ComplianceTimelineChart({ data }: ComplianceTimelineChartProps) {
  const [period, setPeriod] = useState(30);

  // Filter data purely from the data's max date — avoids impure Date.now() in render
  const filtered = useMemo(() => {
    if (data.length === 0) return data;
    const lastPoint = data[data.length - 1];
    if (!lastPoint) return data;
    const maxDate = lastPoint.date;
    const refMs = new Date(maxDate).getTime();
    const cutoff = new Date(refMs - period * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    return data.filter((d) => d.date >= cutoff);
  }, [data, period]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Conformite par reglementation</CardTitle>
        <div className="flex gap-1">
          {PERIOD_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={period === opt.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            Pas encore de donnees pour cette periode.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(v: string) => v.slice(5)}
                className="text-muted-foreground"
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="euAiAct"
                name="EU AI Act"
                stroke={REGULATION_COLORS.euAiAct}
                fill={REGULATION_COLORS.euAiAct}
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="gdpr"
                name="RGPD"
                stroke={REGULATION_COLORS.gdpr}
                fill={REGULATION_COLORS.gdpr}
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="nis2"
                name="NIS2"
                stroke={REGULATION_COLORS.nis2}
                fill={REGULATION_COLORS.nis2}
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="dora"
                name="DORA"
                stroke={REGULATION_COLORS.dora}
                fill={REGULATION_COLORS.dora}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
