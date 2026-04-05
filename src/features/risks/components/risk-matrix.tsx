'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RiskBadge } from '@/components/shared/risk-badge';
import type { RiskMatrixPoint } from '../types';

interface RiskMatrixProps {
  data: RiskMatrixPoint[];
}

const RISK_COLORS: Record<string, string> = {
  unacceptable: 'bg-destructive',
  high: 'bg-orange-500',
  limited: 'bg-yellow-500',
  minimal: 'bg-green-500',
};

const GRID_SIZE = 5;
const LABELS_X = ['Tres faible', 'Faible', 'Moyen', 'Eleve', 'Tres eleve'];
const LABELS_Y = ['Minimale', 'Faible', 'Moderee', 'Haute', 'Critique'];

function toGridIndex(value: number): number {
  return Math.min(GRID_SIZE - 1, Math.floor(value / (100 / GRID_SIZE)));
}

export function RiskMatrix({ data }: RiskMatrixProps) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Group points into grid cells
  const grid: Map<string, RiskMatrixPoint[]> = new Map();
  for (const point of data) {
    const gx = toGridIndex(point.impactProbability);
    const gy = toGridIndex(point.severity);
    const key = `${gx}-${gy}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key)!.push(point);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Matrice de risques</CardTitle>
        <p className="text-sm text-muted-foreground">
          Position de chaque outil IA selon la probabilite d&apos;impact et la severite
        </p>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex gap-2">
            {/* Y-axis label */}
            <div className="flex shrink-0 flex-col justify-between py-1 text-xs text-muted-foreground">
              {[...LABELS_Y].reverse().map((label) => (
                <span key={label} className="h-14 leading-[3.5rem]">
                  {label}
                </span>
              ))}
            </div>

            <div className="flex-1">
              {/* Grid */}
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                  const gx = idx % GRID_SIZE;
                  const gy = GRID_SIZE - 1 - Math.floor(idx / GRID_SIZE);
                  const key = `${gx}-${gy}`;
                  const cellPoints = grid.get(key) ?? [];
                  // Background intensity based on grid position
                  const intensity = (gx + gy) / (2 * (GRID_SIZE - 1));
                  const bgOpacity = Math.round(intensity * 15 + 3);

                  return (
                    <div
                      key={key}
                      className="relative flex h-14 flex-wrap items-center justify-center gap-0.5 rounded border border-border/50"
                      style={{ backgroundColor: `hsl(0 84% 60% / ${bgOpacity}%)` }}
                    >
                      {cellPoints.map((point) => (
                        <Tooltip key={point.toolId}>
                          <TooltipTrigger
                            render={
                              <button
                                type="button"
                                className={`h-4 w-4 rounded-full border-2 border-white shadow-sm transition-transform ${
                                  RISK_COLORS[point.riskLevel] ?? 'bg-gray-400'
                                } ${hoveredId === point.toolId ? 'scale-150 z-10' : 'hover:scale-125'}`}
                                onMouseEnter={() => setHoveredId(point.toolId)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => router.push(`/scanner/${point.toolId}`)}
                                aria-label={`${point.toolName} — Risque: ${point.riskLevel}`}
                              />
                            }
                          />
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="font-medium">{point.toolName}</p>
                            {point.provider && (
                              <p className="text-xs text-muted-foreground">{point.provider}</p>
                            )}
                            <div className="mt-1">
                              <RiskBadge
                                level={
                                  point.riskLevel as
                                    | 'high'
                                    | 'limited'
                                    | 'minimal'
                                    | 'unacceptable'
                                    | 'not_assessed'
                                }
                              />
                            </div>
                            <p className="mt-1 text-xs">Score: {point.riskScore}/100</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="mt-1 grid grid-cols-5 gap-1 text-center text-xs text-muted-foreground">
                {LABELS_X.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>

              {/* Axis titles */}
              <div className="mt-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>← Probabilite d&apos;impact →</span>
                <span className="-rotate-0">↑ Severite</span>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
