import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Counselling } from "@/lib/humi/counselling";

export function ProfessionalAIUse({ items }: { items: Counselling["safety"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <div key={s.title} className="surface-card p-5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-tint text-primary">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <p className="mt-3 font-bold">{s.title}</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{s.detail}</p>
        </div>
      ))}
    </div>
  );
}

export function StarterPrompts({ prompts }: { prompts: string[] }) {
  const copy = (p: string) => {
    void navigator.clipboard?.writeText(p);
    toast.success("Prompt copied — paste it into your AI assistant.");
  };
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {prompts.map((p, i) => (
        <button
          key={p}
          onClick={() => copy(p)}
          className="tint-card flex gap-3 p-4 text-left text-sm transition hover:brightness-97"
        >
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 text-[0.65rem] font-bold text-primary">
            {i + 1}
          </span>
          <span>“{p}”</span>
        </button>
      ))}
    </div>
  );
}
