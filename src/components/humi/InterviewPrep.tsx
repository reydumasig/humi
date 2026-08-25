import type { Counselling } from "@/lib/humi/counselling";

export function InterviewPrep({ c }: { c: Counselling }) {
  return (
    <div className="space-y-5">
      <div className="tint-card p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Your 60-second introduction</p>
        <p className="mt-2 text-sm leading-relaxed">“{c.intro}”</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-5">
          <p className="font-bold">Five likely interview questions</p>
          <ul className="mt-3 space-y-3">
            {c.interviewQuestions.map((q, i) => (
              <li key={q.q} className="text-sm">
                <span className="font-semibold">{i + 1}. {q.q}</span>
                <p className="mt-0.5 text-muted-foreground">{q.tip}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="surface-card p-5">
            <p className="font-bold">Suggested answer structure</p>
            <ol className="mt-3 space-y-2">
              {c.answerStructure.map((a, i) => (
                <li key={a.step} className="flex gap-3 text-sm">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tint text-[0.65rem] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span>
                    <span className="font-semibold">{a.step}: </span>
                    <span className="text-muted-foreground">{a.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="surface-card p-5">
            <p className="font-bold">Interview practice prompts</p>
            <ul className="mt-3 space-y-2">
              {c.practicePrompts.map((p) => (
                <li key={p} className="rounded-2xl bg-tint p-3 text-sm">“{p}”</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
