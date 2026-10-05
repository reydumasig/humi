// Pure, client-safe report assembly — no server-only imports. Runs in the
// browser once all three generation stages have resolved, so the merge
// itself never has to be a server round-trip.
import type { CoreReportOutput, ResumeFeedbackOutput, RolesAndPlanOutput } from "../ai/schemas";
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
import type { Counselling, ReadinessItem } from "./counselling";
import type { InterestData, Report } from "./types";

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

export function assembleReport(
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
