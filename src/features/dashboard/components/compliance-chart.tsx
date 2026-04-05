'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SCORE_THRESHOLDS } from '@/lib/constants';
import type { ComplianceHistoryPoint } from '../types';

interface ComplianceChartProps {
  data: ComplianceHistoryPoint[];
}

function formatXAxis(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

interface TooltipPayloadItem {
  value: number;
  payload: ComplianceHistoryPoint;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.[0]) return null;
  const point = payload[0];
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{point.value}%</p>
      <p className="text-xs text-muted-foreground">
        {new Date(point.payload.date).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
        })}
      </p>
    </div>
  );
}

/**
 * 30-day compliance score evolution chart using Recharts.
 */
export function ComplianceChart({ data }: ComplianceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolution du score de conformite</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Threshold reference lines */}
              <ReferenceLine
                y={SCORE_THRESHOLDS.NON_COMPLIANT}
                stroke="hsl(0 84% 60%)"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
                label={{
                  value: 'Non-conforme',
                  position: 'right',
                  fontSize: 10,
                  fill: 'hsl(0 84% 60%)',
                }}
              />
              <ReferenceLine
                y={SCORE_THRESHOLDS.IN_PROGRESS}
                stroke="hsl(38 92% 50%)"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
                label={{
                  value: 'En cours',
                  position: 'right',
                  fontSize: 10,
                  fill: 'hsl(38 92% 50%)',
                }}
              />
              <ReferenceLine
                y={SCORE_THRESHOLDS.ALMOST_COMPLIANT}
                stroke="hsl(217 91% 60%)"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
                label={{
                  value: 'Presque',
                  position: 'right',
                  fontSize: 10,
                  fill: 'hsl(217 91% 60%)',
                }}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
