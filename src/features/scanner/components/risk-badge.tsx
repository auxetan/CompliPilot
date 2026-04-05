import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RISK_LEVEL_LABELS } from '@/features/scanner/schemas';

const RISK_STYLES: Record<string, string> = {
  unacceptable:
    'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900',
  high: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-900',
  limited:
    'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900',
  minimal:
    'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900',
  not_assessed:
    'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800',
};

interface RiskBadgeProps {
  level: string;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const label = RISK_LEVEL_LABELS[level as keyof typeof RISK_LEVEL_LABELS] ?? level;
  const style = RISK_STYLES[level] ?? RISK_STYLES.not_assessed;

  return (
    <Badge variant="outline" className={cn(style, className)}>
      {label}
    </Badge>
  );
}
