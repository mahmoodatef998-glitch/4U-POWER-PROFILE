import type { ReactNode } from "react";
import type { Crumb } from "@/lib/seo";
import type { Locale } from "@/lib/utils";
import { Breadcrumbs } from "./breadcrumbs";

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
    <section className="on-dark relative overflow-hidden bg-ink-950 text-white">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <div className="pointer-events-none absolute -top-40 end-0 size-[36rem] rounded-full bg-brand-500/10 blur-3xl" aria-hidden />
      <div className="container-x relative grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:items-center lg:py-20">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          <Breadcrumbs locale={locale} items={crumbs} />
          {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
          <h1 className="mt-3 text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">{title}</h1>
          {intro && <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{intro}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
      <div className="hazard relative h-1.5 w-full" aria-hidden />
    </section>
  );
}
