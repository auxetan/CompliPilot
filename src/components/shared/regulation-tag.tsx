import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Regulation = 'eu_ai_act' | 'gdpr' | 'nis2' | 'dora';

interface RegulationTagProps {
  regulation: Regulation;
  className?: string;
}

const REGULATION_CONFIG: Record<Regulation, { label: string; className: string }> = {
  eu_ai_act: {
    label: 'EU AI Act',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  gdpr: {
    label: 'RGPD',
    className: 'bg-accent/10 text-accent border-accent/20',
  },
  nis2: {
    label: 'NIS2',
    className: 'bg-success/10 text-success border-success/20',
  },
  dora: {
    label: 'DORA',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
};

/**
 * Colored tag for a regulation (EU AI Act, RGPD, NIS2, DORA).
 */
export function RegulationTag({ regulation, className }: RegulationTagProps) {
  const config = REGULATION_CONFIG[regulation];

  return (
    <Badge variant="outline" className={cn('font-medium', config.className, className)}>
      {config.label}
    </Badge>
  );
}
