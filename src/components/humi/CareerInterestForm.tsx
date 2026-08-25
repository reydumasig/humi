import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { InterestData, Recommendation } from "@/lib/humi/types";

const INDUSTRIES = [
  "Banking / Finance",
  "BPO / Customer Service",
  "Retail",
  "Technology",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Real Estate",
  "Marketing / Advertising",
  "Hospitality",
  "Open to Any Industry",
];

const field =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10";

interface Props {
  recommendations: Recommendation[];
  onSubmit: (data: InterestData) => void;
}

export function CareerInterestForm({ recommendations, onSubmit }: Props) {
  const [data, setData] = useState<InterestData>({
    chosenRole: recommendations[0]?.title ?? "",
    notes: "",
    industry: "Open to Any Industry",
  });

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="px-5 py-10">
      <div className="surface-card mx-auto max-w-2xl p-6 sm:p-9">
        <h2 className="text-2xl font-extrabold sm:text-3xl">What Kind of Role Are You Interested In?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You can accept Humi.ai's recommendation or tell us what kind of career path you want to
          explore.
        </p>

        <div className="mt-7 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Recommended role</label>
            <select
              className={field}
              value={data.chosenRole}
              onChange={(e) => setData((d) => ({ ...d, chosenRole: e.target.value }))}
            >
              {recommendations.map((r) => (
                <option key={r.title} value={r.title}>{r.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Anything else you want us to know?</label>
            <textarea
              className={`${field} min-h-28`}
              maxLength={600}
              value={data.notes}
              onChange={(e) => setData((d) => ({ ...d, notes: e.target.value }))}
              placeholder="Example: I am interested in sales, marketing, HR, finance, data analytics, or any role where I can use AI tools to grow faster."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Industry interest</label>
            <select
              className={field}
              value={data.industry}
              onChange={(e) => setData((d) => ({ ...d, industry: e.target.value }))}
            >
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onSubmit(data)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            Generate My AI Career Evolution
          </button>
        </div>
      </div>
    </motion.section>
  );
}
