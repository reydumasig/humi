import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";

import type { Report, SignupData } from "@/lib/humi/types";

interface CareerProfileEmailPayload {
  signup: SignupData;
  report: Report;
  keywords?: string[];
  firstProject?: string;
  nextAction?: string;
}

function buildEmailHtml({
  signup,
  report,
  keywords,
  firstProject,
  nextAction,
}: CareerProfileEmailPayload) {
  const topSkills = report.skillGroups[0]?.skills.slice(0, 3).map((s) => s.name) ?? [];
  const topTools = report.tools.slice(0, 3).map((t) => t.name);
  const project = firstProject ?? report.path[1]?.items[0] ?? "";
  const action = nextAction ?? report.path[0]?.items[0] ?? "";

  const listItems = (items: string[]) =>
    items.map((i) => `<li style="margin:4px 0;">${i}</li>`).join("");

  return `
  <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
    <div style="text-align:center; padding: 24px 0 8px;">
      <span style="font-size: 22px; font-weight: 800; color: #7a1f2b;">Humi<span style="color:#1a1a1a;">.ai</span></span>
    </div>
    <p style="font-size:12px; text-transform:uppercase; letter-spacing:0.14em; color:#7a1f2b; font-weight:700; margin-bottom:4px;">Your Career Evolution Profile</p>
    <h1 style="font-size:20px; margin:0 0 16px;">${signup.firstName} ${signup.lastName}</h1>

    <div style="background:#f7ece7; border-radius:16px; padding:16px; margin-bottom:16px;">
      <p style="font-size:11px; text-transform:uppercase; letter-spacing:0.14em; color:#7a1f2b; font-weight:700; margin:0 0 4px;">Target role</p>
      <p style="font-size:16px; font-weight:800; margin:0;">${report.futureRole}</p>
      ${keywords?.length ? `<p style="font-size:12px; color:#555; margin:8px 0 0;">Job keywords: ${keywords.join(" · ")}</p>` : ""}
    </div>

    <table style="width:100%; border-collapse: collapse; margin-bottom:16px;">
      <tr>
        <td style="vertical-align:top; width:50%; padding-right:8px;">
          <p style="font-size:11px; text-transform:uppercase; letter-spacing:0.14em; color:#666; font-weight:700; margin:0 0 6px;">Top skills to learn</p>
          <ul style="margin:0; padding-left:18px; font-size:13px; font-weight:600;">${listItems(topSkills)}</ul>
        </td>
        <td style="vertical-align:top; width:50%; padding-left:8px;">
          <p style="font-size:11px; text-transform:uppercase; letter-spacing:0.14em; color:#666; font-weight:700; margin:0 0 6px;">Top AI tools</p>
          <ul style="margin:0; padding-left:18px; font-size:13px; font-weight:600;">${listItems(topTools)}</ul>
        </td>
      </tr>
    </table>

    <div style="border:1px solid #e5e0dd; border-radius:16px; padding:14px; margin-bottom:12px;">
      <p style="font-size:11px; text-transform:uppercase; letter-spacing:0.14em; color:#666; font-weight:700; margin:0 0 4px;">First project to build</p>
      <p style="font-size:13px; font-weight:600; margin:0;">${project}</p>
    </div>
    <div style="border:1px solid #e5e0dd; border-radius:16px; padding:14px; margin-bottom:16px;">
      <p style="font-size:11px; text-transform:uppercase; letter-spacing:0.14em; color:#666; font-weight:700; margin:0 0 4px;">Next 7-day action</p>
      <p style="font-size:13px; font-weight:600; margin:0;">${action}</p>
    </div>

    <div style="background:#f7ece7; border-radius:16px; padding:16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.14em; color:#7a1f2b; font-weight:700;">AI readiness score</span>
      <span style="font-size:22px; font-weight:800; color:#7a1f2b; float:right;">${report.aiReadiness}/100</span>
    </div>

    <p style="text-align:center; font-size:13px; font-weight:700; color:#7a1f2b; margin-bottom:24px;">
      "The future belongs to people who learn how to work with AI."
    </p>
    <p style="text-align:center; font-size:11px; color:#999;">Sent by Humi.ai</p>
  </div>`;
}

export const sendCareerProfileEmail = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as CareerProfileEmailPayload)
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    if (!data.signup.email) {
      throw new Error("Missing recipient email");
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Humi.ai <onboarding@resend.dev>",
      to: data.signup.email,
      subject: `${data.signup.firstName}, your Career Evolution Profile is ready`,
      html: buildEmailHtml(data),
    });

    if (error) {
      throw new Error(error.message);
    }

    return { ok: true as const };
  });
