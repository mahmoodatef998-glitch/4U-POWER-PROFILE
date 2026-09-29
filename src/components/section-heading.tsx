import { cn } from "@/lib/utils";
import { SplitText } from "./fx";

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
      <SplitText
        text={title}
        id={id}
        className={cn("mt-4 text-4xl leading-[1.02] sm:text-5xl lg:text-6xl rtl:text-3xl rtl:leading-tight rtl:sm:text-4xl rtl:lg:text-5xl", dark ? "text-white" : "text-ink")}
      />
      {intro && <p className={cn("mt-4 text-base leading-7 sm:text-lg", dark ? "text-white/70" : "text-muted")}>{intro}</p>}
    </div>
  );
}
