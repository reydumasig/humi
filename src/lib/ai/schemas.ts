import { z } from "zod/v4";

export const RecommendationSchema = z.object({
  title: z.string().describe("A specific, realistic job title"),
  fit: z.string().describe("One sentence: why this candidate's actual background fits this role"),
  aiChange: z.string().describe("One sentence: how AI changes day-to-day work in this role"),
  nextSkills: z
    .array(z.string())
    .min(2)
    .max(4)
    .describe("2-4 concrete skills to learn next for this role"),
});

export const ResumeAnalysisSchema = z.object({
  recentRole: z.string().describe("Their most recent or current job title, taken from the resume"),
  primaryFunction: z
    .string()
    .describe("The broad function/discipline, e.g. 'Software Engineering', 'Finance / Accounting'"),
  yearsExperience: z
    .string()
    .describe(
      "Years of professional experience as a short phrase, e.g. '7+ years' or '1-3 years', based on the actual resume timeline",
    ),
  industryExposure: z
    .string()
    .describe("Industries/domains they've worked in, based on the resume"),
  summary: z
    .string()
    .describe(
      "2-4 sentence plain-language summary of their background, written at a level of specificity that matches their actual seniority — senior candidates get technical/strategic language, junior candidates get foundational language. Never generic filler.",
    ),
  skills: z
    .array(z.string())
    .min(4)
    .max(10)
    .describe(
      "Concrete skills actually evidenced in the resume text (tools, languages, methods) — not generic soft skills unless the resume is skill-sparse",
    ),
  recommendations: z
    .array(RecommendationSchema)
    .min(3)
    .max(4)
    .describe(
      "Three career-direction recommendations, ordered best-fit first, appropriately ambitious for this person's actual seniority (do not recommend entry-level roles to a senior candidate or vice versa)",
    ),
});
export type ResumeAnalysisOutput = z.infer<typeof ResumeAnalysisSchema>;

const GAP_KEYS = [
  "aiToolFluency",
  "communication",
  "dataLiteracy",
  "workflowThinking",
  "industryKnowledge",
  "problemSolving",
  "automationReadiness",
  "leadershipPotential",
] as const;

const READINESS_KEYS = [
  "resumeClarity",
  "roleAlignment",
  "aiReadiness",
  "quantifiedAchievements",
  "toolVisibility",
  "keywordStrength",
  "projectPortfolioStrength",
  "communicationImpact",
] as const;

const SCORE_KEYS = [
  "aiReadiness",
  "automationExposure",
  "learningUrgency",
  "careerGrowthPotential",
  "humanSkillAdvantage",
] as const;

const MATRIX_KEYS = ["learnFirst", "buildNext", "usefulAddons", "advancedLater"] as const;

const skillGapLevel = z.enum(["Beginner", "Developing", "Strong"]);

const skillCard = z.object({
  name: z.string(),
  why: z.string().describe("Why this skill matters for their target role"),
  beginnerAction: z.string().describe("A concrete first step to start learning it"),
  tool: z.string().describe("A specific tool or resource name for practicing it"),
});

const toolCard = z.object({
  name: z.string(),
  helpsWith: z.string(),
  why: z.string(),
});

// Report: the core evolution narrative — role, gaps, scores, tools, path.
export const CoreReportSchema = z.object({
  startingPoint: z
    .string()
    .describe(
      "2-3 sentence honest read of where this specific candidate stands today, calibrated to their real seniority",
    ),
  strengths: z
    .array(z.string())
    .min(3)
    .max(6)
    .describe("Genuine strengths evidenced in the resume"),
  gaps: z
    .array(z.string())
    .min(2)
    .max(4)
    .describe("Real gaps for their target direction — can be empty-ish for very strong candidates"),
  currentRole: z.string(),
  futureRole: z.string().describe("The AI-enabled evolution of their current role"),
  evolutionExplanation: z.string().describe("1-2 sentences on how their role evolves with AI"),
  automate: z.array(z.string()).min(3).max(6).describe("Tasks in their role that AI will automate"),
  assist: z
    .array(z.string())
    .min(3)
    .max(6)
    .describe("Tasks where AI will assist but not replace them"),
  human: z
    .array(z.string())
    .min(3)
    .max(6)
    .describe("Tasks that stay distinctly human in their role"),

  gapsAnalysis: z
    .array(
      z.object({
        key: z.enum(GAP_KEYS),
        level: skillGapLevel,
        score: z.number().int().min(0).max(100),
        nextStep: z.string().describe("One concrete, specific next action to close this gap"),
      }),
    )
    .length(8)
    .describe(
      "One entry for each of the 8 fixed gap categories (each key used exactly once), scored honestly for this candidate",
    ),

  skillGroups: z
    .array(z.object({ title: z.string(), skills: z.array(skillCard).min(2).max(4) }))
    .min(2)
    .max(4)
    .describe(
      "Groups of skills to learn next, grouped by theme, ordered easiest/most-urgent first",
    ),

  tools: z
    .array(toolCard)
    .min(4)
    .max(6)
    .describe("AI tools most relevant to this candidate's target role"),

  scores: z
    .array(
      z.object({
        key: z.enum(SCORE_KEYS),
        value: z.number().int().min(0).max(100),
        note: z.string().describe("Short note explaining the score for this specific candidate"),
      }),
    )
    .length(5)
    .describe("One entry for each of the 5 fixed score dimensions (each key used exactly once)"),

  path: z
    .array(
      z.object({ window: z.string(), title: z.string(), items: z.array(z.string()).min(3).max(5) }),
    )
    .min(3)
    .max(3)
    .describe(
      "Exactly 3 entries: a 30/60/90-day learning path — window values like 'Days 1-30', 'Days 31-60', 'Days 61-90'",
    ),

  resumeBullets: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe("Rewritten resume bullets based on their actual experience"),
});
export type CoreReportOutput = z.infer<typeof CoreReportSchema>;

// Resume feedback: readiness scoring + concrete resume-editing guidance.
export const ResumeFeedbackSchema = z.object({
  readiness: z
    .array(
      z.object({
        key: z.enum(READINESS_KEYS),
        score: z.number().int().min(0).max(100),
        recommendation: z
          .string()
          .describe(
            "One specific, actionable recommendation tied to this candidate's actual resume",
          ),
      }),
    )
    .length(8)
    .describe(
      "One entry for each of the 8 fixed readiness categories (each key used exactly once)",
    ),

  resumeAdd: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe("Specific things this candidate should add to their resume"),
  resumeReduce: z.array(z.string()).min(2).max(4).describe("Specific things to cut or shorten"),
  resumeMeasurable: z
    .array(z.string())
    .min(2)
    .max(4)
    .describe("What kinds of numbers/metrics they should quantify"),
  resumeHighlight: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe("Skills/tools to highlight prominently"),
  resumeHonesty: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe("Honest-framing guidance for claiming skills"),

  rewrites: z
    .array(z.object({ before: z.string(), after: z.string(), earned: z.boolean() }))
    .min(2)
    .max(4)
    .describe(
      "3 before/after resume bullet rewrites using plausible content for this candidate's actual background; mark earned=true if it depends on completing a suggested project",
    ),

  bulletsNow: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe(
      "2-3 resume bullets this candidate can honestly use right now, based on their actual experience",
    ),
});
export type ResumeFeedbackOutput = z.infer<typeof ResumeFeedbackSchema>;

// Roles, projects, interview prep and the day-by-day action plan.
export const RolesAndPlanSchema = z.object({
  targetRoles: z
    .array(
      z.object({
        title: z.string(),
        why: z.string().describe("Why this specific role fits their background"),
        supports: z.string().describe("Which of their actual skills support this role"),
        gap: z.string().describe("The main gap category to close for this role"),
        aiEdge: z.string().describe("How AI fluency gives them an edge in this role"),
      }),
    )
    .min(5)
    .max(8)
    .describe("Realistic job titles to apply for, ordered closest-fit first"),

  matrixItems: z
    .array(z.object({ key: z.enum(MATRIX_KEYS), items: z.array(z.string()).min(3).max(5) }))
    .length(4)
    .describe(
      "One entry for each of the 4 fixed priority tiers (each key used exactly once), tailored to this candidate's actual gaps and level",
    ),

  projects: z
    .array(
      z.object({
        name: z.string(),
        objective: z.string(),
        tools: z.array(z.string()).min(2).max(4),
        steps: z.array(z.string()).min(4).max(6),
        output: z.string().describe("What they'll have at the end"),
        bullet: z.string().describe("A resume bullet they can write once this is done"),
        interview: z.string().describe("A one-sentence talking point for interviews"),
      }),
    )
    .min(2)
    .max(3)
    .describe(
      "Portfolio mini-projects sized appropriately for their actual skill level — do not suggest a beginner project to a senior expert",
    ),

  intro: z
    .string()
    .describe(
      "A 60-second spoken interview self-introduction in first person, matching their real background",
    ),

  interviewQuestions: z
    .array(z.object({ q: z.string(), tip: z.string() }))
    .min(4)
    .max(6)
    .describe(
      "4-6 likely interview questions for their target role with a specific answering tip each",
    ),

  practicePrompts: z
    .array(z.string())
    .min(2)
    .max(4)
    .describe("2-4 AI prompts they can use to practice interviewing"),

  keywords: z
    .array(z.object({ title: z.string(), words: z.array(z.string()).min(3).max(8) }))
    .min(4)
    .max(6)
    .describe(
      "5 keyword groups for job search/LinkedIn: Job title keywords, Skills keywords, AI-ready keywords, Industry keywords, LinkedIn profile keywords — in that order",
    ),

  starterPrompts: z
    .array(z.string())
    .min(8)
    .max(10)
    .describe("Ready-to-use AI prompts relevant to their target role"),

  sevenDays: z
    .array(z.object({ day: z.string(), task: z.string(), detail: z.string() }))
    .min(6)
    .max(8)
    .describe(
      "A 7-day action plan (one entry per day, days labeled 'Day 1'..'Day 7') — exactly 7 entries unless truly impossible",
    ),

  dailyWork: z
    .array(z.object({ before: z.string(), after: z.string() }))
    .min(2)
    .max(4)
    .describe("2-4 before/after examples of how their actual daily work changes with AI"),

  roleTools: z
    .array(
      z.object({ name: z.string(), useCase: z.string(), practice: z.string(), resume: z.string() }),
    )
    .min(3)
    .max(4)
    .describe(
      "3-4 tools specific to their target role (not generic tools like ChatGPT/Excel, which are covered separately)",
    ),
});
export type RolesAndPlanOutput = z.infer<typeof RolesAndPlanSchema>;
