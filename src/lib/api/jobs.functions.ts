import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseAdmin } from "../humi/supabase.server";
import { requireAdminSession } from "../humi/session.server";
import type { FamilyKey, JobPosting } from "../humi/types";

function rowToJob(row: Record<string, unknown>): JobPosting {
  return {
    id: row.id as string,
    title: row.title as string,
    company: row.company as string,
    companyBlurb: row.company_blurb as string,
    location: row.location as string,
    workType: row.work_type as JobPosting["workType"],
    salary: row.salary as string,
    description: row.description as string,
    responsibilities: (row.responsibilities as string[]) ?? [],
    requirements: (row.requirements as string[]) ?? [],
    aiTools: row.ai_tools as string,
    skills: (row.skills as string[]) ?? [],
    families: (row.families as FamilyKey[]) ?? [],
    interviewDates: (row.interview_dates as string[]) ?? [],
    interviewSlots: (row.interview_slots as string[]) ?? [],
    interviewMode: row.interview_mode as JobPosting["interviewMode"],
    active: row.active as boolean,
    createdAt: row.created_at as string,
  };
}

export const getActiveJobPostings = createServerFn({ method: "GET" }).handler(
  async (): Promise<JobPosting[]> => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToJob);
  },
);

export const getAllJobPostings = createServerFn({ method: "GET" }).handler(
  async (): Promise<JobPosting[]> => {
    await requireAdminSession();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToJob);
  },
);

const jobInputSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  companyBlurb: z.string(),
  location: z.string(),
  workType: z.enum(["Onsite", "Hybrid", "Remote"]),
  salary: z.string(),
  description: z.string().min(1),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  aiTools: z.string(),
  skills: z.array(z.string()),
  families: z.array(z.string()),
  interviewDates: z.array(z.string()),
  interviewSlots: z.array(z.string()),
  interviewMode: z.enum(["Video call", "Onsite", "Phone call"]),
});

export const createJobPosting = createServerFn({ method: "POST" })
  .validator((data: unknown) => jobInputSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const supabase = getSupabaseAdmin();
    const id = crypto.randomUUID();
    const { error } = await supabase.from("job_postings").insert({
      id,
      title: data.title,
      company: data.company,
      company_blurb: data.companyBlurb,
      location: data.location,
      work_type: data.workType,
      salary: data.salary,
      description: data.description,
      responsibilities: data.responsibilities,
      requirements: data.requirements,
      ai_tools: data.aiTools,
      skills: data.skills,
      families: data.families,
      interview_dates: data.interviewDates,
      interview_slots: data.interviewSlots,
      interview_mode: data.interviewMode,
      active: true,
    });
    if (error) throw new Error(`Failed to create job posting: ${error.message}`);
    return { ok: true as const, id };
  });

const updateJobInputSchema = z.object({
  id: z.string().min(1),
  active: z.boolean(),
});

export const updateJobPosting = createServerFn({ method: "POST" })
  .validator((data: unknown) => updateJobInputSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("job_postings")
      .update({ active: data.active })
      .eq("id", data.id);
    if (error) throw new Error(`Failed to update job posting: ${error.message}`);
    return { ok: true as const };
  });

const idInputSchema = z.object({ id: z.string().min(1) });

export const deleteJobPosting = createServerFn({ method: "POST" })
  .validator((data: unknown) => idInputSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("job_postings").delete().eq("id", data.id);
    if (error) throw new Error(`Failed to delete job posting: ${error.message}`);
    return { ok: true as const };
  });
