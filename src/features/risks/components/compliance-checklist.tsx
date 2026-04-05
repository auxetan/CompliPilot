'use client';

import { useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { updateComplianceCheck } from '../actions/update-check';
import type { ComplianceCheckItem } from '../types';

const STATUS_STYLES: Record<string, string> = {
  compliant: 'bg-success/10 text-success border-success/20',
  non_compliant: 'bg-destructive/10 text-destructive border-destructive/20',
  partial: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  not_applicable: 'bg-muted text-muted-foreground border-border',
  not_checked: 'bg-muted text-muted-foreground border-border',
};

const STATUS_LABELS: Record<string, string> = {
  compliant: 'Conforme',
  non_compliant: 'Non conforme',
  partial: 'Partiel',
  not_applicable: 'N/A',
  not_checked: 'Non verifie',
};

interface ComplianceChecklistProps {
  checks: ComplianceCheckItem[];
}

export function ComplianceChecklist({ checks }: ComplianceChecklistProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(check: ComplianceCheckItem) {
    const newStatus = check.status === 'compliant' ? 'not_checked' : 'compliant';
    startTransition(async () => {
      const result = await updateComplianceCheck(check.id, newStatus);
      if (result.success) {
        toast.success(
          newStatus === 'compliant'
            ? `"${check.requirementLabel}" marque comme conforme`
            : `"${check.requirementLabel}" marque comme non verifie`,
        );
      } else {
        toast.error(result.error ?? 'Erreur lors de la mise a jour');
      }
    });
  }

  if (checks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Checklist de conformite</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8 text-center">
          <ClipboardCheck className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Aucune verification de conformite pour cette evaluation.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Checklist de conformite ({checks.filter((c) => c.status === 'compliant').length}/
          {checks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.id}
            className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
          >
            <Checkbox
              id={`check-${check.id}`}
              checked={check.status === 'compliant'}
              onCheckedChange={() => handleToggle(check)}
              disabled={isPending}
              aria-label={check.requirementLabel}
            />
            <div className="min-w-0 flex-1">
              <label htmlFor={`check-${check.id}`} className="cursor-pointer text-sm font-medium">
                {check.requirementLabel}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${STATUS_STYLES[check.status] ?? ''}`}>
                  {STATUS_LABELS[check.status] ?? check.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{check.requirementKey}</span>
              </div>
              {check.evidence && (
                <p className="mt-1 text-xs text-muted-foreground">{check.evidence}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
