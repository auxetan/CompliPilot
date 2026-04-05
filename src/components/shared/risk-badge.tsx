import {
  ShieldAlert,
  AlertTriangle,
  Info,
  ShieldCheck,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type RiskLevel = 'unacceptable' | 'high' | 'limited' | 'minimal' | 'not_assessed';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const RISK_CONFIG: Record<RiskLevel, { label: string; icon: LucideIcon; className: string }> = {
  unacceptable: {
    label: 'Inacceptable',
    icon: ShieldAlert,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  high: {
    label: 'Haut',
    icon: AlertTriangle,
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  limited: {
    label: 'Limite',
    icon: Info,
    className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  },
  minimal: {
    label: 'Minimal',
    icon: ShieldCheck,
    className: 'bg-success/10 text-success border-success/20',
  },
  not_assessed: {
    label: 'Non evalue',
    icon: HelpCircle,
    className: 'bg-muted text-muted-foreground border-border',
  },
};

/**
 * Colored badge indicating the risk level of an AI tool.
 */
export function RiskBadge({ level, className }: RiskBadgeProps) {
  const config = RISK_CONFIG[level];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn('gap-1 font-medium', config.className, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  );
}
