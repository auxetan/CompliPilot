import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TOOL_STATUS_LABELS } from '@/features/scanner/schemas';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400',
  under_review: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400',
  deprecated: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-900 dark:text-gray-400',
  blocked: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = TOOL_STATUS_LABELS[status as keyof typeof TOOL_STATUS_LABELS] ?? status;
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.active;

  return (
    <Badge variant="outline" className={cn(style, className)}>
      {label}
    </Badge>
  );
}
