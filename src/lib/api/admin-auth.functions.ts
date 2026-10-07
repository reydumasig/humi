import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseAdmin } from "../humi/supabase.server";
import { getAdminSession } from "../humi/session.server";

export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email(), password: z.string().min(1) }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const { data: auth, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error || !auth.user) {
      throw new Error("Invalid email or password.");
    }

    // Being a valid Supabase Auth user (which a candidate account also is)
    // is not enough — only accounts explicitly allow-listed in admin_users
    // may hold an admin session. This check needs its own fresh client:
    // signInWithPassword above mutated `supabase`'s session, so a `.from()`
    // call on that same client would run as the just-authenticated user
    // (not the service role), and RLS — enabled with no policies — would
    // silently return zero rows regardless of what's actually in the table.
    const { data: adminRow } = await getSupabaseAdmin()
      .from("admin_users")
      .select("role")
      .eq("user_id", auth.user.id)
      .maybeSingle();
    if (!adminRow) {
      throw new Error("This account doesn't have admin access.");
    }

    const session = await getAdminSession();
    await session.update({
      userId: auth.user.id,
      email: auth.user.email ?? data.email,
      role: adminRow.role as "owner" | "admin",
    });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const getAdminMe = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  return session.data.userId ? { email: session.data.email, role: session.data.role } : null;
});
