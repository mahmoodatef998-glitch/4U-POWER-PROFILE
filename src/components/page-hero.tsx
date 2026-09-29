import type { ReactNode } from "react";
import type { Crumb } from "@/lib/seo";
import type { Locale } from "@/lib/utils";
import { Breadcrumbs } from "./breadcrumbs";
import { SplitText } from "./fx";

/** Dark inner-page hero holding the page's single <h1>. */
export function PageHero({
  locale,
  crumbs,
  eyebrow,
  title,
  intro,
  children,
  aside,
}: {
  locale: Locale;
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="on-dark relative overflow-hidden text-white">
      {/* hairline arc + faint grid, as on the home hero */}
      <div
        className="pointer-events-none absolute start-1/2 top-24 aspect-square w-[max(110vw,70rem)] -translate-x-1/2 rounded-full border border-white/10 [mask-image:linear-gradient(to_bottom,black_15%,transparent_55%)] rtl:translate-x-1/2"
        aria-hidden
      />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <div className="container-x relative grid gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:items-center lg:py-24">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          <Breadcrumbs locale={locale} items={crumbs} />
          {eyebrow && (
            <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur sm:text-sm">
              <span className="size-2 rounded-full bg-brand-400 shadow-[0_0_12px_rgb(255_214_60/0.8)]" aria-hidden />
              {eyebrow}
            </p>
          )}
          <SplitText as="h1" text={title} className="mt-5 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl rtl:text-3xl rtl:leading-tight rtl:sm:text-4xl rtl:lg:text-5xl" />
          {intro && <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">{intro}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />
    </section>
  );
}
