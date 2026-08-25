import { motion } from "framer-motion";
import type { SkillGap } from "@/lib/humi/types";

export function SkillGapAnalysis({ gaps, why }: { gaps: SkillGap[]; why?: Record<string, string> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {gaps.map((g, i) => (
        <div key={g.category} className="surface-card p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold">{g.category}</p>
            <span className="pill-tag">{g.level}</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${g.score}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="h-full rounded-full"
              style={{ background: "var(--gradient-primary)" }}
            />
          </div>
          {why?.[g.category] && (
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Why this matters to employers: </span>
              {why[g.category]}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Next step: </span>
            {g.nextStep}
          </p>
        </div>
      ))}
    </div>
  );
}
