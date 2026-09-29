import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center,
  dark,
  id,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
  dark?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow", dark && "eyebrow-dark")}>{eyebrow}</p>}
      <h2 id={id} className={cn("mt-3 text-3xl leading-tight sm:text-4xl", dark ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {intro && <p className={cn("mt-4 text-base leading-7 sm:text-lg", dark ? "text-white/70" : "text-muted")}>{intro}</p>}
    </div>
  );
}
