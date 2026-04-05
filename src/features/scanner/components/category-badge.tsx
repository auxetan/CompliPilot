import { Badge } from '@/components/ui/badge';
import { TOOL_CATEGORY_LABELS } from '@/features/scanner/schemas';

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const label = TOOL_CATEGORY_LABELS[category as keyof typeof TOOL_CATEGORY_LABELS] ?? category;

  return <Badge variant="secondary">{label}</Badge>;
}
