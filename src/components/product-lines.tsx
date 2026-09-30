"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ProductLine = { id: Category; title: string; body: string; image: string; href: string };

const AUTOPLAY_MS = 2500;

/**
 * Auto-rotating showcase of the product lines: one panel, the line name as a big headline inside it,
 * slim progress dots and arrows at the bottom. Keeps rotating on hover; pauses only for keyboard focus and when off-screen.
 * Every slide stays in the DOM (inactive ones inert) so all copy is crawlable.
 */
export function ProductLines({ items, labels }: { items: ProductLine[]; labels: { tablist: string; explore: string; quote: string; prev: string; next: string } }) {
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const uid = useId();
  const swipe = useRef<number | null>(null);
  const playing = !hold && inView && !reduce;
  const n = items.length;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % n), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, active, n]);

  const go = (d: number) => setActive((a) => (a + d + n) % n);
  const rtl = () => document.documentElement.dir === "rtl";

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(rtl() ? -1 : 1);
    else if (e.key === "ArrowLeft") go(rtl() ? 1 : -1);
    else return;
    e.preventDefault();
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

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label={labels.tablist}
      onKeyDown={onKey}
      // keeps rotating under the mouse; only keyboard focus pauses it (so keyboard users can reach the links)
      onFocusCapture={(e) => setHold((e.target as HTMLElement).matches(":focus-visible"))}
      onBlurCapture={() => setHold(false)}
      onPointerDown={onDown}
      onPointerUp={onUp}
      className={cn(`line-${current.id}`, "relative overflow-hidden rounded-[2rem] border border-white/10 bg-navy-900/90 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)] backdrop-blur-xl")}
    >
      {/* colour wash follows the active line */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 transition-[background] duration-700" style={{ background: "var(--grad)" }} />
      <div aria-hidden className="pointer-events-none absolute -end-24 -top-24 size-[18rem] rounded-full blur-3xl transition-[background-color] duration-1000 sm:size-[32rem]" style={{ backgroundColor: "var(--glow)" }} />
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative grid" aria-live={playing ? "off" : "polite"}>
        {items.map((it, i) => {
          const on = i === active;
          return (
            <div
              key={it.id}
              id={`${uid}-slide-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${n}: ${it.title}`}
              inert={!on}
              className={cn(
                `line-${it.id}`,
                "grid gap-8 p-6 pb-24 [grid-area:1/1] sm:p-10 sm:pb-28 lg:grid-cols-12 lg:items-center lg:gap-10 lg:p-14 lg:pb-28",
                on ? "pointer-events-auto" : "pointer-events-none",
              )}
            >
              <div className="lg:col-span-6">
                <p
                  className={cn("font-display text-sm font-extrabold tracking-[0.25em] text-white/45 transition-opacity duration-500 rtl:tracking-normal", on ? "opacity-100" : "opacity-0")}
                  dir="ltr"
                >
                  {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </p>
                {/* headline slides up out of a mask */}
                <div className="mt-3 overflow-hidden pb-2">
                  <h3
                    className={cn(
                      "grad-text text-5xl leading-[0.98] font-bold tracking-[-0.04em] transition-[translate,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-6xl lg:text-7xl xl:text-[5.5rem] rtl:text-5xl rtl:leading-tight rtl:tracking-normal rtl:lg:text-6xl",
                      on ? "translate-y-0 opacity-100" : "translate-y-[60%] opacity-0",
                    )}
                  >
                    {it.title}
                  </h3>
                </div>
                <p
                  className={cn(
                    "mt-5 max-w-md text-base leading-7 text-white/70 transition-[translate,opacity] delay-100 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-lg",
                    on ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                  )}
                >
                  {it.body}
                </p>
                <div
                  className={cn(
                    "mt-8 flex flex-col gap-3 transition-[translate,opacity] delay-150 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:flex-row",
                    on ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                  )}
                >
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

              <div className="lg:col-span-6">
                <div
                  className={cn(
                    "relative mx-auto aspect-[16/11] w-full max-w-xl transition-[translate,opacity,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    on ? "translate-x-0 scale-100 opacity-100" : "translate-x-8 scale-95 opacity-0 rtl:-translate-x-8",
                  )}
                >
                  <div aria-hidden className="absolute inset-[12%] rounded-full blur-3xl" style={{ backgroundColor: "var(--glow)" }} />
                  <div className={cn("relative h-full overflow-hidden rounded-2xl border border-white/10 bg-navy-950", on && !reduce && "animate-float")}>
                    <Image src={it.image} alt={it.title} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* controls: progress dots + arrows */}
      <div className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-4 sm:inset-x-10 sm:bottom-8 lg:inset-x-14">
        <div className="flex flex-1 items-center gap-1.5 sm:gap-2">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setActive(i)}
              aria-controls={`${uid}-slide-${i}`}
              aria-current={i === active ? "true" : undefined}
              aria-label={it.title}
              title={it.title}
              className={cn("relative h-1.5 overflow-hidden rounded-full bg-white/15 transition-[width] duration-500", i === active ? "w-12 sm:w-16" : "w-4 hover:bg-white/30 sm:w-6")}
            >
              {i === active && (
                <span
                  key={`p-${active}-${playing}`}
                  aria-hidden
                  className={cn("absolute inset-0 origin-left rounded-full rtl:origin-right", playing ? "animate-tab-progress" : "")}
                  style={{ background: "var(--grad)", animationDuration: `${AUTOPLAY_MS}ms`, transform: playing ? undefined : "scaleX(1)" }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(-1)} aria-label={labels.prev} className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10">
            <ArrowLeft className="flip-rtl size-5" aria-hidden />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={labels.next} className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10">
            <ArrowRight className="flip-rtl size-5" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
