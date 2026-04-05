'use client';

import { createBrowserClient as createClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in Client Components.
 * Uses browser cookies for session management.
 */
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
