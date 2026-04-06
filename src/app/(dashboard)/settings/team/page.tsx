import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerClient, getOrgId, getUser } from '@/lib/supabase/server';
import { TeamMembersList } from '@/features/settings/components/team-members-list';
import { InviteMemberDialog } from '@/features/settings/components/invite-member-dialog';
import { PendingInvitations } from '@/features/settings/components/pending-invitations';
import { Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Equipe — CompliPilot',
  description: 'Gerez les membres de votre equipe',
};

export default async function TeamPage() {
  const orgId = await getOrgId();
  const user = await getUser();
  if (!orgId || !user) redirect('/onboarding');

  const supabase = await createServerClient();

  // Fetch current user role
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const currentUserRole = currentProfile?.role ?? 'viewer';
  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin';

  // Fetch team members
  const { data: rawMembers } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, role, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: true });

  const members = (rawMembers ?? []).map((m) => ({
    id: m.id,
    email: m.email,
    fullName: m.full_name,
    avatarUrl: m.avatar_url,
    role: m.role,
    createdAt: m.created_at,
  }));

  // Fetch pending invitations
  const { data: rawInvitations } = await supabase
    .from('invitations')
    .select('id, email, role, created_at')
    .eq('org_id', orgId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  const invitations = (rawInvitations ?? []).map((i) => ({
    id: i.id,
    email: i.email,
    role: i.role,
    createdAt: i.created_at,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Equipe"
        description="Gerez les membres de votre organisation"
        actions={canManage ? <InviteMemberDialog /> : undefined}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" aria-hidden="true" />
            Membres ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMembersList
            members={members}
            currentUserId={user.id}
            currentUserRole={currentUserRole}
          />
        </CardContent>
      </Card>

      {canManage && invitations.length > 0 && <PendingInvitations invitations={invitations} />}
    </div>
  );
}
