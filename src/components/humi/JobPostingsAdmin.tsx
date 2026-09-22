import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import {
  createJobPosting,
  deleteJobPosting,
  getAllJobPostings,
  updateJobPosting,
} from "@/lib/api/jobs.functions";
import { getApplications } from "@/lib/api/applications.functions";
import type { FamilyKey, JobPosting, WorkType } from "@/lib/humi/types";

const FAMILIES: FamilyKey[] = [
  "sales",
  "marketing",
  "hr",
  "finance",
  "support",
  "operations",
  "it",
  "engineering",
  "product",
  "design",
  "data",
  "legal",
  "procurement",
  "admin",
  "education",
  "retail",
  "general",
];

const EMPTY = {
  title: "",
  company: "",
  companyBlurb: "",
  location: "",
  workType: "Hybrid" as WorkType,
  salary: "",
  description: "",
  responsibilities: "",
  requirements: "",
  aiTools: "",
  skills: "",
  families: [] as FamilyKey[],
  interviewDates: "",
  interviewSlots: "09:00, 10:30, 13:00, 15:00",
  interviewMode: "Video call" as JobPosting["interviewMode"],
};

const field =
  "w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary";
const split = (s: string) =>
  s
    .split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean);

export function JobPostingsAdmin() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["admin-job-postings"],
    queryFn: () => getAllJobPostings(),
  });
  const { data: apps = [] } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => getApplications(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-job-postings"] });
    queryClient.invalidateQueries({ queryKey: ["active-job-postings"] });
  };

  const createMutation = useMutation({
    mutationFn: createJobPosting,
    onSuccess: () => {
      invalidate();
      setForm(EMPTY);
      setShowForm(false);
      setError("");
    },
    onError: () => setError("Failed to publish the job posting. Please try again."),
  });

  const toggleMutation = useMutation({
    mutationFn: updateJobPosting,
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJobPosting,
    onSuccess: invalidate,
  });

  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.title.trim() || !form.company.trim() || !form.description.trim()) {
      setError("Title, company and description are required.");
      return;
    }
    createMutation.mutate({
      data: {
        title: form.title.trim(),
        company: form.company.trim(),
        companyBlurb:
          form.companyBlurb.trim() || `${form.company.trim()} is hiring at the job fair.`,
        location: form.location.trim() || "Not specified",
        workType: form.workType,
        salary: form.salary.trim() || "Salary discussed at interview",
        description: form.description.trim(),
        responsibilities: split(form.responsibilities),
        requirements: split(form.requirements),
        aiTools: form.aiTools.trim() || "AI tools introduced during onboarding.",
        skills: split(form.skills),
        families: form.families.length ? form.families : ["general"],
        interviewDates: split(form.interviewDates),
        interviewSlots: split(form.interviewSlots),
        interviewMode: form.interviewMode,
      },
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> {showForm ? "Close form" : "New job posting"}
        </button>
      </div>

      {showForm && (
        <div className="surface-card mt-5 space-y-3 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className={field}
              placeholder="Job title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
            <input
              className={field}
              placeholder="Company"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
            />
            <input
              className={field}
              placeholder="Location"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
            />
            <select
              className={field}
              value={form.workType}
              onChange={(e) => set("workType", e.target.value as WorkType)}
            >
              {["Onsite", "Hybrid", "Remote"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <input
              className={field}
              placeholder="Salary range"
              value={form.salary}
              onChange={(e) => set("salary", e.target.value)}
            />
            <select
              className={field}
              value={form.interviewMode}
              onChange={(e) => set("interviewMode", e.target.value as JobPosting["interviewMode"])}
            >
              {["Video call", "Onsite", "Phone call"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <textarea
            className={`${field} min-h-20`}
            placeholder="Job description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
          <textarea
            className={`${field} min-h-20`}
            placeholder="Responsibilities (one per line)"
            value={form.responsibilities}
            onChange={(e) => set("responsibilities", e.target.value)}
          />
          <textarea
            className={`${field} min-h-20`}
            placeholder="Requirements (one per line)"
            value={form.requirements}
            onChange={(e) => set("requirements", e.target.value)}
          />
          <input
            className={field}
            placeholder="About the company"
            value={form.companyBlurb}
            onChange={(e) => set("companyBlurb", e.target.value)}
          />
          <input
            className={field}
            placeholder="AI tools used in this role"
            value={form.aiTools}
            onChange={(e) => set("aiTools", e.target.value)}
          />
          <input
            className={field}
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={(e) => set("skills", e.target.value)}
          />
          <input
            className={field}
            placeholder="Interview dates (YYYY-MM-DD, comma separated)"
            value={form.interviewDates}
            onChange={(e) => set("interviewDates", e.target.value)}
          />
          <input
            className={field}
            placeholder="Interview time slots (comma separated)"
            value={form.interviewSlots}
            onChange={(e) => set("interviewSlots", e.target.value)}
          />

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Target career families
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {FAMILIES.map((f) => {
                const on = form.families.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() =>
                      set(
                        "families",
                        on ? form.families.filter((x) => x !== f) : [...form.families, f],
                      )
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${on ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-xs font-bold text-primary">{error}</p>}
          <button
            onClick={submit}
            disabled={createMutation.isPending}
            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {createMutation.isPending ? "Publishing…" : "Publish job posting"}
          </button>
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-tint text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {["Role", "Company", "Location", "Type", "Applicants", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold">{j.title}</td>
                <td className="px-4 py-3">{j.company}</td>
                <td className="px-4 py-3 text-muted-foreground">{j.location}</td>
                <td className="px-4 py-3">{j.workType}</td>
                <td className="px-4 py-3 font-bold text-primary">
                  {apps.filter((a) => a.jobId === j.id).length}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleMutation.mutate({ data: { id: j.id, active: !j.active } })}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${j.active ? "bg-tint text-primary" : "border border-border"}`}
                  >
                    {j.active ? "Active" : "Paused"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    aria-label={`Delete ${j.title}`}
                    onClick={() => deleteMutation.mutate({ data: { id: j.id } })}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && !jobs.length && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No job postings yet.
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
