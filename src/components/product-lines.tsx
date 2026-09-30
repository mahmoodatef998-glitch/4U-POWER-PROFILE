"use client";

import { LazyMotion, domAnimation, m, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ProductLine = { id: Category; title: string; body: string; image: string; href: string };
type Labels = { region: string; explore: string; quote: string };

/**
 * Pinned horizontal showcase: the section sticks to the viewport while vertical scrolling slides a row of
 * large product-line cards sideways (right-to-left in English, left-to-right in Arabic). The scroll length
 * is measured from the track, so one pixel of wheel = one pixel of travel. Reduced motion → plain stack.
 */
export function ProductLines({ items, labels, heading }: { items: ProductLine[]; labels: Labels; heading?: ReactNode }) {
  const reduce = useReducedMotion();
  const section = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);
  const [rtl, setRtl] = useState(false);
  const [active, setActive] = useState(0);
  const n = items.length;

  // measure how far the track has to travel
  useLayoutEffect(() => {
    if (reduce) return;
    setRtl(document.documentElement.dir === "rtl");
    const measure = () => {
      if (!track.current || !viewport.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - viewport.current.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    if (viewport.current) ro.observe(viewport.current);
    return () => ro.disconnect();
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.3, restDelta: 0.0005 });
  const x = useTransform(progress, (p) => (rtl ? 1 : -1) * p * distance);
  const bar = useTransform(progress, (p) => p);
  useMotionValueEvent(progress, "change", (p) => setActive(Math.min(n - 1, Math.round(p * (n - 1)))));

  if (reduce)
    return (
      <div className="container-x">
        {heading}
        <ul className="mt-10 grid gap-5">
          {items.map((it, i) => (
            <li key={it.id}>
              <Card item={it} index={i} total={n} labels={labels} />
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <LazyMotion features={domAnimation} strict>
      {/* the tall wrapper supplies the scroll distance; the inner stage stays pinned */}
      <div ref={section} className="relative" style={{ height: `calc(100svh + ${distance}px)` }} aria-label={labels.region} role="region">
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pb-24 pt-24 sm:pt-28 md:pb-6">
          <div className="container-x flex items-end justify-between gap-6">
            <div className="min-w-0 flex-1">{heading}</div>
            <p className="hidden shrink-0 font-display text-5xl font-extrabold tabular-nums text-white/15 sm:block" dir="ltr" aria-hidden>
              <span className="text-white/80">{String(active + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
            </p>
          </div>

          <div ref={viewport} className="mt-8 min-h-0 flex-1 sm:mt-10">
            <m.ul ref={track} style={{ x }} className="flex h-full w-max gap-5 px-4 will-change-transform sm:gap-6 sm:px-[max(1.5rem,calc((100vw-80rem)/2+2rem))]">
              {items.map((it, i) => (
                <li key={it.id} className="h-full w-[86vw] shrink-0 sm:w-[min(78vw,68rem)]">
                  <FocusCard progress={progress} index={i} total={n}>
                    <Card item={it} index={i} total={n} labels={labels} />
                  </FocusCard>
                </li>
              ))}
            </m.ul>
          </div>

          {/* progress */}
          <div className="container-x mt-6 flex items-center gap-4">
            <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <m.div className="absolute inset-0 origin-left rounded-full bg-[linear-gradient(90deg,var(--color-line-gen-a),var(--color-line-ats-a),var(--color-line-sw-b),var(--color-line-mdb-b))] rtl:origin-right" style={{ scaleX: bar }} />
            </div>
            <p className="text-sm font-semibold text-white/60 sm:hidden" dir="ltr">
              {active + 1} / {n}
            </p>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}

/** Cards ease up to full size as they reach the focus position and settle back as they leave. */
function FocusCard({ progress, index, total, children }: { progress: MotionValue<number>; index: number; total: number; children: ReactNode }) {
  const d = useTransform(progress, (p) => Math.min(1, Math.abs(p * (total - 1) - index)));
  const scale = useTransform(d, (v) => 1 - 0.06 * v);
  const opacity = useTransform(d, (v) => 1 - 0.35 * v);
  return (
    <m.div className="h-full origin-center" style={{ scale, opacity }}>
      {children}
    </m.div>
  );
}

function Card({ item: it, index, total, labels }: { item: ProductLine; index: number; total: number; labels: Labels }) {
  return (
    <article className={cn(`line-${it.id}`, "spotlight relative flex h-full min-h-[26rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-navy-900/90 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.55)] lg:flex-row")}>
      <div aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: "var(--grad)" }} />
      <div aria-hidden className="pointer-events-none absolute -end-24 -top-24 size-[20rem] rounded-full blur-3xl sm:size-[30rem]" style={{ backgroundColor: "var(--glow)" }} />
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative flex flex-1 flex-col justify-center p-6 sm:p-10 lg:basis-1/2 lg:p-14">
        <p className="font-display text-sm font-extrabold tracking-[0.25em] text-white/45 rtl:tracking-normal" dir="ltr">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 className="grad-text mt-3 text-4xl leading-[0.98] font-bold tracking-[-0.04em] sm:text-6xl xl:text-7xl rtl:leading-tight rtl:tracking-normal">{it.title}</h3>
        <p className="mt-4 max-w-md text-base leading-7 text-white/70 sm:mt-5 sm:text-lg">{it.body}</p>
        <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
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

      <div className="relative min-h-40 flex-1 p-4 pt-0 sm:p-8 sm:pt-0 lg:basis-1/2 lg:p-10 lg:ps-0">
        <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-navy-950">
          <Image src={it.image} alt={it.title} fill sizes="(min-width:1024px) 34vw, 86vw" className="object-cover" />
        </div>
      </div>
    </article>
  );
}
