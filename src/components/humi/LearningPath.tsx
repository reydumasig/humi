import { CheckCircle2 } from "lucide-react";
import type { Report } from "@/lib/humi/types";

export function LearningPath({ path, outputs }: { path: Report["path"]; outputs?: string[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {path.map((p, i) => (
        <div key={p.window} className="surface-card relative overflow-hidden p-6">
          <span className="absolute right-4 top-4 text-5xl font-extrabold text-tint">{i + 1}</span>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{p.window}</p>
          <h4 className="mt-1.5 text-lg font-extrabold">{p.title}</h4>
          <ul className="mt-4 space-y-2.5">
            {p.items.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
          {outputs?.[i] && (
            <p className="mt-4 rounded-2xl bg-tint p-4 text-sm font-semibold text-primary">{outputs[i]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
