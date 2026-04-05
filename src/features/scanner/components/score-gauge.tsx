'use client';

import { cn } from '@/lib/utils';

function getScoreColor(score: number): string {
  if (score < 40) return 'text-red-500';
  if (score < 70) return 'text-orange-500';
  if (score < 90) return 'text-blue-500';
  return 'text-green-500';
}

function getStrokeColor(score: number): string {
  if (score < 40) return 'stroke-red-500';
  if (score < 70) return 'stroke-orange-500';
  if (score < 90) return 'stroke-blue-500';
  return 'stroke-green-500';
}

function getScoreLabel(score: number): string {
  if (score < 40) return 'Non-Conforme';
  if (score < 70) return 'En Cours';
  if (score < 90) return 'Presque Conforme';
  return 'Conforme';
}

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { dim: 80, strokeWidth: 6, fontSize: 'text-lg', labelSize: 'text-[10px]' },
  md: { dim: 120, strokeWidth: 8, fontSize: 'text-2xl', labelSize: 'text-xs' },
  lg: { dim: 160, strokeWidth: 10, fontSize: 'text-3xl', labelSize: 'text-sm' },
};

export function ScoreGauge({ score, size = 'md', className }: ScoreGaugeProps) {
  const { dim, strokeWidth, fontSize, labelSize } = SIZES[size];
  const radius = (dim - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} className="-rotate-90">
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className={cn(
            getStrokeColor(score),
            'transition-[stroke-dashoffset] duration-700 ease-out',
          )}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn('font-bold', fontSize, getScoreColor(score))}>{score}</span>
        <span className={cn('text-muted-foreground', labelSize)}>{getScoreLabel(score)}</span>
      </div>
    </div>
  );
}
