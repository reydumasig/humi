import type { Counselling } from "@/lib/humi/counselling";

export function JobSearchKeywords({ groups }: { groups: Counselling["keywords"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <div key={g.title} className="surface-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{g.title}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {g.words.map((w) => (
              <span key={w} className="pill-tag">{w}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
