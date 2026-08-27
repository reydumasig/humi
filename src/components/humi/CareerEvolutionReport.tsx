import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ParsedResume, Report, SignupData } from "@/lib/humi/types";
import type { Counselling } from "@/lib/humi/counselling";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AIImpactMap } from "./AIImpactMap";
import { SkillGapAnalysis } from "./SkillGapAnalysis";
import { LearningPath } from "./LearningPath";
import { ToolRecommendations } from "./ToolRecommendations";
import { CareerScoreCard } from "./CareerScoreCard";
import { DownloadableCareerCard } from "./DownloadableCareerCard";
import { ResumeReadinessReview } from "./ResumeReadinessReview";
import { ResumeImprovement } from "./ResumeImprovement";
import { TargetRoles } from "./TargetRoles";
import { SkillPriorityMatrix } from "./SkillPriorityMatrix";
import { PortfolioProjects } from "./PortfolioProjects";
import { InterviewPrep } from "./InterviewPrep";
import { JobSearchKeywords } from "./JobSearchKeywords";
import { ProfessionalAIUse, StarterPrompts } from "./ProfessionalAIUse";
import { SevenDayPlan } from "./SevenDayPlan";

function Section({
  n,
  title,
  subtitle,
  children,
}: {
  n: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="mt-14 break-inside-avoid"
      style={{ breakInside: "avoid" }}
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Section {n}</p>
      <h3 className="mt-1 text-2xl font-extrabold sm:text-3xl">{title}</h3>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

interface Props {
  report: Report;
  counselling: Counselling;
  parsed: ParsedResume;
  signup: SignupData;
  onRestart: () => void;
}

export function CareerEvolutionReport({
  report,
  counselling: c,
  parsed,
  signup,
  onRestart,
}: Props) {
  const topSkills = c.matrix[0]!.items;

  return (
    <div className="px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="brand-badge">Your Humi.ai Career Evolution</div>
        <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          {signup.firstName}, here's how your career can evolve with AI
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          This is a practical plan, not a verdict. It shows what role to target, what to fix on your
          resume, what to learn first, what to build, and exactly what to do in the next 7 days.
        </p>

        <Section n={1} title="Your Career Starting Point">
          <div className="surface-card p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">{report.startingPoint}</p>
            <p className="mt-4 rounded-2xl bg-tint p-4 text-sm leading-relaxed">
              <span className="font-semibold text-primary">Why we selected this direction: </span>
              your resume shows clear signals in{" "}
              {parsed.skills.slice(0, 3).join(", ").toLowerCase()} within{" "}
              {parsed.primaryFunction.toLowerCase()}, with {parsed.yearsExperience} of exposure to{" "}
              {parsed.industryExposure}. Those signals map most directly to {report.futureRole}{" "}
              work, where your existing strengths stay valuable and AI tools remove the repetitive
              parts.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm font-extrabold">Current strengths</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {report.strengths.map((s) => (
                    <span key={s} className="pill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-extrabold">Areas with the biggest upside</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {report.gaps.length ? (
                    report.gaps.map((g) => (
                      <span key={g} className="pill-tag">
                        {g}
                      </span>
                    ))
                  ) : (
                    <span className="pill-tag">Keep building depth</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          n={2}
          title="Your Resume Readiness Review"
          subtitle="How ready your resume is for future-ready roles today — and the fastest fixes."
        >
          <ResumeReadinessReview items={c.readiness} average={c.readinessAverage} />
        </Section>

        <Section
          n={3}
          title="How to Improve Your Resume"
          subtitle="Specific, practical changes you can make this week."
        >
          <ResumeImprovement c={c} />
        </Section>

        <Section n={4} title="Your Role Evolution">
          <div className="grid items-stretch gap-5 md:grid-cols-[1fr_auto_1fr]">
            <div className="surface-card p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Current profile
              </p>
              <p className="mt-2 text-xl font-extrabold">{report.currentRole}</p>
              <p className="mt-2 text-sm text-muted-foreground">{parsed.primaryFunction}</p>
            </div>
            <div className="flex items-center justify-center">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
            <div className="tint-card p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                Future AI-enabled role
              </p>
              <p className="mt-2 text-xl font-extrabold">{report.futureRole}</p>
              <p className="mt-2 text-sm text-muted-foreground">{report.evolutionExplanation}</p>
            </div>
          </div>
          <div className="surface-card mt-5 p-6">
            <p className="text-sm font-extrabold">What changes in your daily work</p>
            <div className="mt-4 space-y-3">
              {c.dailyWork.map((d) => (
                <div
                  key={d.before}
                  className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
                >
                  <p className="text-sm text-muted-foreground">{d.before}</p>
                  <ArrowRight className="hidden h-4 w-4 text-primary sm:block" />
                  <p className="text-sm font-semibold">{d.after}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          n={5}
          title="Roles You Can Start Targeting"
          subtitle="Realistic job titles based on your resume signals and interest."
        >
          <TargetRoles roles={c.targetRoles} />
        </Section>

        <Section
          n={6}
          title="AI Impact Map"
          subtitle="AI will change the task mix inside your role — your human skills become more valuable."
        >
          <AIImpactMap report={report} />
        </Section>

        <Section n={7} title="Your Skill Gap Analysis">
          <SkillGapAnalysis gaps={report.gapsAnalysis} why={c.gapWhy} />
        </Section>

        <Section
          n={8}
          title="What to Learn First"
          subtitle="A simple priority matrix so you never have to guess where to start."
        >
          <SkillPriorityMatrix matrix={c.matrix} />
        </Section>

        <Section
          n={9}
          title="Skills You Should Learn Next"
          subtitle="Start with the top five. Open the groups below only when you are ready for more."
        >
          <div className="tint-card p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Top 5 priority skills
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[...topSkills, c.matrix[1]!.items[0]!].slice(0, 5).map((s) => (
                <span key={s} className="pill-tag">
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              This is the fastest set to improve. You do not need to master everything at once.
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-5 space-y-3">
            {report.skillGroups.map((group, gi) => (
              <AccordionItem
                key={group.title}
                value={`g${gi}`}
                className="surface-card border-none px-5"
              >
                <AccordionTrigger className="py-4 text-left text-base font-extrabold hover:no-underline">
                  {group.title}
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.skills.map((s) => (
                      <div key={s.name} className="tint-card p-5">
                        <p className="font-bold">{s.name}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{s.why}</p>
                        <p className="mt-2 text-sm">
                          <span className="font-semibold">Start with: </span>
                          <span className="text-muted-foreground">{s.beginnerAction}</span>
                        </p>
                        <p className="mt-2 text-xs font-semibold text-primary">{s.tool}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>

        <Section
          n={10}
          title="Recommended AI Tools to Explore"
          subtitle="Grouped so you know exactly which tool to open first."
        >
          <ToolRecommendations groups={c.toolGroups} />
        </Section>

        <Section
          n={11}
          title="Mini Projects You Can Build to Prove Your AI Readiness"
          subtitle="This is a practical way to prove your readiness — finish one, then talk about it in interviews."
        >
          <PortfolioProjects projects={c.projects} />
        </Section>

        <Section
          n={12}
          title="Your 30-60-90 Day Career Learning Path"
          subtitle="Each phase ends with something tangible you can show."
        >
          <LearningPath path={report.path} outputs={c.pathOutputs} />
        </Section>

        <Section
          n={13}
          title="Career Opportunity Score"
          subtitle="Here is how each score is calculated and what raises it."
        >
          <CareerScoreCard report={report} explainers={c.scoreExplainers} />
        </Section>

        <Section n={14} title="Your AI-Ready Interview Preparation">
          <InterviewPrep c={c} />
        </Section>

        <Section
          n={15}
          title="Keywords to Use in Your Job Search"
          subtitle="Use these in job searches, applications and your LinkedIn profile."
        >
          <JobSearchKeywords groups={c.keywords} />
        </Section>

        <Section
          n={16}
          title="How to Use AI Professionally"
          subtitle="Simple habits that keep your AI use safe, honest and credible."
        >
          <ProfessionalAIUse items={c.safety} />
        </Section>

        <Section n={17} title="Prompts You Can Use Today" subtitle="Tap any prompt to copy it.">
          <StarterPrompts prompts={c.starterPrompts} />
        </Section>

        <Section
          n={18}
          title="Future Resume Bullets"
          subtitle="Some you can use today. Others you earn by finishing a project."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-extrabold text-primary">Bullets you can use now</p>
              <div className="mt-3 space-y-3">
                {c.bulletsNow.map((b) => (
                  <div key={b} className="surface-card p-5 text-sm font-semibold">
                    {b}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-extrabold text-primary">
                Bullets you can earn after your projects
              </p>
              <div className="mt-3 space-y-3">
                {c.bulletsEarned.map((b) => (
                  <div key={b} className="tint-card p-5 text-sm font-semibold">
                    {b}
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                      Use this as a target bullet to earn after completing the recommended project.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section
          n={19}
          title="Your Next 7 Days"
          subtitle={`A short, personalized plan for a ${report.futureRole} track.`}
        >
          <SevenDayPlan days={c.sevenDays} />
        </Section>

        <Section n={20} title="Your Career Evolution Card">
          <DownloadableCareerCard
            report={report}
            signup={signup}
            keywords={c.keywords[0]!.words.slice(0, 3)}
            firstProject={c.projects[0]!.name}
            nextAction={c.sevenDays[0]!.task}
          />
        </Section>

        <div className="mt-14 border-t border-border pt-6 text-center">
          <button
            onClick={onRestart}
            className="rounded-full border border-[var(--color-border-soft)] bg-tint px-6 py-3 text-sm font-bold text-primary"
          >
            Start a new career profile
          </button>
          <p className="mx-auto mt-4 max-w-xl text-xs text-muted-foreground">
            Humi.ai provides career guidance only. It does not make hiring decisions or determine
            employment eligibility.
          </p>
        </div>
      </div>
    </div>
  );
}
