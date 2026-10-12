"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ProductLine = { id: Category; title: string; body: string; image: string; href: string };

const AUTOPLAY_MS = 3000;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Photo-led showcase of the product lines: a cinematic stage (cross-fade + slow zoom, copy over the photo) and an
 * index of every line beside it (a swipeable chip rail on mobile). Advances every 3 s; pauses while the index is
 * hovered or focused, when off-screen, for reduced motion, or with the pause button. Every slide stays in the DOM.
 */
export function ProductLines({ items, labels }: { items: ProductLine[]; labels: { tablist: string; explore: string; quote: string; prev: string; next: string } }) {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const uid = useId();
  const swipe = useRef<number | null>(null);
  const playing = !paused && !hover && !focus && inView && !reduce;
  const n = items.length;
  const ar = useLocale() === "ar";

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % n), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, active, n]);

  // keep the active chip centred in the mobile rail without moving the page
  useEffect(() => {
    const r = rail.current;
    const el = r?.querySelector<HTMLElement>(`[data-i="${active}"]`);
    if (!r || !el || r.scrollWidth <= r.clientWidth + 1) return;
    const a = el.getBoundingClientRect();
    const b = r.getBoundingClientRect();
    r.scrollBy({ left: a.left + a.width / 2 - (b.left + b.width / 2), behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  const go = (d: number) => setActive((a) => (a + d + n) % n);
  const rtl = () => document.documentElement.dir === "rtl";
  const onKey = (e: KeyboardEvent) => {
    const fwd = e.key === "ArrowDown" || e.key === (rtl() ? "ArrowLeft" : "ArrowRight");
    const back = e.key === "ArrowUp" || e.key === (rtl() ? "ArrowRight" : "ArrowLeft");
    if (!fwd && !back) return;
    e.preventDefault();
    const next = (active + (fwd ? 1 : -1) + n) % n;
    setActive(next);
    rail.current?.querySelector<HTMLElement>(`[data-i="${next}"]`)?.focus();
  };
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") swipe.current = e.clientX;
  };
  const onUp = (e: PointerEvent) => {
    if (swipe.current == null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 40) go((dx < 0 ? 1 : -1) * (rtl() ? -1 : 1));
  };

  const current = items[active]!;
  const glass = "grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20";

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label={labels.tablist}
      className={cn(`line-${current.id}`, "overflow-hidden rounded-[2rem] border border-line bg-navy-900 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.45)] lg:grid lg:grid-cols-12")}
    >
      {/* ------------------------------------------------ stage */}
      <div className="stage-dark relative aspect-[4/5] overflow-hidden bg-navy-950 sm:aspect-[16/10] lg:col-span-8 lg:aspect-auto lg:min-h-[36rem]" onPointerDown={onDown} onPointerUp={onUp}>
        {items.map((it, i) => {
          const on = i === active;
          return (
            <div
              key={it.id}
              id={`${uid}-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${i}`}
              aria-roledescription="slide"
              inert={!on}
              className={cn(`line-${it.id}`, "absolute inset-0 transition-opacity duration-[900ms]", on ? "z-10 opacity-100" : "z-0 opacity-0")}
            >
              <Image
                src={it.image}
                alt={it.title}
                fill
                priority={i === 0}
                sizes="(min-width:1024px) 66vw, 100vw"
                className={cn("object-cover transition-transform ease-out", on ? "scale-100 duration-[3600ms]" : "scale-110 duration-0")}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#060a16] via-[#060a16]/45 to-[#060a16]/10" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#060a16]/55 to-transparent rtl:bg-gradient-to-l" />

              <div className="absolute inset-x-0 bottom-0 p-6 pb-20 sm:p-10 sm:pb-24 lg:p-12 lg:pb-12">
                <p className={cn("inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-md transition-[translate,opacity] duration-700", EASE, on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}>
                  <span aria-hidden className="size-2 rounded-full" style={{ background: "var(--grad)" }} />
                  <span dir="ltr">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
                </p>
                <h3 className={cn("mt-4 max-w-xl text-4xl leading-[1.05] font-bold tracking-tight text-white transition-[translate,opacity] delay-75 duration-700 sm:text-5xl rtl:leading-tight rtl:tracking-normal", EASE, on ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0")}>
                  {it.title}
                </h3>
                <p className={cn("mt-3 max-w-lg text-base leading-7 text-white/80 transition-[translate,opacity] delay-100 duration-700 sm:text-lg", EASE, on ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0")}>{it.body}</p>
                <div className={cn("mt-6 flex flex-wrap gap-3 transition-[translate,opacity] delay-150 duration-700", EASE, on ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0")}>
                  <Link
                    href={it.href}
                    className="group/cta inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-bold text-[#0a0a0b] shadow-[0_12px_32px_-12px_var(--glow)] transition-[translate] duration-300 hover:-translate-y-0.5"
                    style={{ background: "var(--grad)" }}
                  >
                    {labels.explore}
                    <span className="sr-only"> — {it.title}</span>
                    <ArrowRight className="flip-rtl size-4 transition-transform duration-300 group-hover/cta:translate-x-1 rtl:group-hover/cta:-translate-x-1" aria-hidden />
                  </Link>
                  <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 font-bold text-white backdrop-blur-md transition-[translate,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/20">
                    {labels.quote}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* story-style progress across the top */}
        <div className="absolute inset-x-6 top-6 z-20 flex gap-1.5 sm:inset-x-10 lg:inset-x-12" aria-hidden>
          {items.map((it, i) => (
            <span key={it.id} className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/25">
              <span
                key={i === active ? `p-${active}-${playing}` : undefined}
                className={cn("absolute inset-0 origin-left rounded-full bg-white rtl:origin-right", i === active && playing && "animate-tab-progress")}
                style={{ animationDuration: `${AUTOPLAY_MS}ms`, transform: i < active || (i === active && !playing) ? "scaleX(1)" : i > active ? "scaleX(0)" : undefined }}
              />
            </span>
          ))}
        </div>

        <div className="absolute bottom-5 end-5 z-20 flex gap-2 sm:bottom-6 sm:end-6 lg:hidden">
          <button type="button" onClick={() => go(-1)} aria-label={labels.prev} className={glass}>
            <ArrowLeft className="flip-rtl size-5" aria-hidden />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={labels.next} className={glass}>
            <ArrowRight className="flip-rtl size-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------ index */}
      <div className="flex flex-col lg:col-span-4" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <div
          ref={rail}
          role="tablist"
          aria-label={labels.tablist}
          aria-orientation="vertical"
          onKeyDown={onKey}
          onFocus={() => setFocus(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocus(false)}
          className="flex gap-2 overflow-x-auto p-3 [scrollbar-width:none] lg:flex-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-4 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((it, i) => {
            const on = i === active;
            return (
              <button
                key={it.id}
                id={`${uid}-tab-${i}`}
                data-i={i}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`${uid}-panel-${i}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  `line-${it.id}`,
                  "group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-2xl p-2 pe-4 text-start transition-colors duration-300 lg:shrink lg:pe-3",
                  on ? "bg-surface ring-1 ring-line" : "hover:bg-surface/70",
                )}
              >
                <span aria-hidden className={cn("absolute inset-y-3 start-0 w-1 rounded-full transition-opacity duration-300", on ? "opacity-100" : "opacity-0")} style={{ background: "var(--grad)" }} />
                <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-navy-950 ring-1 ring-line lg:size-14">
                  <Image src={it.image} alt="" fill sizes="56px" className={cn("object-cover transition-transform duration-500", on ? "scale-110" : "group-hover:scale-105")} />
                </span>
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className={cn("font-display text-xs font-extrabold tabular-nums transition-colors", on ? "text-brand-500" : "text-muted")} dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={cn("whitespace-nowrap text-sm font-bold transition-colors lg:text-base", on ? "text-ink" : "text-muted group-hover:text-ink")}>{it.title}</span>
                  </span>
                  <span className={cn("mt-0.5 hidden text-xs leading-5 text-muted lg:line-clamp-1", on ? "lg:block" : "lg:hidden")}>{it.body}</span>
                </span>
                {on && (
                  <span aria-hidden className="absolute inset-x-3 bottom-1 hidden h-0.5 overflow-hidden rounded-full bg-line lg:block">
                    <span key={`b-${active}-${playing}`} className={cn("absolute inset-0 origin-left rounded-full rtl:origin-right", playing && "animate-tab-progress")} style={{ background: "var(--grad)", animationDuration: `${AUTOPLAY_MS}ms`, transform: playing ? undefined : "scaleX(1)" }} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center justify-between gap-3 border-t border-line px-6 py-4 lg:flex">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface hover:text-ink"
          >
            {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
            <span>{paused ? (ar ? "تشغيل" : "Play") : ar ? "إيقاف مؤقت" : "Pause"}</span>
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label={labels.prev} className="grid size-11 place-items-center rounded-full border border-line text-ink transition hover:bg-surface">
              <ArrowLeft className="flip-rtl size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={labels.next} className="grid size-11 place-items-center rounded-full border border-line text-ink transition hover:bg-surface">
              <ArrowRight className="flip-rtl size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
