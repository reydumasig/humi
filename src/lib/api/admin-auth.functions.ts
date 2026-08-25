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

    const session = await getAdminSession();
    await session.update({ userId: auth.user.id, email: auth.user.email ?? data.email });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const getAdminMe = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  return session.data.userId ? { email: session.data.email } : null;
});
