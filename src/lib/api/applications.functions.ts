import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseAdmin } from "../humi/supabase.server";
import { requireAdminSession } from "../humi/session.server";
import type { JobApplication } from "../humi/types";

function rowToApplication(row: Record<string, unknown>): JobApplication {
  return {
    id: row.id as string,
    jobId: row.job_id as string,
    jobTitle: row.job_title as string,
    company: row.company as string,
    candidateName: row.candidate_name as string,
    email: row.email as string,
    phone: (row.phone as string) ?? "",
    note: (row.note as string) ?? "",
    interviewDate: row.interview_date as string,
    interviewTime: row.interview_time as string,
    interviewMode: row.interview_mode as string,
    createdAt: row.created_at as string,
  };
}

const applicationInputSchema = z.object({
  jobId: z.string().min(1),
  jobTitle: z.string(),
  company: z.string(),
  candidateName: z.string().min(1),
  email: z.string().min(1),
  phone: z.string(),
  note: z.string(),
  interviewDate: z.string().min(1),
  interviewTime: z.string().min(1),
  interviewMode: z.string(),
});

export const submitApplication = createServerFn({ method: "POST" })
  .validator((data: unknown) => applicationInputSchema.parse(data))
  .handler(async ({ data }): Promise<JobApplication> => {
    const supabase = getSupabaseAdmin();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const { error } = await supabase.from("job_applications").insert({
      id,
      job_id: data.jobId,
      job_title: data.jobTitle,
      company: data.company,
      candidate_name: data.candidateName,
      email: data.email,
      phone: data.phone,
      note: data.note,
      interview_date: data.interviewDate,
      interview_time: data.interviewTime,
      interview_mode: data.interviewMode,
      created_at: createdAt,
    });
    if (error) throw new Error(`Failed to submit application: ${error.message}`);
    return {
      id,
      jobId: data.jobId,
      jobTitle: data.jobTitle,
      company: data.company,
      candidateName: data.candidateName,
      email: data.email,
      phone: data.phone,
      note: data.note,
      interviewDate: data.interviewDate,
      interviewTime: data.interviewTime,
      interviewMode: data.interviewMode,
      createdAt,
    };
  });

export const getApplications = createServerFn({ method: "GET" }).handler(
  async (): Promise<JobApplication[]> => {
    await requireAdminSession();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToApplication);
  },
);
