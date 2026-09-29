"use client";

import { MapPin, Gauge } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useMemo, useState } from "react";
import { marketFlags, marketShort, sectorLabels } from "@/content/taxonomy";
import type { MarketCode, Project, Sector } from "@/lib/types";
import { cn, formatNumber, type Locale } from "@/lib/utils";

export function ProjectGrid({ projects, labels }: { projects: Project[]; labels: { all: string; country: string; sector: string } }) {
  const locale = useLocale() as Locale;
  const [country, setCountry] = useState<MarketCode | "all">("all");
  const [sector, setSector] = useState<Sector | "all">("all");
  const countries = useMemo(() => [...new Set(projects.map((p) => p.country))], [projects]);
  const sectors = useMemo(() => [...new Set(projects.map((p) => p.sector))], [projects]);
  const list = projects.filter((p) => (country === "all" || p.country === country) && (sector === "all" || p.sector === sector));
  const chip = (a: boolean) =>
    cn("rounded-full border px-3.5 py-2 text-sm font-semibold transition", a ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white text-slate-700 hover:border-slate-400");

  return (
    <div>
      <div className="grid gap-5">
        <div role="group" aria-label={labels.country} className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={country === "all"} onClick={() => setCountry("all")} className={chip(country === "all")}>{labels.all}</button>
          {countries.map((c) => (
            <button key={c} type="button" aria-pressed={country === c} onClick={() => setCountry(c)} className={chip(country === c)}>
              <span aria-hidden>{marketFlags[c]}</span> {marketShort[c][locale]}
            </button>
          ))}
        </div>
        <div role="group" aria-label={labels.sector} className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={sector === "all"} onClick={() => setSector("all")} className={chip(sector === "all")}>{labels.all}</button>
          {sectors.map((s) => (
            <button key={s} type="button" aria-pressed={sector === s} onClick={() => setSector(s)} className={chip(sector === s)}>
              {sectorLabels[s][locale]}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {list.map((p) => {
          const title = locale === "ar" ? p.title_ar : p.title_en;
          return (
            <li key={p.slug}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative aspect-[4/3] bg-navy-900">
                  {p.images[0] && <Image src={p.images[0]} alt={title} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" />}
                  <span className="absolute start-3 top-3 rounded-full bg-navy-950/85 px-2.5 py-1 text-xs font-bold text-white">{sectorLabels[p.sector][locale]}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg leading-snug">{title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted">{locale === "ar" ? p.summary_ar : p.summary_en}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-ink">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4 text-amber-600" aria-hidden />
                      {marketShort[p.country][locale]}
                    </span>
                    {p.kva && (
                      <span className="flex items-center gap-1.5" dir="ltr">
                        <Gauge className="size-4 text-amber-600" aria-hidden />
                        {formatNumber(p.kva, locale)} kVA
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
