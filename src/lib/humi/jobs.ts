import type { CandidateProfile, JobPosting } from "./types";

export function matchScore(job: JobPosting, profile: CandidateProfile | null): number {
  if (!profile) return 0;
  let score = 50;
  if (profile.familyKey && job.families.includes(profile.familyKey)) score += 20;
  const hay =
    `${profile.skills.join(" ")} ${profile.interestRole} ${profile.futureRole} ${profile.currentRole} ${profile.primaryFunction}`.toLowerCase();
  const hits = job.skills.filter((s) => hay.includes(s.toLowerCase().split(" ")[0]!)).length;
  score += Math.min(hits * 6, 24);
  if (
    job.title
      .toLowerCase()
      .split(" ")
      .some((w) => w.length > 4 && hay.includes(w))
  )
    score += 6;
  return Math.min(score, 98);
}
