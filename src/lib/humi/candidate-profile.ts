import type { CandidateProfile, JobApplication } from "./types";

const PROFILE_KEY = "humi.profile.v1";
const APPLICATIONS_KEY = "humi.myApplications.v1";

export function getProfile(): CandidateProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as CandidateProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: CandidateProfile) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
}

// This device's own view of what it applied to — a real hiring team sees the
// authoritative record via the admin Applications tab (Supabase-backed); this
// local cache only lets the candidate's own browser show "Applied" without a
// login system to look that up from the server.
export type MyApplications = Record<
  string,
  Pick<JobApplication, "interviewDate" | "interviewTime" | "interviewMode">
>;

function readMyApplications(): MyApplications {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(APPLICATIONS_KEY) ?? "{}") as MyApplications;
  } catch {
    return {};
  }
}

export function getMyApplication(jobId: string) {
  return readMyApplications()[jobId] ?? null;
}

export function getMyApplications(): MyApplications {
  return readMyApplications();
}

export function cacheMyApplication(application: JobApplication) {
  if (typeof window === "undefined") return;
  const all = readMyApplications();
  all[application.jobId] = {
    interviewDate: application.interviewDate,
    interviewTime: application.interviewTime,
    interviewMode: application.interviewMode,
  };
  window.localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(all));
}
