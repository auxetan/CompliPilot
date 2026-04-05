import type { User } from '@supabase/supabase-js';

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  orgId: string | null;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  org_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  industry: string | null;
  country: string;
  employee_count: number | null;
  plan: 'free' | 'starter' | 'growth' | 'enterprise';
  compliance_score: number;
  created_at: string;
  updated_at: string;
}

/**
 * Maps a Supabase User + profile row to our AuthUser type.
 */
export function toAuthUser(user: User, profile: Profile | null): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: profile?.full_name ?? user.user_metadata?.full_name ?? null,
    avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
    role: profile?.role ?? 'member',
    orgId: (user.app_metadata?.org_id as string) ?? profile?.org_id ?? null,
  };
}

export interface AuthActionResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}
