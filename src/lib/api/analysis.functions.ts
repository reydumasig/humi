import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

import { getAnthropicClient, CLAUDE_MODEL } from "../ai/anthropic.server";
import {
  ResumeAnalysisSchema,
  CoreReportSchema,
  ResumeFeedbackSchema,
  RolesAndPlanSchema,
  type CoreReportOutput,
  type ResumeFeedbackOutput,
  type RolesAndPlanOutput,
} from "../ai/schemas";
import {
  GAP_CATEGORIES,
  READINESS_LABELS,
  SCORE_LABELS,
  MATRIX_SECTIONS,
  ANSWER_STRUCTURE,
  SAFETY_TIPS,
  GAP_WHY,
  SCORE_EXPLAINERS,
  PATH_OUTPUTS,
  STATIC_TOOL_GROUPS,
  statusFor,
} from "../ai/static-content";
import {
  parseResume as fallbackParseResume,
  buildReport as fallbackBuildReport,
  getRecommendations as fallbackGetRecommendations,
} from "../humi/engine";
import {
  buildCounselling as fallbackBuildCounselling,
  type Counselling,
  type ReadinessItem,
} from "../humi/counselling";
import type { InterestData, ParsedResume, Recommendation, Report, SignupData } from "../humi/types";

const signupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  careerStage: z.string(),
  consent: z.boolean(),
});

const analyzeInputSchema = z.object({
  resumeText: z.string().optional(),
  manual: z.object({
    recentRole: z.string(),
    experienceSummary: z.string(),
    keySkills: z.string(),
    industries: z.string(),
  }),
  signup: signupSchema,
});

function fallbackAnalyze(data: z.infer<typeof analyzeInputSchema>) {
  const parsed = fallbackParseResume(
    { ...data.manual, resumeText: data.resumeText },
    data.signup as SignupData,
  );
  const recommendations = fallbackGetRecommendations(parsed.familyKey);
  return { parsed, recommendations };
}

export const analyzeResume = createServerFn({ method: "POST" })
  .validator(analyzeInputSchema)
  .handler(
    async ({ data }): Promise<{ parsed: ParsedResume; recommendations: Recommendation[] }> => {
      const resumeText = (data.resumeText ?? "").trim();
      const manualBlob = [
        data.manual.recentRole,
        data.manual.experienceSummary,
        data.manual.keySkills,
        data.manual.industries,
      ]
        .filter(Boolean)
        .join("\n");

      if (!resumeText && !manualBlob) {
        return fallbackAnalyze(data);
      }

      try {
        const client = getAnthropicClient();
        const response = await client.messages.parse({
          model: CLAUDE_MODEL,
          max_tokens: 8000,
          thinking: { type: "adaptive" },
          output_config: { format: zodOutputFormat(ResumeAnalysisSchema), effort: "high" },
          system:
            "You are a career analyst for an AI-career-evolution platform. Read this candidate's resume " +
            "and produce an honest, specific analysis. Calibrate everything to their ACTUAL seniority and " +
            "evidenced skills — a 10-year veteran and a fresh graduate must get visibly different depth, role " +
            "ambition and vocabulary. Recommend roles appropriately ambitious for their real level: never " +
            "recommend entry-level roles to a senior expert, and never recommend roles beyond what a junior " +
            "candidate's evidence supports. Never output generic filler — every sentence should reflect this " +
            "specific resume, not a template.",
          messages: [
            {
              role: "user",
              content: [
                `Candidate self-reported career stage: ${data.signup.careerStage || "not specified"}`,
                resumeText ? `Resume text:\n${resumeText}` : null,
                manualBlob ? `Manually entered background:\n${manualBlob}` : null,
              ]
                .filter(Boolean)
                .join("\n\n"),
            },
          ],
        });

        const out = response.parsed_output;
        if (!out) throw new Error("Model did not return parseable output");

        const parsed: ParsedResume = {
          recentRole: out.recentRole,
          primaryFunction: out.primaryFunction,
          yearsExperience: out.yearsExperience,
          industryExposure: out.industryExposure,
          summary: out.summary,
          skills: out.skills,
        };

        return { parsed, recommendations: out.recommendations };
      } catch (error) {
        console.error("analyzeResume: falling back to deterministic engine", error);
        return fallbackAnalyze(data);
      }
    },
  );

const parsedResumeSchema = z.object({
  fileName: z.string().optional(),
  recentRole: z.string(),
  primaryFunction: z.string(),
  yearsExperience: z.string(),
  industryExposure: z.string(),
  summary: z.string(),
  skills: z.array(z.string()),
});

const interestSchema = z.object({
  chosenRole: z.string(),
  notes: z.string(),
  industry: z.string(),
});

const reportInputSchema = z.object({
  parsed: parsedResumeSchema,
  interest: interestSchema,
  signup: signupSchema,
});

// These read as narrower cuts of content already generated elsewhere
// (automate/assist, tools, chosen role) — deriving them in code instead of
// asking the model to regenerate similar content saves a full field's worth
// of generation on every report, without an extra API call.
function deriveDailyWork(
  automate: string[],
  assist: string[],
): { before: string; after: string }[] {
  const pairs = assist.slice(0, 2).map((task) => ({
    before: `Manually handling ${task.toLowerCase()}`,
    after: "AI drafts it first — you review, refine and finalize",
  }));
  const automated = automate.slice(0, 1).map((task) => ({
    before: `Doing ${task.toLowerCase()} by hand`,
    after: "Automated — you spend that time on higher-judgment work",
  }));
  return [...pairs, ...automated];
}

function derivePracticePrompts(chosenRole: string): string[] {
  const role = chosenRole || "your target";
  return [
    `Act as an interviewer for a ${role} role. Ask me one question at a time and give feedback on my answer.`,
    `Give me five behavioral interview questions for a ${role} role and score my answers out of 10.`,
    `Here is my answer to "tell me about yourself." Make it 60 seconds, clearer and more specific.`,
  ];
}

function deriveResumeHighlight(tools: CoreReportOutput["tools"]): string[] {
  return tools.slice(0, 5).map((t) => t.name);
}

function assembleReport(
  core: CoreReportOutput,
  resumeFeedback: ResumeFeedbackOutput,
  rolesAndPlan: RolesAndPlanOutput,
  interest: InterestData,
): { report: Report; counselling: Counselling } {
  const gapsAnalysis = GAP_CATEGORIES.map(({ key, label }) => {
    const g = core.gapsAnalysis.find((entry) => entry.key === key)!;
    return { category: label, level: g.level, score: g.score, nextStep: g.nextStep };
  });

  const scores = SCORE_LABELS.map(({ key, label }) => {
    const s = core.scores.find((entry) => entry.key === key)!;
    return { label, value: s.value, note: s.note };
  });

  const report: Report = {
    startingPoint: core.startingPoint,
    strengths: core.strengths,
    gaps: core.gaps,
    currentRole: core.currentRole,
    futureRole: core.futureRole,
    evolutionExplanation: core.evolutionExplanation,
    automate: core.automate,
    assist: core.assist,
    human: core.human,
    gapsAnalysis,
    skillGroups: core.skillGroups,
    tools: core.tools,
    path: core.path,
    scores,
    aiReadiness: scores.find((s) => s.label === "AI Readiness")!.value,
    resumeBullets: resumeFeedback.bulletsNow,
  };

  const readiness: ReadinessItem[] = READINESS_LABELS.map(({ key, label }) => {
    const r = resumeFeedback.readiness.find((entry) => entry.key === key)!;
    return { label, score: r.score, status: statusFor(r.score), recommendation: r.recommendation };
  });
  const readinessAverage = Math.round(
    readiness.reduce((n, r) => n + r.score, 0) / readiness.length,
  );

  const matrix = MATRIX_SECTIONS.map(({ key, title, note }) => {
    const m = rolesAndPlan.matrixItems.find((entry) => entry.key === key)!;
    return { title, note, items: m.items };
  });

  const toolGroups = [
    STATIC_TOOL_GROUPS.mustLearnFirst,
    {
      title: `Useful for ${interest.chosenRole || report.futureRole}`,
      note: "Directly relevant to the role you are targeting.",
      tools: rolesAndPlan.roleTools,
    },
    STATIC_TOOL_GROUPS.exploreLater,
  ];

  const counselling: Counselling = {
    readiness,
    readinessAverage,
    resumeAdd: resumeFeedback.resumeAdd,
    resumeReduce: resumeFeedback.resumeReduce,
    resumeMeasurable: resumeFeedback.resumeMeasurable,
    resumeHighlight: deriveResumeHighlight(core.tools),
    resumeHonesty: resumeFeedback.resumeHonesty,
    rewrites: resumeFeedback.rewrites,
    targetRoles: rolesAndPlan.targetRoles,
    matrix,
    projects: rolesAndPlan.projects,
    intro: rolesAndPlan.intro,
    interviewQuestions: rolesAndPlan.interviewQuestions,
    answerStructure: ANSWER_STRUCTURE,
    practicePrompts: derivePracticePrompts(interest.chosenRole),
    keywords: rolesAndPlan.keywords,
    safety: SAFETY_TIPS,
    starterPrompts: rolesAndPlan.starterPrompts,
    sevenDays: rolesAndPlan.sevenDays,
    dailyWork: deriveDailyWork(core.automate, core.assist),
    gapWhy: GAP_WHY,
    toolGroups,
    pathOutputs: PATH_OUTPUTS,
    scoreExplainers: SCORE_EXPLAINERS,
    bulletsNow: resumeFeedback.bulletsNow,
    bulletsEarned: rolesAndPlan.projects.map((p) => p.bullet),
  };

  return { report, counselling };
}

function fallbackGenerate(data: z.infer<typeof reportInputSchema>) {
  const report = fallbackBuildReport(
    data.parsed as ParsedResume,
    data.interest,
    data.signup as SignupData,
  );
  const counselling = fallbackBuildCounselling(
    data.parsed as ParsedResume,
    data.interest,
    data.signup as SignupData,
    report,
  );
  return { report, counselling };
}

const REPORT_SYSTEM_PROMPT =
  "You are a career counsellor generating part of a personalized AI-career-evolution report. " +
  "Calibrate every section to this specific candidate's ACTUAL seniority and evidenced skills — " +
  "a senior expert should see advanced, ambitious content; a junior candidate should see " +
  "foundational, encouraging content. Never write generic, one-size-fits-all advice — every " +
  "recommendation, project, and bullet point must plausibly connect to THIS candidate's real " +
  "background and chosen direction. Be concrete and specific, not vague.";

export const generateCareerReport = createServerFn({ method: "POST" })
  .validator(reportInputSchema)
  .handler(async ({ data }): Promise<{ report: Report; counselling: Counselling }> => {
    try {
      const client = getAnthropicClient();
      const userContent = JSON.stringify({
        candidateBackground: data.parsed,
        chosenDirection: data.interest,
        careerStage: data.signup.careerStage,
      });

      const [coreResponse, resumeFeedbackResponse, rolesAndPlanResponse] = await Promise.all([
        client.messages.parse({
          model: CLAUDE_MODEL,
          max_tokens: 16000,
          thinking: { type: "adaptive" },
          output_config: { format: zodOutputFormat(CoreReportSchema), effort: "high" },
          system: REPORT_SYSTEM_PROMPT,
          messages: [{ role: "user", content: userContent }],
        }),
        client.messages.parse({
          model: CLAUDE_MODEL,
          max_tokens: 16000,
          thinking: { type: "adaptive" },
          output_config: { format: zodOutputFormat(ResumeFeedbackSchema), effort: "high" },
          system: REPORT_SYSTEM_PROMPT,
          messages: [{ role: "user", content: userContent }],
        }),
        client.messages.parse({
          model: CLAUDE_MODEL,
          max_tokens: 16000,
          thinking: { type: "adaptive" },
          output_config: { format: zodOutputFormat(RolesAndPlanSchema), effort: "high" },
          system: REPORT_SYSTEM_PROMPT,
          messages: [{ role: "user", content: userContent }],
        }),
      ]);

      const core = coreResponse.parsed_output;
      const resumeFeedback = resumeFeedbackResponse.parsed_output;
      const rolesAndPlan = rolesAndPlanResponse.parsed_output;
      if (!core || !resumeFeedback || !rolesAndPlan) {
        throw new Error("Model did not return parseable output");
      }

      return assembleReport(core, resumeFeedback, rolesAndPlan, data.interest);
    } catch (error) {
      console.error("generateCareerReport: falling back to deterministic engine", error);
      return fallbackGenerate(data);
    }
  });
