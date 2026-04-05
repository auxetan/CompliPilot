'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ScanLine, Loader2 } from 'lucide-react';
import { assessAiTool } from '@/features/scanner/actions';
import { toast } from 'sonner';

interface AssessButtonProps {
  toolId: string;
  variant?: 'default' | 'outline';
  className?: string;
}

export function AssessButton({ toolId, variant = 'default', className }: AssessButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleAssess() {
    startTransition(async () => {
      const result = await assessAiTool(toolId);
      if (result.success) {
        toast.success('Évaluation terminée avec succès');
      } else {
        toast.error(result.error ?? "Erreur lors de l'évaluation");
      }
    });
  }

  return (
    <Button variant={variant} onClick={handleAssess} disabled={isPending} className={className}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ScanLine className="mr-2 h-4 w-4" />
      )}
      {isPending ? 'Évaluation en cours...' : "Lancer l'évaluation"}
    </Button>
  );
}
