'use client';

import { useTransition } from 'react';
import { Loader2, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { cancelInvitation } from '@/features/settings/actions';

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface PendingInvitationsProps {
  invitations: PendingInvitation[];
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  member: 'Membre',
  viewer: 'Lecteur',
};

export function PendingInvitations({ invitations }: PendingInvitationsProps) {
  const [isPending, startTransition] = useTransition();

  if (invitations.length === 0) return null;

  function handleCancel(id: string) {
    const formData = new FormData();
    formData.set('invitationId', id);
    startTransition(async () => {
      try {
        await cancelInvitation(formData);
        toast.success('Invitation annulee');
      } catch {
        toast.error('Erreur');
      }
    });
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Invitations en attente</h3>
      {invitations.map((inv) => (
        <div key={inv.id} className="flex items-center gap-3 rounded-lg border border-dashed p-3">
          <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{inv.email}</p>
            <p className="text-xs text-muted-foreground">
              {ROLE_LABELS[inv.role] ?? inv.role} — invite le {formatDate(inv.createdAt)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCancel(inv.id)}
            disabled={isPending}
            aria-label="Annuler l'invitation"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      ))}
    </div>
  );
}
