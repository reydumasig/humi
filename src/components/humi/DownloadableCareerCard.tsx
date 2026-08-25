import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download, Mail } from "lucide-react";
import { toast } from "sonner";
import type { Report, SignupData } from "@/lib/humi/types";

interface Props {
  report: Report;
  signup: SignupData;
  keywords?: string[];
  firstProject?: string;
  nextAction?: string;
}

export function DownloadableCareerCard({ report, signup, keywords, firstProject, nextAction }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const download = async () => {
    if (!ref.current) return;
    try {
      const url = await toPng(ref.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const a = document.createElement("a");
      a.href = url;
      a.download = `Humi-Career-Card-${signup.firstName || "candidate"}.png`;
      a.click();
      toast.success("Your career card has been downloaded.");
    } catch {
      toast.error("Could not generate the card. Please try again.");
    }
  };

  return (
    <div>
      <div ref={ref} className="mx-auto max-w-xl rounded-3xl border border-[var(--color-border-soft)] bg-card p-7 shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-extrabold text-primary">
            Humi<span className="text-foreground">.ai</span>
          </span>
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Transform Your Career
          </span>
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Candidate</p>
        <p className="text-2xl font-extrabold">{signup.firstName} {signup.lastName}</p>

        <div className="mt-5 rounded-2xl bg-tint p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Target role</p>
          <p className="mt-1 text-lg font-extrabold">{report.futureRole}</p>
          {keywords?.length ? (
            <p className="mt-2 text-xs font-semibold text-muted-foreground">
              Job keywords: {keywords.join(" · ")}
            </p>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Top 3 skills to learn</p>
            <ul className="mt-2 space-y-1 text-sm font-semibold">
              {report.skillGroups[0]!.skills.slice(0, 3).map((s) => <li key={s.name}>• {s.name}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Top 3 AI tools</p>
            <ul className="mt-2 space-y-1 text-sm font-semibold">
              {report.tools.slice(0, 3).map((t) => <li key={t.name}>• {t.name}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">First project to build</p>
            <p className="mt-1 text-sm font-semibold">{firstProject ?? report.path[1]!.items[0]}</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Next 7-day action</p>
            <p className="mt-1 text-sm font-semibold">{nextAction ?? report.path[0]!.items[0]}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-tint p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">AI readiness score</p>
          <p className="text-2xl font-extrabold text-primary">{report.aiReadiness}/100</p>
        </div>

        <p className="mt-5 text-center text-sm font-bold text-primary">
          "The future belongs to people who learn how to work with AI."
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={download}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition hover:brightness-110"
        >
          <Download className="h-4 w-4" />
          Download My Career Card
        </button>
        <button
          onClick={() => toast.success(`Demo: your career profile would be emailed to ${signup.email}.`)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border-soft)] bg-tint px-7 py-3.5 text-sm font-bold text-primary transition hover:brightness-97"
        >
          <Mail className="h-4 w-4" />
          Email My Career Profile
        </button>
      </div>
    </div>
  );
}
