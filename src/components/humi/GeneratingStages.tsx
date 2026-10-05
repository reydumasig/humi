import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { ResumeParsingLoader } from "./ResumeParsingLoader";
import type { CoreReportOutput, ResumeFeedbackOutput, RolesAndPlanOutput } from "@/lib/ai/schemas";

const STAGES = [
  {
    key: "core",
    title: "Your Career Direction",
    loadingMessages: [
      "Reading your resume signals…",
      "Mapping your current role…",
      "Charting your AI-enabled future role…",
    ],
  },
  {
    key: "resumeFeedback",
    title: "Your Resume Readiness",
    loadingMessages: ["Scoring your resume readiness…", "Finding the fastest resume fixes…"],
  },
  {
    key: "rolesAndPlan",
    title: "Your Action Plan",
    loadingMessages: [
      "Picking realistic target roles…",
      "Building your 30-60-90 day plan…",
      "Writing your 7-day action plan…",
    ],
  },
] as const;

interface Props {
  activeStage: 0 | 1 | 2;
  core: CoreReportOutput | null;
  resumeFeedback: ResumeFeedbackOutput | null;
  rolesAndPlan: RolesAndPlanOutput | null;
  onContinue: () => void;
}

export function GeneratingStages({
  activeStage,
  core,
  resumeFeedback,
  rolesAndPlan,
  onContinue,
}: Props) {
  const stage = STAGES[activeStage];
  const ready =
    activeStage === 0
      ? core !== null
      : activeStage === 1
        ? resumeFeedback !== null
        : rolesAndPlan !== null;

  if (!ready) {
    return (
      <ResumeParsingLoader
        key={stage.key}
        title={stage.title}
        messages={[...stage.loadingMessages]}
      />
    );
  }

  return (
    <section className="px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card mx-auto max-w-lg p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-4 text-xl font-extrabold">{stage.title} is ready</h3>

        {activeStage === 0 && core && (
          <div className="mt-5 text-left">
            <p className="text-sm text-muted-foreground">{core.startingPoint}</p>
            <div className="mt-4 rounded-2xl bg-tint p-4 text-sm">
              <span className="font-semibold text-primary">Future direction: </span>
              {core.futureRole}
            </div>
          </div>
        )}

        {activeStage === 1 && resumeFeedback && (
          <div className="mt-5 text-left">
            <p className="text-sm text-muted-foreground">
              Resume readiness scored across {resumeFeedback.readiness.length} areas, plus specific
              rewrites and what to add, cut and quantify.
            </p>
          </div>
        )}

        {activeStage === 2 && rolesAndPlan && (
          <div className="mt-5 text-left">
            <p className="text-sm text-muted-foreground">
              Target role:{" "}
              <span className="font-semibold text-foreground">
                {rolesAndPlan.targetRoles[0]?.title}
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Plus mini-projects, interview prep and your 7-day action plan.
            </p>
          </div>
        )}

        <button
          onClick={onContinue}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:brightness-110"
        >
          Continue
        </button>
      </motion.div>
    </section>
  );
}
