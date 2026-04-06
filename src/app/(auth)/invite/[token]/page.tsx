import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerClient, getUser } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/admin';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invitation — CompliPilot',
};

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  const admin = createServiceRoleClient();

  // Find the invitation
  const { data: invitation } = await admin
    .from('invitations')
    .select('id, org_id, email, role, status, expires_at')
    .eq('token', token)
    .single();

  if (!invitation) return notFound();

  // Check if expired or already used
  const isExpired = new Date(invitation.expires_at) < new Date();
  const isUsed = invitation.status !== 'pending';

  if (isExpired || isUsed) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-8">
            <XCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">
              {isExpired ? 'Invitation expiree' : 'Invitation deja utilisee'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground text-center">
              {isExpired
                ? 'Cette invitation a expire. Demandez un nouveau lien a votre administrateur.'
                : 'Cette invitation a deja ete acceptee.'}
            </p>
            <Link href="/login" className="mt-4">
              <Button>Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get org name
  const { data: org } = await admin
    .from('organizations')
    .select('name')
    .eq('id', invitation.org_id)
    .single();

  // Check if user is logged in
  const user = await getUser();

  if (user) {
    // User is logged in — add them to the org directly
    const { data: profile } = await admin
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .single();

    // If already in this org, redirect
    if (profile?.org_id === invitation.org_id) {
      await admin.from('invitations').update({ status: 'accepted' }).eq('id', invitation.id);
      redirect('/dashboard');
    }

    // Add to org
    await admin
      .from('profiles')
      .update({ org_id: invitation.org_id, role: invitation.role })
      .eq('id', user.id);

    // Update app_metadata
    await admin.auth.admin.updateUserById(user.id, {
      app_metadata: { org_id: invitation.org_id },
    });

    // Mark invitation as accepted
    await admin.from('invitations').update({ status: 'accepted' }).eq('id', invitation.id);

    redirect('/dashboard');
  }

  // Not logged in — show signup/login prompt
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <CardTitle>Rejoindre {org?.name ?? 'une organisation'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Vous avez ete invite(e) a rejoindre <strong>{org?.name ?? 'une organisation'}</strong>{' '}
            sur CompliPilot en tant que <strong>{invitation.role}</strong>.
          </p>
          <div className="flex flex-col gap-2">
            <Link href={`/register?invite=${token}&email=${encodeURIComponent(invitation.email)}`}>
              <Button className="w-full">Creer un compte</Button>
            </Link>
            <Link href={`/login?invite=${token}`}>
              <Button variant="outline" className="w-full">
                Se connecter avec un compte existant
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
