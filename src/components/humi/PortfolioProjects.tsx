import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Project } from "@/lib/humi/counselling";

export function PortfolioProjects({ projects }: { projects: Project[] }) {
  return (
    <Accordion type="single" collapsible defaultValue="p0" className="space-y-4">
      {projects.map((p, i) => (
        <AccordionItem key={p.name} value={`p${i}`} className="surface-card border-none px-5">
          <AccordionTrigger className="py-5 text-left hover:no-underline">
            <span className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 text-xs font-extrabold text-primary">
                {i + 1}
              </span>
              <span className="text-base font-extrabold">{p.name}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Objective: </span>
              {p.objective}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tools.map((t) => (
                <span key={t} className="pill-tag">{t}</span>
              ))}
            </div>
            <ol className="mt-4 space-y-2">
              {p.steps.map((s, si) => (
                <li key={s} className="flex gap-3 text-sm">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tint text-[0.65rem] font-bold text-primary">
                    {si + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="tint-card p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Final output</p>
                <p className="mt-1.5 text-sm">{p.output}</p>
              </div>
              <div className="tint-card p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Resume bullet after completion</p>
                <p className="mt-1.5 text-sm font-semibold">{p.bullet}</p>
              </div>
              <div className="tint-card p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Interview talking point</p>
                <p className="mt-1.5 text-sm">“{p.interview}”</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
