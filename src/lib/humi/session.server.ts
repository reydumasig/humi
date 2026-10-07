import { useSession } from "@tanstack/react-start/server";
import { getSupabaseAdmin } from "./supabase.server";

export type AdminRole = "owner" | "admin";

export interface AdminSessionData {
  userId: string;
  email: string;
  role: AdminRole;
}

function sessionConfig() {
  const password = process.env.SESSION_SECRET;
  if (!password) {
    throw new Error("SESSION_SECRET is not configured");
  }
  return {
    password,
    name: "humi_admin",
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

export function getAdminSession() {
  // eslint-disable-next-line react-hooks/rules-of-hooks -- server-side h3 session helper, not a React hook
  return useSession<AdminSessionData>(sessionConfig());
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session.data.userId) {
    throw new Error("Not authenticated");
  }

  // The session alone isn't proof of current access: an owner can revoke an
  // admin from the Team tab at any time, and that must take effect on this
  // session's very next request, not just block future logins. Re-check the
  // allowlist on every use rather than trusting what was true at login time.
  const { data: adminRow } = await getSupabaseAdmin()
    .from("admin_users")
    .select("role")
    .eq("user_id", session.data.userId)
    .maybeSingle();
  if (!adminRow) {
    await session.clear();
    throw new Error("Not authenticated");
  }
  if (adminRow.role !== session.data.role) {
    await session.update({ ...session.data, role: adminRow.role as AdminRole });
  }

  return session;
}

export async function requireOwnerSession() {
  const session = await requireAdminSession();
  if (session.data.role !== "owner") {
    throw new Error("Only an owner can do this.");
  }
  return session;
}
