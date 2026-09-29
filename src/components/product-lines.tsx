"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ProductLine = { id: Category; title: string; body: string; image: string; href: string };

const AUTOPLAY_MS = 7000;

/**
 * Stacked "folder" tabs — one gradient per product line — over a frosted panel.
 * Every panel stays in the DOM (inactive ones are inert) so all copy is crawlable.
 */
export function ProductLines({ items, labels }: { items: ProductLine[]; labels: { tablist: string; explore: string; quote: string } }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const playing = auto && !paused && inView && !reduce;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % items.length), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, active, items.length]);

  const select = (i: number, focus = false) => {
    setAuto(false);
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const rtl = document.documentElement.dir === "rtl";
    const next = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
    if (next) {
      e.preventDefault();
      select((active + next + items.length) % items.length, true);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      select(e.key === "Home" ? 0 : items.length - 1, true);
    }
  };

  const current = items[active]!;

  return (
    <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Folder tabs */}
      <div role="tablist" aria-label={labels.tablist} onKeyDown={onKey} className="relative flex overflow-x-auto px-2 pt-3 [scrollbar-width:none] sm:px-5 [&::-webkit-scrollbar]:hidden">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <button
              key={it.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${uid}-tab-${i}`}
              aria-selected={on}
              aria-controls={`${uid}-panel-${i}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              style={{ zIndex: on ? 30 : 20 - Math.abs(i - active) }}
              className={cn(
                `line-${it.id}`,
                "group relative shrink-0 rounded-t-2xl px-5 pb-5 pt-3.5 text-sm font-extrabold whitespace-nowrap transition-[translate,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-offset-[-4px] sm:min-w-44 sm:px-7 sm:text-base",
                i > 0 && "-ms-3",
                on ? "translate-y-0 text-ink-950" : "translate-y-2 text-white/85 hover:translate-y-1 hover:text-white",
              )}
            >
              <span
                aria-hidden
                className={cn("absolute inset-0 rounded-t-2xl shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.6)] transition-opacity duration-500", on ? "opacity-100" : "opacity-30 group-hover:opacity-50")}
                style={{ background: "var(--grad)" }}
              />
              {!on && <span aria-hidden className="absolute inset-0 rounded-t-2xl border border-b-0 border-white/10 bg-navy-900/50" />}
              <span className="relative">{it.title}</span>
              {on && playing && (
                <span
                  key={`p-${active}`}
                  aria-hidden
                  className="absolute inset-x-4 bottom-2.5 h-0.5 origin-left animate-tab-progress rounded-full bg-ink-950/35 rtl:origin-right"
                  style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className={cn(`line-${current.id}`, "relative -mt-2 overflow-hidden rounded-3xl border border-white/10 bg-navy-900/90 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] backdrop-blur-xl")}>
        <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 transition-[background] duration-700" style={{ background: "var(--grad)" }} />
        <div
          aria-hidden
          className="pointer-events-none absolute -end-24 -top-24 size-[16rem] sm:size-[28rem] rounded-full blur-3xl transition-[background-color] duration-700"
          style={{ backgroundColor: "var(--glow)" }}
        />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden />

        <div className="relative grid">
          {items.map((it, i) => {
            const on = i === active;
            return (
              <div
                key={it.id}
                role="tabpanel"
                id={`${uid}-panel-${i}`}
                aria-labelledby={`${uid}-tab-${i}`}
                inert={!on}
                className={cn(
                  `line-${it.id}`,
                  "grid gap-8 p-6 [grid-area:1/1] transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14",
                  on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
                )}
              >
                <div className="lg:col-span-5">
                  <p className="font-display text-sm font-extrabold tracking-[0.25em] text-white/50 rtl:tracking-normal" dir="ltr">
                    {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </p>
                  <h3 className="grad-text mt-4 text-4xl leading-none font-bold tracking-[-0.035em] sm:text-5xl lg:text-6xl rtl:text-4xl rtl:leading-tight rtl:tracking-normal rtl:lg:text-5xl">
                    {it.title}
                  </h3>
                  <p className="mt-5 max-w-md text-base leading-7 text-white/75 sm:text-lg">{it.body}</p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={it.href}
                      className="group/cta inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-bold text-ink-950 shadow-[0_12px_32px_-12px_var(--glow)] transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5"
                      style={{ background: "var(--grad)" }}
                    >
                      {labels.explore}
                      <span className="sr-only"> — {it.title}</span>
                      <ArrowRight className="flip-rtl size-4 transition-transform duration-300 group-hover/cta:translate-x-1 rtl:group-hover/cta:-translate-x-1" aria-hidden />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 font-bold text-white transition-[translate,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                    >
                      {labels.quote}
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <div className="relative mx-auto aspect-[16/11] w-full max-w-xl">
                    <div aria-hidden className="absolute inset-[12%] rounded-full blur-3xl" style={{ backgroundColor: "var(--glow)" }} />
                    <div className={cn("relative h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-900", on && !reduce && "animate-float")}>
                      <Image src={it.image} alt={it.title} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
