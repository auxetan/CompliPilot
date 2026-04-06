'use client';

import { useTransition } from 'react';
import { Loader2, MoreHorizontal, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { updateMemberRole, removeMember } from '@/features/settings/actions';

interface TeamMember {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
}

interface TeamMembersListProps {
  members: TeamMember[];
  currentUserId: string;
  currentUserRole: string;
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Proprietaire',
  admin: 'Admin',
  member: 'Membre',
  viewer: 'Lecteur',
};

const ROLE_STYLES: Record<string, string> = {
  owner: 'bg-amber-500/10 text-amber-600',
  admin: 'bg-blue-500/10 text-blue-600',
  member: 'bg-muted text-muted-foreground',
  viewer: 'bg-muted text-muted-foreground',
};

export function TeamMembersList({ members, currentUserId, currentUserRole }: TeamMembersListProps) {
  const [isPending, startTransition] = useTransition();
  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin';

  function handleRoleChange(memberId: string, newRole: string) {
    const formData = new FormData();
    formData.set('memberId', memberId);
    formData.set('role', newRole);
    startTransition(async () => {
      try {
        await updateMemberRole(formData);
        toast.success('Role mis a jour');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erreur');
      }
    });
  }

  function handleRemove(memberId: string) {
    const formData = new FormData();
    formData.set('memberId', memberId);
    startTransition(async () => {
      try {
        await removeMember(formData);
        toast.success('Membre retire');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erreur');
      }
    });
  }

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const initials = member.fullName
          ? member.fullName
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          : member.email.slice(0, 2).toUpperCase();
        const isOwner = member.role === 'owner';
        const isSelf = member.id === currentUserId;

        return (
          <div key={member.id} className="flex items-center gap-3 rounded-lg border p-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={member.avatarUrl ?? undefined} alt={member.fullName ?? ''} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {member.fullName ?? member.email}
                {isSelf && <span className="ml-1 text-xs text-muted-foreground">(vous)</span>}
              </p>
              <p className="truncate text-xs text-muted-foreground">{member.email}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_STYLES[member.role] ?? ''}`}
            >
              {ROLE_LABELS[member.role] ?? member.role}
            </span>
            <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
              {formatDate(member.createdAt)}
            </span>
            {canManage && !isOwner && !isSelf && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="sm" aria-label="Actions" />}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {['admin', 'member', 'viewer']
                    .filter((r) => r !== member.role)
                    .map((r) => (
                      <DropdownMenuItem key={r} onClick={() => handleRoleChange(member.id, r)}>
                        Passer en {ROLE_LABELS[r]}
                      </DropdownMenuItem>
                    ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleRemove(member.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <UserMinus className="mr-2 h-4 w-4" />
                    Retirer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      })}
    </div>
  );
}
