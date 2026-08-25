import { Bot, HandHeart, Wand2 } from "lucide-react";
import type { Report } from "@/lib/humi/types";

const COLUMNS = [
  { key: "automate", icon: Bot, title: "Tasks AI Can Automate", note: "Repetitive, rules-based or administrative work." },
  { key: "assist", icon: Wand2, title: "Tasks AI Can Assist", note: "Where AI improves speed, quality and insight." },
  { key: "human", icon: HandHeart, title: "Human Skills That Still Matter", note: "These become more valuable, not less." },
] as const;

export function AIImpactMap({ report }: { report: Report }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {COLUMNS.map((c) => (
        <div key={c.key} className="surface-card p-6">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-tint text-primary">
            <c.icon className="h-5 w-5" />
          </span>
          <h4 className="mt-4 text-base font-extrabold">{c.title}</h4>
          <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>
          <ul className="mt-4 space-y-2.5">
            {report[c.key].map((item) => (
              <li key={item} className="flex gap-2.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
