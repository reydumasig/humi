import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, MapPin, Search, Sparkles } from "lucide-react";
import { getActiveJobPostings } from "@/lib/api/jobs.functions";
import { matchScore } from "@/lib/humi/jobs";
import { getMyApplications, getProfile, type MyApplications } from "@/lib/humi/candidate-profile";
import type { CandidateProfile } from "@/lib/humi/types";

const TYPES = ["All", "Onsite", "Hybrid", "Remote"] as const;

export function JobBoard() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [myApplications, setMyApplications] = useState<MyApplications>({});
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [bestFirst, setBestFirst] = useState(true);

  const {
    data: jobs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["active-job-postings"],
    queryFn: () => getActiveJobPostings(),
  });

  useEffect(() => {
    setProfile(getProfile());
    setMyApplications(getMyApplications());
  }, []);

  const list = useMemo(() => {
    const filtered = jobs.filter((j) => {
      const t = type === "All" || j.workType === type;
      const text = `${j.title} ${j.company} ${j.location} ${j.skills.join(" ")}`.toLowerCase();
      return t && text.includes(q.toLowerCase().trim());
    });
    return bestFirst && profile
      ? [...filtered].sort((a, b) => matchScore(b, profile) - matchScore(a, profile))
      : filtered;
  }, [jobs, q, type, bestFirst, profile]);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to your report
      </Link>

      <div className="brand-badge mt-5">Job matches</div>
      <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
        {profile
          ? `${profile.firstName}, here are roles that fit your plan`
          : "Open roles at the job fair"}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        {profile
          ? `Matched against your ${profile.futureRole} direction. Apply and pick an interview slot in a few taps.`
          : "Browse the companies hiring today. Complete your career profile for personalised match scores."}
      </p>

      <div className="mt-6 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search role, company or skill"
            className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-4 py-2 text-xs font-bold ${t === type ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}
            >
              {t}
            </button>
          ))}
          {profile && (
            <button
              onClick={() => setBestFirst((v) => !v)}
              className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold ${bestFirst ? "bg-tint text-primary" : "border border-border bg-card"}`}
            >
              <Sparkles className="h-3.5 w-3.5" /> Best matches first
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-6 text-sm text-destructive">
          Failed to load job postings. Try refreshing the page.
        </p>
      )}

      <div className="mt-7 grid gap-4">
        {list.map((j) => {
          const applied = myApplications[j.id];
          const score = matchScore(j, profile);
          return (
            <Link
              key={j.id}
              to="/jobs/$jobId"
              params={{ jobId: j.id }}
              className="surface-card block p-5 transition hover:border-primary/40"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-tint text-base font-extrabold text-primary">
                  {j.company.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-base font-extrabold leading-snug">{j.title}</p>
                    {profile && (
                      <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
                        {score}% match
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {j.company}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {j.location}
                    </span>
                    <span className="pill-tag">{j.workType}</span>
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{j.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {j.skills.slice(0, 4).map((s) => (
                      <span key={s} className="pill-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-bold text-primary">{j.salary}</p>
                  {applied && (
                    <p className="mt-2 text-xs font-bold text-primary">
                      Applied — interview {applied.interviewDate} at {applied.interviewTime}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
        {!isLoading && !list.length && (
          <div className="surface-card p-8 text-center text-sm text-muted-foreground">
            No roles match that search yet.
          </div>
        )}
        {isLoading && (
          <div className="surface-card p-8 text-center text-sm text-muted-foreground">
            Loading roles…
          </div>
        )}
      </div>
    </main>
  );
}
