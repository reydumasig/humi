export type CareerStage =
  | "Student / Fresh Graduate"
  | "Early Career"
  | "Mid-Career"
  | "Career Switcher"
  | "Returning to Workforce"
  | "Senior Professional";

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  careerStage: CareerStage | "";
  consent: boolean;
}

export interface ResumeInput {
  fileName?: string;
  resumeText?: string;
  recentRole: string;
  experienceSummary: string;
  keySkills: string;
  industries: string;
}

export interface ParsedResume {
  fileName?: string;
  recentRole: string;
  primaryFunction: string;
  familyKey: FamilyKey;
  yearsExperience: string;
  industryExposure: string;
  summary: string;
  skills: string[];
}

export interface Recommendation {
  title: string;
  fit: string;
  aiChange: string;
  nextSkills: string[];
}

export interface InterestData {
  chosenRole: string;
  notes: string;
  industry: string;
}

export interface SkillGap {
  category: string;
  level: "Beginner" | "Developing" | "Strong";
  score: number;
  nextStep: string;
}

export interface SkillCard {
  name: string;
  why: string;
  beginnerAction: string;
  tool: string;
}

export interface ToolCard {
  name: string;
  helpsWith: string;
  why: string;
}

export interface Report {
  startingPoint: string;
  strengths: string[];
  gaps: string[];
  currentRole: string;
  futureRole: string;
  evolutionExplanation: string;
  automate: string[];
  assist: string[];
  human: string[];
  gapsAnalysis: SkillGap[];
  skillGroups: { title: string; skills: SkillCard[] }[];
  tools: ToolCard[];
  path: { window: string; title: string; items: string[] }[];
  scores: { label: string; value: number; note: string }[];
  aiReadiness: number;
  resumeBullets: string[];
}

export type FamilyKey =
  | "sales"
  | "marketing"
  | "hr"
  | "finance"
  | "support"
  | "operations"
  | "it"
  | "engineering"
  | "product"
  | "design"
  | "data"
  | "legal"
  | "procurement"
  | "admin"
  | "education"
  | "retail"
  | "general";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  careerStage: string;
  resumeFileName: string | null;
  resumeUrl: string | null;
  recommendedRole: string;
  careerInterest: string;
  aiReadiness: number;
  createdAt: string;
}
