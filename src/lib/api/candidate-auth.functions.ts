import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseAdmin } from "../humi/supabase.server";
import { getCandidateSession } from "../humi/candidate-session.server";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const candidateSignup = createServerFn({ method: "POST" })
  .validator((data: unknown) => credentialsSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();

    // No public signUp flow is wired up (no anon key, no email-confirmation
    // delivery), so account creation goes through the same admin API the
    // admin accounts already use, with email_confirm set so there is no
    // confirmation step to get stuck on.
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (createError) {
      if (createError.message.toLowerCase().includes("already")) {
        throw new Error("An account with this email already exists. Try logging in instead.");
      }
      throw new Error(createError.message);
    }

    const session = await getCandidateSession();
    await session.update({ userId: created.user.id, email: created.user.email ?? data.email });
    return { ok: true as const };
  });

export const candidateLogin = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ email: z.string().email(), password: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const { data: auth, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error || !auth.user) {
      throw new Error("Invalid email or password.");
    }

    const session = await getCandidateSession();
    await session.update({ userId: auth.user.id, email: auth.user.email ?? data.email });
    return { ok: true as const };
  });

export const candidateLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getCandidateSession();
  await session.clear();
  return { ok: true as const };
});

export const getCandidateMe = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getCandidateSession();
  return session.data.userId ? { email: session.data.email } : null;
});
