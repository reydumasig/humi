import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { HumiLogo } from "@/components/humi/HumiLogo";
import { OrbitBackdrop } from "@/components/humi/OrbitGraphic";
import { HumiWelcomeHero } from "@/components/humi/HumiWelcomeHero";
import { SignupForm } from "@/components/humi/SignupForm";
import { ResumeUpload } from "@/components/humi/ResumeUpload";
import { ResumeParsingLoader } from "@/components/humi/ResumeParsingLoader";
import { ResumeSummary } from "@/components/humi/ResumeSummary";
import { CareerInterestForm } from "@/components/humi/CareerInterestForm";
import { CareerEvolutionReport } from "@/components/humi/CareerEvolutionReport";
import { SAMPLE_PROFILES, buildReport, getRecommendations, parseResume } from "@/lib/humi/engine";
import { submitLead } from "@/lib/api/leads.functions";
import type { InterestData, ParsedResume, Report, ResumeInput, SignupData } from "@/lib/humi/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Humi.ai — Discover Your AI Career Evolution" },
      {
        name: "description",
        content:
          "Upload your resume and get a personalized AI career evolution report: future-ready role, skills to learn, AI tools, and a 30-60-90 day learning path.",
      },
      { property: "og:title", content: "Humi.ai — Transform Your Career" },
      {
        property: "og:description",
        content:
          "A personalized AI career evolution report for job fair candidates, students, professionals and career switchers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HumiApp,
});

type Step = "welcome" | "signup" | "upload" | "parsing" | "summary" | "interest" | "report";

function HumiApp() {
  const [step, setStep] = useState<Step>("welcome");
  const [signup, setSignup] = useState<SignupData | null>(null);
  const [signupPrefill, setSignupPrefill] = useState<Partial<SignupData>>();
  const [resumePrefill, setResumePrefill] = useState<Partial<ResumeInput>>();
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [interest, setInterest] = useState<InterestData | null>(null);
  const [resumeFile, setResumeFile] = useState<File | undefined>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const runParse = (input: ResumeInput, who: SignupData, file?: File) => {
    setResumeFile(file);
    setStep("parsing");
    setTimeout(() => {
      setParsed(parseResume(input, who));
      setStep("summary");
    }, 2800);
  };

  const finish = (interestData: InterestData) => {
    if (!parsed || !signup) return;
    const built = buildReport(parsed, interestData, signup);
    setInterest(interestData);
    setReport(built);

    const form = new FormData();
    form.set("firstName", signup.firstName);
    form.set("lastName", signup.lastName);
    form.set("email", signup.email);
    form.set("phone", signup.phone);
    form.set("careerStage", signup.careerStage || "Not specified");
    form.set("recommendedRole", built.futureRole);
    form.set("careerInterest", `${interestData.chosenRole} · ${interestData.industry}`);
    form.set("aiReadiness", String(built.aiReadiness));
    if (resumeFile) form.set("resume", resumeFile);

    submitLead({ data: form }).catch((err) => {
      console.error("Failed to save candidate lead", err);
      toast.error("We couldn't save your submission, but your report is ready below.");
    });

    setStep("report");
  };

  const loadSample = (index: number) => {
    const s = SAMPLE_PROFILES[index]!;
    const who: SignupData = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      careerStage: "",
      consent: true,
      ...s.signup,
    } as SignupData;
    setSignup(who);
    setSignupPrefill(s.signup);
    setResumePrefill(s.resume);
    runParse(s.resume, who);
  };

  const recommendations = parsed ? getRecommendations(parsed.familyKey) : [];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <OrbitBackdrop />
      <Toaster />

      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <button onClick={() => setStep("welcome")} aria-label="Humi.ai home">
            <HumiLogo />
          </button>
          <div className="flex items-center gap-3">
            {step === "welcome" && (
              <select
                onChange={(e) => e.target.value !== "" && loadSample(Number(e.target.value))}
                defaultValue=""
                className="hidden rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold sm:block"
                aria-label="Load a demo profile"
              >
                <option value="">Demo profile…</option>
                {SAMPLE_PROFILES.map((s, i) => (
                  <option key={s.label} value={i}>
                    {s.label}
                  </option>
                ))}
              </select>
            )}
            <Link
              to="/admin"
              className="text-xs font-semibold text-muted-foreground hover:text-primary"
            >
              Leads
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === "welcome" && <HumiWelcomeHero key="welcome" onStart={() => setStep("signup")} />}
        {step === "signup" && (
          <SignupForm
            key="signup"
            initial={signupPrefill}
            onSubmit={(d) => {
              setSignup(d);
              setStep("upload");
            }}
          />
        )}
        {step === "upload" && signup && (
          <ResumeUpload
            key="upload"
            initial={resumePrefill}
            onSubmit={(input, file) => runParse(input, signup, file)}
          />
        )}
        {step === "parsing" && <ResumeParsingLoader key="parsing" />}
        {step === "summary" && parsed && signup && (
          <ResumeSummary
            key="summary"
            parsed={parsed}
            signup={signup}
            recommendations={recommendations}
            onContinue={() => setStep("interest")}
          />
        )}
        {step === "interest" && (
          <CareerInterestForm key="interest" recommendations={recommendations} onSubmit={finish} />
        )}
        {step === "report" && report && parsed && signup && (
          <CareerEvolutionReport
            key="report"
            report={report}
            parsed={parsed}
            signup={signup}
            interestRole={interest?.chosenRole}
            interestIndustry={interest?.industry}
            onRestart={() => {
              setStep("welcome");
              setReport(null);
              setParsed(null);
              setSignup(null);
              setInterest(null);

              setSignupPrefill(undefined);
              setResumePrefill(undefined);
              setResumeFile(undefined);
            }}
          />
        )}
      </AnimatePresence>

      <footer className="border-t border-border px-5 py-8 text-center text-xs text-muted-foreground">
        Humi.ai — Transform Your Career · Career guidance only, not a hiring decision.
      </footer>
    </main>
  );
}
