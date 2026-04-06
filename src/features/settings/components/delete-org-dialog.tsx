'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteOrganization } from '@/features/settings/actions';

interface DeleteOrgDialogProps {
  orgName: string;
}

export function DeleteOrgDialog({ orgName }: DeleteOrgDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState('');
  const [isPending, startTransition] = useTransition();

  const isConfirmed = confirmValue === orgName;

  function handleDelete() {
    const formData = new FormData();
    formData.set('confirmName', confirmValue);
    startTransition(async () => {
      await deleteOrganization(formData);
    });
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          Zone de danger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          La suppression de l&apos;organisation est irreversible. Toutes les donnees seront
          definitivement perdues.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button variant="destructive" className="mt-4" />}>
            Supprimer l&apos;organisation
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Supprimer l&apos;organisation</DialogTitle>
              <DialogDescription>
                Cette action est irreversible. Tapez{' '}
                <span className="font-semibold">{orgName}</span> pour confirmer.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <Input
                placeholder={orgName}
                value={confirmValue}
                onChange={(e) => setConfirmValue(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  disabled={!isConfirmed || isPending}
                  onClick={handleDelete}
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Supprimer definitivement
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
