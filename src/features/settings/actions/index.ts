'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerClient, getOrgId, getUser } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/admin';

// ────────────────────────────────────────────────
// Organization settings
// ────────────────────────────────────────────────

export async function updateOrganization(formData: FormData) {
  const orgId = await getOrgId();
  const user = await getUser();
  if (!orgId || !user) redirect('/login');

  const supabase = await createServerClient();

  const name = formData.get('name') as string;
  const industry = formData.get('industry') as string;
  const country = formData.get('country') as string;

  await supabase.from('organizations').update({ name, industry, country }).eq('id', orgId);

  // Audit log
  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: user.id,
    action: 'organization_updated',
    entity_type: 'organization',
    entity_id: orgId,
    details: { name, industry, country },
  });

  revalidatePath('/settings');
}

export async function updateRegulations(formData: FormData) {
  const orgId = await getOrgId();
  const user = await getUser();
  if (!orgId || !user) redirect('/login');

  const supabase = await createServerClient();

  const regulations = formData.getAll('regulations') as string[];

  // Get current metadata and merge
  const { data: org } = await supabase
    .from('organizations')
    .select('metadata')
    .eq('id', orgId)
    .single();

  const metadata = { ...((org?.metadata as Record<string, unknown>) ?? {}), regulations };

  await supabase.from('organizations').update({ metadata }).eq('id', orgId);

  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: user.id,
    action: 'regulations_updated',
    details: { regulations },
  });

  revalidatePath('/settings');
}

export async function updateNotificationPreferences(formData: FormData) {
  const orgId = await getOrgId();
  const user = await getUser();
  if (!orgId || !user) redirect('/login');

  const supabase = await createServerClient();

  const { data: org } = await supabase
    .from('organizations')
    .select('metadata')
    .eq('id', orgId)
    .single();

  const metadata = {
    ...((org?.metadata as Record<string, unknown>) ?? {}),
    notifications: {
      emailCritical: formData.get('emailCritical') === 'on',
      weeklyDigest: formData.get('weeklyDigest') === 'on',
      documentReminders: formData.get('documentReminders') === 'on',
    },
  };

  await supabase.from('organizations').update({ metadata }).eq('id', orgId);

  revalidatePath('/settings');
}

export async function deleteOrganization(formData: FormData) {
  const orgId = await getOrgId();
  const user = await getUser();
  if (!orgId || !user) redirect('/login');

  const confirmName = formData.get('confirmName') as string;

  const supabase = await createServerClient();
  const { data: org } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', orgId)
    .single();

  if (!org || org.name !== confirmName) {
    throw new Error('Le nom ne correspond pas');
  }

  // Check user is owner
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'owner') {
    throw new Error("Seul le proprietaire peut supprimer l'organisation");
  }

  const admin = createServiceRoleClient();
  await admin.from('organizations').delete().eq('id', orgId);

  redirect('/login');
}

// ────────────────────────────────────────────────
// Profile
// ────────────────────────────────────────────────

export async function updateProfile(formData: FormData) {
  const user = await getUser();
  if (!user) redirect('/login');

  const fullName = formData.get('fullName') as string;

  const supabase = await createServerClient();
  await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id);

  // Also update auth user_metadata
  await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  revalidatePath('/settings/profile');
}

export async function changePassword(formData: FormData) {
  const user = await getUser();
  if (!user) redirect('/login');

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || password.length < 8) {
    throw new Error('Le mot de passe doit contenir au moins 8 caracteres');
  }
  if (password !== confirmPassword) {
    throw new Error('Les mots de passe ne correspondent pas');
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error('Erreur lors du changement de mot de passe');
  }

  revalidatePath('/settings/profile');
}

export async function uploadAvatar(formData: FormData) {
  const user = await getUser();
  if (!user) redirect('/login');

  const file = formData.get('avatar') as File;
  if (!file || file.size === 0) return;
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Image trop volumineuse (max 2 Mo)');
  }

  const supabase = await createServerClient();
  const ext = file.name.split('.').pop() ?? 'png';
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });

  if (uploadError) throw new Error("Erreur lors de l'upload");

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);

  await supabase.from('profiles').update({ avatar_url: urlData.publicUrl }).eq('id', user.id);

  revalidatePath('/settings/profile');
}

// ────────────────────────────────────────────────
// Team
// ────────────────────────────────────────────────

export async function updateMemberRole(formData: FormData) {
  const orgId = await getOrgId();
  const user = await getUser();
  if (!orgId || !user) redirect('/login');

  const memberId = formData.get('memberId') as string;
  const role = formData.get('role') as string;

  if (!['admin', 'member', 'viewer'].includes(role)) {
    throw new Error('Role invalide');
  }

  const supabase = await createServerClient();

  // Check that current user is owner or admin
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!currentProfile || !['owner', 'admin'].includes(currentProfile.role)) {
    throw new Error('Permissions insuffisantes');
  }

  // Cannot change owner role
  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', memberId)
    .single();

  if (targetProfile?.role === 'owner') {
    throw new Error('Impossible de modifier le role du proprietaire');
  }

  await supabase.from('profiles').update({ role }).eq('id', memberId).eq('org_id', orgId);

  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: user.id,
    action: 'member_role_updated',
    entity_type: 'profile',
    entity_id: memberId,
    details: { newRole: role },
  });

  revalidatePath('/settings/team');
}

export async function removeMember(formData: FormData) {
  const orgId = await getOrgId();
  const user = await getUser();
  if (!orgId || !user) redirect('/login');

  const memberId = formData.get('memberId') as string;

  const supabase = await createServerClient();

  // Check permissions
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!currentProfile || !['owner', 'admin'].includes(currentProfile.role)) {
    throw new Error('Permissions insuffisantes');
  }

  // Cannot remove owner
  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', memberId)
    .single();

  if (targetProfile?.role === 'owner') {
    throw new Error('Impossible de retirer le proprietaire');
  }

  // Unlink from org
  await supabase
    .from('profiles')
    .update({ org_id: null, role: 'member' })
    .eq('id', memberId)
    .eq('org_id', orgId);

  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: user.id,
    action: 'member_removed',
    entity_type: 'profile',
    entity_id: memberId,
  });

  revalidatePath('/settings/team');
}

export async function inviteMember(formData: FormData) {
  const orgId = await getOrgId();
  const user = await getUser();
  if (!orgId || !user) redirect('/login');

  const email = (formData.get('email') as string).toLowerCase().trim();
  const role = formData.get('role') as string;

  if (!email || !['admin', 'member', 'viewer'].includes(role)) {
    throw new Error('Donnees invalides');
  }

  const supabase = await createServerClient();

  // Check permissions
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!currentProfile || !['owner', 'admin'].includes(currentProfile.role)) {
    throw new Error('Permissions insuffisantes');
  }

  // Check plan limit
  const { checkLimit } = await import('@/lib/stripe/limits');
  const limitCheck = await checkLimit(orgId, 'team_members');
  if (!limitCheck.allowed) {
    throw new Error('Limite de membres atteinte. Passez au plan superieur.');
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .eq('org_id', orgId)
    .limit(1);

  if (existing && existing.length > 0) {
    throw new Error("Cet utilisateur est deja membre de l'organisation");
  }

  // Check if pending invitation exists
  const { data: pendingInvite } = await supabase
    .from('invitations')
    .select('id')
    .eq('org_id', orgId)
    .eq('email', email)
    .eq('status', 'pending')
    .limit(1);

  if (pendingInvite && pendingInvite.length > 0) {
    throw new Error('Une invitation est deja en attente pour cet email');
  }

  // Create invitation
  const { data: invitation, error } = await supabase
    .from('invitations')
    .insert({
      org_id: orgId,
      email,
      role,
      invited_by: user.id,
    })
    .select('id, token')
    .single();

  if (error || !invitation) {
    throw new Error("Erreur lors de la creation de l'invitation");
  }

  // Send invitation email
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const { data: org } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', orgId)
      .single();

    await resend.emails.send({
      from: 'CompliPilot <noreply@complipilot.io>',
      to: email,
      subject: `Invitation a rejoindre ${org?.name ?? 'une organisation'} sur CompliPilot`,
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="font-family: Inter, sans-serif; background: #f8fafc; padding: 40px 0;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background: #0f172a; padding: 24px 32px;">
      <h1 style="color: #f8fafc; font-size: 18px; margin: 0;">CompliPilot</h1>
    </div>
    <div style="padding: 32px;">
      <p style="color: #334155; font-size: 14px;">Bonjour,</p>
      <p style="color: #334155; font-size: 14px;">Vous avez ete invite(e) a rejoindre <strong>${org?.name ?? 'une organisation'}</strong> sur CompliPilot en tant que <strong>${role}</strong>.</p>
      <a href="${appUrl}/invite/${invitation.token}" style="display: inline-block; background: #3b82f6; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; margin-top: 16px;">
        Accepter l'invitation
      </a>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Cette invitation expire dans 7 jours.</p>
    </div>
  </div>
</body>
</html>`,
    });
  } catch {
    // Email failure should not block invitation creation
  }

  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: user.id,
    action: 'invitation_sent',
    details: { email, role },
  });

  revalidatePath('/settings/team');
}

export async function cancelInvitation(formData: FormData) {
  const orgId = await getOrgId();
  if (!orgId) redirect('/login');

  const invitationId = formData.get('invitationId') as string;

  const supabase = await createServerClient();
  await supabase
    .from('invitations')
    .update({ status: 'canceled' })
    .eq('id', invitationId)
    .eq('org_id', orgId);

  revalidatePath('/settings/team');
}
