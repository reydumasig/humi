interface Props {
  className?: string;
  /** Show floating labels around the orbit (hero use). */
  labels?: string[];
}

/** Decorative orbit graphic inspired by the Humi.ai logo mark. */
export function OrbitGraphic({ className = "", labels }: Props) {
  return (
    <div className={`relative aspect-square w-full ${className}`} aria-hidden>
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <circle cx="200" cy="200" r="150" fill="none" stroke="var(--color-border-soft)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="110" fill="none" stroke="var(--color-border-soft)" strokeWidth="1" opacity="0.6" />
        <circle cx="200" cy="200" r="185" fill="none" stroke="var(--color-border-soft)" strokeWidth="1" opacity="0.35" />
        <g className="origin-center animate-orbit" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="306" cy="94" r="16" fill="var(--color-primary)" />
        </g>
        <g stroke="var(--color-primary)" strokeWidth="20" strokeLinecap="round" opacity="0.9">
          <line x1="152" y1="140" x2="152" y2="262" />
          <line x1="248" y1="140" x2="248" y2="262" />
          <line x1="152" y1="201" x2="248" y2="201" />
        </g>
      </svg>

      {labels && (
        <>
          {labels.map((label, i) => {
            const positions = [
              "left-0 top-[12%]",
              "right-0 top-[30%]",
              "left-[4%] bottom-[18%]",
              "right-[6%] bottom-[6%]",
            ];
            return (
              <div
                key={label}
                className={`absolute ${positions[i % positions.length]} rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold shadow-[var(--shadow-soft)]`}
              >
                {label}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

/** Faint full-bleed orbit lines used as section background texture. */
export function OrbitBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <svg className="absolute -right-40 -top-40 h-[720px] w-[720px] opacity-[0.35]" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="190" fill="none" stroke="var(--color-border-soft)" strokeWidth="0.8" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="var(--color-border-soft)" strokeWidth="0.8" />
        <circle cx="200" cy="200" r="90" fill="none" stroke="var(--color-border-soft)" strokeWidth="0.8" />
      </svg>
      <svg className="absolute -bottom-52 -left-40 h-[620px] w-[620px] opacity-[0.3]" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="190" fill="none" stroke="var(--color-border-soft)" strokeWidth="0.8" />
        <circle cx="200" cy="200" r="130" fill="none" stroke="var(--color-border-soft)" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
