import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseAdmin } from "../humi/supabase.server";
import { requireAdminSession } from "../humi/session.server";

export interface HelpRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  createdAt: string;
}

function rowToHelpRequest(row: Record<string, unknown>): HelpRequest {
  return {
    id: row.id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    email: row.email as string,
    phone: (row.phone as string) ?? "",
    topic: row.topic as string,
    message: (row.message as string) ?? "",
    createdAt: row.created_at as string,
  };
}

const helpRequestInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  topic: z.string().min(1),
  message: z.string(),
});

export const submitHelpRequest = createServerFn({ method: "POST" })
  .validator((data: unknown) => helpRequestInputSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("help_requests").insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      topic: data.topic,
      message: data.message,
    });
    if (error) throw new Error(`Failed to submit help request: ${error.message}`);
    return { ok: true as const };
  });

export const getHelpRequests = createServerFn({ method: "GET" }).handler(
  async (): Promise<HelpRequest[]> => {
    await requireAdminSession();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("help_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToHelpRequest);
  },
);
