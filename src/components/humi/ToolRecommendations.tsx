import type { Counselling } from "@/lib/humi/counselling";

export function ToolRecommendations({ groups }: { groups: Counselling["toolGroups"] }) {
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g.title}>
          <div className="flex flex-wrap items-baseline gap-3">
            <h4 className="text-base font-extrabold text-primary">{g.title}</h4>
            <p className="text-xs text-muted-foreground">{g.note}</p>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.tools.map((t) => (
              <div key={t.name} className="tint-card p-5">
                <p className="font-extrabold text-primary">{t.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Beginner use case: </span>
                  {t.useCase}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Practice task: </span>
                  {t.practice}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Resume relevance: </span>
                  {t.resume}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
