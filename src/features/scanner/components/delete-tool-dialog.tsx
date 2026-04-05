'use client';

import { useState, useTransition } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteAiTool } from '@/features/scanner/actions';
import { toast } from 'sonner';

interface DeleteToolDialogProps {
  toolId: string;
  toolName: string;
}

export function DeleteToolDialog({ toolId, toolName }: DeleteToolDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteAiTool(toolId);
      toast.success(`"${toolName}" a été archivé`);
      setOpen(false);
    });
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4 text-destructive" />
        <span className="sr-only">Supprimer {toolName}</span>
      </Button>

      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="mx-4 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
              <h2 className="text-lg font-semibold">Confirmer la suppression</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Êtes-vous sûr de vouloir archiver <strong>{toolName}</strong> ? L&apos;outil sera
                marqué comme déprécié et ne sera plus visible dans votre inventaire actif.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                  {isPending ? 'Suppression...' : 'Supprimer'}
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
