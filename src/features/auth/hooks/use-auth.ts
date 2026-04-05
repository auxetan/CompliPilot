'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { AuthUser } from '../types';

/**
 * Client-side hook to access the current authenticated user session.
 * Listens for auth state changes in real time.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();

    async function getUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        // Fetch profile for role and org info
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, role, org_id')
          .eq('id', authUser.id)
          .single();

        setUser({
          id: authUser.id,
          email: authUser.email ?? '',
          fullName: profile?.full_name ?? authUser.user_metadata?.full_name ?? null,
          avatarUrl: profile?.avatar_url ?? authUser.user_metadata?.avatar_url ?? null,
          role: profile?.role ?? 'member',
          orgId: (authUser.app_metadata?.org_id as string) ?? profile?.org_id ?? null,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Refresh user data on auth change
        getUser();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isLoading };
}
