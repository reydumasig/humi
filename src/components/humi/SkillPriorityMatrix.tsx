import type { Counselling } from "@/lib/humi/counselling";

export function SkillPriorityMatrix({ matrix }: { matrix: Counselling["matrix"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {matrix.map((q, i) => (
        <div key={q.title} className={i < 2 ? "tint-card p-5" : "surface-card p-5"}>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 text-xs font-extrabold text-primary">
              {i + 1}
            </span>
            <p className="font-extrabold">{q.title}</p>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{q.note}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {q.items.map((s) => (
              <span key={s} className="pill-tag">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
