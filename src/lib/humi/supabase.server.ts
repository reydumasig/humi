import { createClient } from "@supabase/supabase-js";

// Server-only: uses the service_role key, which bypasses row-level security.
// Never import this from a file that ships to the client.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
