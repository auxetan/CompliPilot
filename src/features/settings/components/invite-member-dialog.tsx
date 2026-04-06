'use client';

import { useState, useTransition } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { inviteMember } from '@/features/settings/actions';

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('member');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    formData.set('role', role);
    startTransition(async () => {
      try {
        await inviteMember(formData);
        toast.success('Invitation envoyee');
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erreur');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <UserPlus className="mr-2 h-4 w-4" />
        Inviter un membre
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inviter un membre</DialogTitle>
          <DialogDescription>
            Envoyez une invitation par email. L&apos;invite recevra un lien pour rejoindre votre
            organisation.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              name="email"
              type="email"
              placeholder="colleague@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(v) => {
                if (v) setRole(v);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Membre</SelectItem>
                <SelectItem value="viewer">Lecteur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer l&apos;invitation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
