'use client';

import { useEffect, useState } from 'react';
import { SCORE_THRESHOLDS } from '@/lib/constants';

interface ComplianceScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SIZE_MAP = {
  sm: { width: 64, stroke: 5, fontSize: 'text-sm' },
  md: { width: 96, stroke: 6, fontSize: 'text-xl' },
  lg: { width: 140, stroke: 8, fontSize: 'text-3xl' },
} as const;

function getScoreColor(score: number): string {
  if (score <= SCORE_THRESHOLDS.NON_COMPLIANT) return 'hsl(0 84% 60%)';
  if (score <= SCORE_THRESHOLDS.IN_PROGRESS) return 'hsl(38 92% 50%)';
  if (score <= SCORE_THRESHOLDS.ALMOST_COMPLIANT) return 'hsl(217 91% 60%)';
  return 'hsl(142 76% 36%)';
}

function getScoreLabel(score: number): string {
  if (score <= SCORE_THRESHOLDS.NON_COMPLIANT) return 'Non-Conforme';
  if (score <= SCORE_THRESHOLDS.IN_PROGRESS) return 'En Cours';
  if (score <= SCORE_THRESHOLDS.ALMOST_COMPLIANT) return 'Presque Conforme';
  return 'Conforme';
}

/**
 * Animated circular gauge displaying a compliance score (0-100).
 */
export function ComplianceScoreGauge({
  score,
  size = 'md',
  showLabel = true,
}: ComplianceScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = SIZE_MAP[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg width={config.width} height={config.width} className="-rotate-90" aria-hidden="true">
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-semibold ${config.fontSize}`} style={{ color }}>
            {animatedScore}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground">{getScoreLabel(score)}</span>
      )}
    </div>
  );
}
