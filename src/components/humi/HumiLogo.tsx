import logo from "@/assets/humi-logo.png.asset.json";

interface Props {
  className?: string;
  variant?: "image" | "text";
  showTagline?: boolean;
}

export function HumiLogo({ className = "", variant = "image", showTagline = false }: Props) {
  if (variant === "image") {
    return (
      <span className={`inline-flex flex-col ${className}`}>
        <img src={logo.url} alt="Humi.ai — Transform Your Career" className="h-9 w-auto sm:h-10" />
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="font-display text-2xl font-extrabold tracking-tight text-primary">
        Humi<span className="text-foreground">.ai</span>
      </span>
      {showTagline && (
        <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Transform Your Career
        </span>
      )}
    </span>
  );
}
