import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase admin client with the service role key.
 * WARNING: This bypasses RLS — use ONLY in server-side contexts
 * (Server Actions, Route Handlers, scripts). NEVER expose to the client.
 */
export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
