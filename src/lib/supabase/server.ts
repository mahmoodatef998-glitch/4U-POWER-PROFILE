import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

const opts = { auth: { persistSession: false, autoRefreshToken: false } } as const;

let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

/** Read client (anon key, RLS-restricted to published rows). Null when Supabase is not configured. */
export function getPublicClient() {
  if (!url || !anon) return null;
  publicClient ??= createClient(url, anon, opts);
  return publicClient;
}

/** Service-role client for server actions only. Never import from client components. */
export function getAdminClient() {
  if (!url || !service) return null;
  adminClient ??= createClient(url, service, opts);
  return adminClient;
}
