import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { createServerClient, getUser } from '@/lib/supabase/server';
import { ProfileForm } from '@/features/settings/components/profile-form';
import { ChangePasswordForm } from '@/features/settings/components/change-password-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil — CompliPilot',
  description: 'Gerez votre profil utilisateur',
};

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const supabase = await createServerClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profil"
        description="Gerez vos informations personnelles et vos preferences"
      />

      <ProfileForm
        profile={{
          fullName: profile?.full_name ?? null,
          email: profile?.email ?? user.email ?? '',
          avatarUrl: profile?.avatar_url ?? null,
        }}
      />

      <ChangePasswordForm />
    </div>
  );
}
