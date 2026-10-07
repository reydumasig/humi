import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseAdmin } from "../humi/supabase.server";
import { requireOwnerSession } from "../humi/session.server";

export interface AdminUser {
  userId: string;
  email: string;
  role: "owner" | "admin";
  createdAt: string;
}

export const getAdminUsers = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminUser[]> => {
    await requireOwnerSession();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({
      userId: row.user_id as string,
      email: row.email as string,
      role: row.role as "owner" | "admin",
      createdAt: row.created_at as string,
    }));
  },
);

const inviteSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["owner", "admin"]),
});

export const inviteAdminUser = createServerFn({ method: "POST" })
  .validator((data: unknown) => inviteSchema.parse(data))
  .handler(async ({ data }) => {
    await requireOwnerSession();
    const supabase = getSupabaseAdmin();

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (createError) {
      if (createError.message.toLowerCase().includes("already")) {
        throw new Error("An account with this email already exists.");
      }
      throw new Error(createError.message);
    }

    const { error: insertError } = await supabase.from("admin_users").insert({
      user_id: created.user.id,
      email: created.user.email ?? data.email,
      role: data.role,
    });
    if (insertError) throw new Error(`Failed to grant admin access: ${insertError.message}`);
    return { ok: true as const };
  });

const removeSchema = z.object({ userId: z.string().min(1) });

export const removeAdminUser = createServerFn({ method: "POST" })
  .validator((data: unknown) => removeSchema.parse(data))
  .handler(async ({ data }) => {
    const ownerSession = await requireOwnerSession();
    if (ownerSession.data.userId === data.userId) {
      throw new Error("You can't remove your own admin access.");
    }
    const supabase = getSupabaseAdmin();
    // Only revokes admin access (removes the admin_users row) — the
    // underlying Supabase Auth account is left alone, which is the less
    // destructive option and keeps this reversible with inviteAdminUser.
    const { error } = await supabase.from("admin_users").delete().eq("user_id", data.userId);
    if (error) throw new Error(`Failed to remove admin access: ${error.message}`);
    return { ok: true as const };
  });
