import { useSession } from "@tanstack/react-start/server";

export interface AdminSessionData {
  userId: string;
  email: string;
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
  return session;
}
