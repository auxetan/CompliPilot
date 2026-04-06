'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils';
import type { AuthActionResult } from '../types';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  magicLinkSchema,
  resetPasswordSchema,
} from '@/lib/validations/auth';

/**
 * Server Action — Email/password login.
 */
export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Donnees invalides' };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }

  return { success: true, redirectTo: '/dashboard' };
}

/**
 * Server Action — User registration.
 * Creates Supabase auth user + profile + organization.
 */
export async function registerAction(formData: FormData): Promise<AuthActionResult> {
  const raw = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Donnees invalides' };
  }

  const supabase = await createServerClient();

  // 1. Create auth user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (signUpError) {
    if (signUpError.message.includes('already registered')) {
      return { success: false, error: 'Un compte existe deja avec cet email' };
    }
    return { success: false, error: 'Erreur lors de la creation du compte' };
  }

  if (!authData.user) {
    return { success: false, error: 'Erreur lors de la creation du compte' };
  }

  // 2. Create organization + profile using service role (bypasses RLS)
  const admin = createServiceRoleClient();

  const orgSlug = slugify(parsed.data.fullName + '-org');
  const { data: org, error: orgError } = await admin
    .from('organizations')
    .insert({
      name: `${parsed.data.fullName}'s Organization`,
      slug: `${orgSlug}-${Date.now()}`,
    })
    .select('id')
    .single();

  if (orgError || !org) {
    return { success: false, error: "Erreur lors de la creation de l'organisation" };
  }

  // 3. Create profile linked to org
  const { error: profileError } = await admin.from('profiles').insert({
    id: authData.user.id,
    email: parsed.data.email,
    full_name: parsed.data.fullName,
    role: 'owner',
    org_id: org.id,
  });

  if (profileError) {
    return { success: false, error: 'Erreur lors de la creation du profil' };
  }

  // 4. Set org_id in user's app_metadata for JWT claim
  await admin.auth.admin.updateUserById(authData.user.id, {
    app_metadata: { org_id: org.id },
  });

  return { success: true, redirectTo: '/verify-email' };
}

/**
 * Server Action — Logout.
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}

/**
 * Server Action — Forgot password (sends reset link).
 */
export async function forgotPasswordAction(formData: FormData): Promise<AuthActionResult> {
  const raw = { email: formData.get('email') };
  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Donnees invalides' };
  }

  const headersList = await headers();
  const origin = headersList.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

  const supabase = await createServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?type=recovery`,
  });

  if (error) {
    return { success: false, error: "Erreur lors de l'envoi du lien de reinitialisation" };
  }

  // Always return success to avoid email enumeration
  return { success: true };
}

/**
 * Server Action — Reset password (update password after clicking reset link).
 * User must already be authenticated via the recovery link session.
 */
export async function resetPasswordAction(formData: FormData): Promise<AuthActionResult> {
  const raw = {
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Donnees invalides' };
  }

  const supabase = await createServerClient();

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: 'Erreur lors de la reinitialisation du mot de passe' };
  }

  return { success: true, redirectTo: '/dashboard' };
}

/**
 * Server Action — Magic link login.
 */
export async function magicLinkAction(formData: FormData): Promise<AuthActionResult> {
  const raw = { email: formData.get('email') };
  const parsed = magicLinkSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Donnees invalides' };
  }

  const headersList = await headers();
  const origin = headersList.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: "Erreur lors de l'envoi du magic link" };
  }

  return { success: true };
}

/**
 * Server Action — Google OAuth (returns the URL to redirect to).
 */
export async function googleOAuthAction(): Promise<AuthActionResult> {
  const headersList = await headers();
  const origin = headersList.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return { success: false, error: 'Erreur lors de la connexion avec Google' };
  }

  return { success: true, redirectTo: data.url };
}

/**
 * Server Action — Complete onboarding (create/update organization).
 */
export async function completeOnboardingAction(formData: FormData): Promise<AuthActionResult> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Non authentifie' };
  }

  const orgId = user.app_metadata?.org_id as string | undefined;
  if (!orgId) {
    return { success: false, error: 'Organisation introuvable' };
  }

  const name = formData.get('name') as string;
  const industry = formData.get('industry') as string;
  const country = formData.get('country') as string;
  const employeeCount = Number(formData.get('employeeCount'));
  const regulations = formData.getAll('regulations') as string[];
  const aiToolRange = formData.get('aiToolRange') as string;

  const admin = createServiceRoleClient();

  const { error } = await admin
    .from('organizations')
    .update({
      name,
      slug: slugify(name) + '-' + Date.now(),
      industry,
      country,
      employee_count: employeeCount,
      metadata: { regulations, ai_tool_range: aiToolRange },
    })
    .eq('id', orgId);

  if (error) {
    return { success: false, error: "Erreur lors de la mise a jour de l'organisation" };
  }

  return { success: true, redirectTo: '/dashboard' };
}
