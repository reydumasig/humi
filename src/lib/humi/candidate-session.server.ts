import { useSession } from "@tanstack/react-start/server";

export interface CandidateSessionData {
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
    name: "humi_candidate",
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

export function getCandidateSession() {
  // eslint-disable-next-line react-hooks/rules-of-hooks -- server-side h3 session helper, not a React hook
  return useSession<CandidateSessionData>(sessionConfig());
}

export async function requireCandidateSession() {
  const session = await getCandidateSession();
  if (!session.data.userId) {
    throw new Error("Not authenticated");
  }
  return session;
}
