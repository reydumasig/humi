import { createServerFn } from "@tanstack/react-start";

import { getSupabaseAdmin } from "../humi/supabase.server";
import { requireAdminSession } from "../humi/session.server";

const RESUME_BUCKET = "resumes";

export const submitLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected form data");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();

    const firstName = String(data.get("firstName") ?? "");
    const lastName = String(data.get("lastName") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const careerStage = String(data.get("careerStage") ?? "");
    const recommendedRole = String(data.get("recommendedRole") ?? "");
    const careerInterest = String(data.get("careerInterest") ?? "");
    const aiReadiness = Number(data.get("aiReadiness") ?? 0);
    const file = data.get("resume");

    let resumePath: string | null = null;
    let resumeFileName: string | null = null;

    if (file instanceof File && file.size > 0) {
      resumeFileName = file.name;
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      resumePath = `${crypto.randomUUID()}/${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from(RESUME_BUCKET)
        .upload(resumePath, file, { contentType: file.type || undefined });
      if (uploadError) {
        throw new Error(`Resume upload failed: ${uploadError.message}`);
      }
    }

    const { error } = await supabase.from("candidates").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      career_stage: careerStage,
      resume_path: resumePath,
      resume_file_name: resumeFileName,
      recommended_role: recommendedRole,
      career_interest: careerInterest,
      ai_readiness: aiReadiness,
    });
    if (error) {
      throw new Error(`Failed to save candidate: ${error.message}`);
    }

    return { ok: true as const };
  });

export const getLeads = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  return Promise.all(
    rows.map(async (row) => {
      let resumeUrl: string | null = null;
      if (row.resume_path) {
        const { data: signed } = await supabase.storage
          .from(RESUME_BUCKET)
          .createSignedUrl(row.resume_path, 3600);
        resumeUrl = signed?.signedUrl ?? null;
      }
      return {
        id: row.id as string,
        firstName: row.first_name as string,
        lastName: row.last_name as string,
        email: row.email as string,
        phone: row.phone as string,
        careerStage: row.career_stage as string,
        resumeFileName: row.resume_file_name as string | null,
        resumeUrl,
        recommendedRole: row.recommended_role as string,
        careerInterest: row.career_interest as string,
        aiReadiness: row.ai_readiness as number,
        createdAt: row.created_at as string,
      };
    }),
  );
});
