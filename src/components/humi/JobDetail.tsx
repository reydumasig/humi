import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Banknote, Building2, MapPin, Sparkles } from "lucide-react";
import { getActiveJobPostings } from "@/lib/api/jobs.functions";
import { matchScore } from "@/lib/humi/jobs";
import { getMyApplication, getProfile } from "@/lib/humi/candidate-profile";
import { ApplyDialog } from "./ApplyDialog";
import type { CandidateProfile, JobApplication } from "@/lib/humi/types";

export function JobDetail({ jobId }: { jobId: string }) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [application, setApplication] = useState<Pick<
    JobApplication,
    "interviewDate" | "interviewTime" | "interviewMode"
  > | null>(null);
  const [open, setOpen] = useState(false);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["active-job-postings"],
    queryFn: () => getActiveJobPostings(),
  });
  const job = jobs.find((j) => j.id === jobId) ?? null;

  useEffect(() => {
    setProfile(getProfile());
    setApplication(getMyApplication(jobId));
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="px-5 py-20 text-center text-sm text-muted-foreground">Loading role…</div>
    );
  }

  if (!job) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-2xl font-extrabold">This role is no longer listed</h1>
        <Link
          to="/jobs"
          className="mt-5 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          Back to all jobs
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All jobs
      </Link>

      <div className="mt-5 flex items-start gap-4">
        <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tint text-xl font-extrabold text-primary">
          {job.company.charAt(0)}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{job.title}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {job.company}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Banknote className="h-3.5 w-3.5" />
              {job.salary}
            </span>
            <span className="pill-tag">{job.workType}</span>
          </p>
        </div>
      </div>

      {profile && (
        <div className="tint-card mt-5 flex items-center gap-3 p-4 text-sm">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          <p>
            <span className="font-bold text-primary">{matchScore(job, profile)}% match</span> with
            your {profile.futureRole} direction.
          </p>
        </div>
      )}

      <div className="surface-card mt-6 p-6">
        <p className="text-sm leading-relaxed text-muted-foreground">{job.description}</p>

        <p className="mt-6 text-sm font-extrabold">What you'll do</p>
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          {job.responsibilities.map((r) => (
            <li key={r}>• {r}</li>
          ))}
        </ul>

        <p className="mt-6 text-sm font-extrabold">What they're looking for</p>
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          {job.requirements.map((r) => (
            <li key={r}>• {r}</li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl bg-tint p-4 text-sm">
          <span className="font-bold text-primary">AI tools used in this role: </span>
          <span className="text-muted-foreground">{job.aiTools}</span>
        </div>

        <p className="mt-6 text-sm font-extrabold">About {job.company}</p>
        <p className="mt-2 text-sm text-muted-foreground">{job.companyBlurb}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {job.skills.map((s) => (
            <span key={s} className="pill-tag">
              {s}
            </span>
          ))}
        </div>
      </div>

      {application ? (
        <div className="tint-card mt-6 p-5 text-sm">
          <p className="font-extrabold text-primary">Applied — interview booked</p>
          <p className="mt-1 text-muted-foreground">
            {application.interviewDate} at {application.interviewTime} · {application.interviewMode}
          </p>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="mt-6 w-full rounded-full bg-primary px-6 py-4 text-sm font-bold text-primary-foreground"
        >
          Apply & book interview
        </button>
      )}

      <ApplyDialog job={job} open={open} onOpenChange={setOpen} onBooked={setApplication} />
    </main>
  );
}
