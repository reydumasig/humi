interface Props {
  className?: string;
  showTagline?: boolean;
}

export function HumiLogo({ className = "", showTagline = false }: Props) {
  return (
    <span className={`inline-flex items-center text-primary ${className}`}>
      <svg
        viewBox="0 0 620 170"
        className="h-9 w-auto sm:h-10"
        role="img"
        aria-label="Humi.ai — Transform Your Career"
      >
        <circle cx="88" cy="88" r="66" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="140" cy="34" r="12" fill="currentColor" />
        <g fill="currentColor">
          <rect x="54" y="48" width="16" height="80" rx="8" />
          <rect x="106" y="48" width="16" height="80" rx="8" />
          <rect x="54" y="80" width="68" height="16" rx="8" />
        </g>
        <text
          x="188"
          y="112"
          fontFamily="'Nunito', 'Quicksand', system-ui, sans-serif"
          fontWeight={800}
          fontSize="72"
          fill="currentColor"
        >
          Humi ai
        </text>
        {showTagline && (
          <text
            x="190"
            y="148"
            fontFamily="'Nunito', 'Quicksand', system-ui, sans-serif"
            fontWeight={700}
            fontSize="20"
            letterSpacing="2"
            fill="currentColor"
          >
            TRANSFORM YOUR CAREER
          </text>
        )}
      </svg>
    </span>
  );
}
