"use client";

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { marketShort } from "@/content/taxonomy";
import type { Testimonial } from "@/lib/types";
import type { Locale } from "@/lib/utils";

export function TestimonialsCarousel({ items, labels }: { items: Testimonial[]; labels: { prev: string; next: string } }) {
  const locale = useLocale() as Locale;
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const rtl = locale === "ar" ? -1 : 1;
    el.scrollBy({ left: dir * rtl * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div>
      <ul ref={track} className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none]" aria-roledescription="carousel">
        {items.map((t, i) => (
          <li key={i} className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[32%]">
            <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <Quote className="flip-rtl size-8 text-brand-400" aria-hidden />
              <div className="mt-3 flex gap-0.5" aria-label={`${t.rating}/5`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={s < t.rating ? "size-4 fill-brand-400 text-brand-400" : "size-4 text-white/20"} aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-base leading-7 text-white/85">“{locale === "ar" ? t.quote_ar : t.quote_en}”</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-bold text-white">{t.client_name}</span>
                {t.client_company && <span className="text-white/60"> · {t.client_company}</span>}
                {t.country && <span className="text-white/60"> · {marketShort[t.country][locale]}</span>}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={() => scroll(-1)} aria-label={labels.prev} className="grid size-11 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10">
          <ChevronLeft className="flip-rtl size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label={labels.next} className="grid size-11 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10">
          <ChevronRight className="flip-rtl size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
