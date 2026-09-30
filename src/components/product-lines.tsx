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
  const track = useRef<HTMLUListElement>(null);
  const [step, setStep] = useState(0);
  const [rtl, setRtl] = useState(false);
  const [active, setActive] = useState(0);
  const n = items.length;

  // one "step" = card width + gap, so every stop centres a whole card
  useLayoutEffect(() => {
    if (reduce) return;
    setRtl(document.documentElement.dir === "rtl");
    const measure = () => {
      const li = track.current?.children;
      if (!li || li.length < 2) return;
      setStep(Math.abs((li[1] as HTMLElement).offsetLeft - (li[0] as HTMLElement).offsetLeft));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.3, restDelta: 0.0005 });
  // stepped travel: each card holds still for most of its scroll share, then glides to the next
  const pos = useTransform(progress, (p) => {
    const t = Math.min(n - 1, Math.max(0, p * (n - 1)));
    const i = Math.floor(t);
    const f = t - i;
    const HOLD = 0.45;
    const g = f < HOLD ? 0 : (f - HOLD) / (1 - HOLD);
    const e = g < 0.5 ? 4 * g ** 3 : 1 - (-2 * g + 2) ** 3 / 2;
    return i + e;
  });
  const x = useTransform(pos, (v) => (rtl ? 1 : -1) * v * step);
  useMotionValueEvent(pos, "change", (v) => setActive(Math.min(n - 1, Math.round(v))));

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
      <div className="container-x">{heading}</div>
      {/* tall wrapper = scroll distance (≈ 70% of a screen per card); the stage stays pinned */}
      <div ref={section} className="relative mt-6" style={{ height: `${100 + (n - 1) * 70}svh` }} aria-label={labels.region} role="region">
        <div className="sticky top-0 flex h-svh flex-col justify-center gap-5 overflow-hidden pb-24 pt-20 md:pb-8 lg:pt-24">
          <div className="container-x flex items-center justify-between gap-4">
            <p className="font-display text-3xl font-extrabold tabular-nums text-white/25 sm:text-4xl" dir="ltr" aria-hidden>
              <span className="text-white/85">{String(active + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
            </p>
            <div className="flex gap-1.5" aria-hidden>
              {items.map((it, i) => (
                <span key={it.id} className={cn("h-1.5 rounded-full transition-all duration-500", i === active ? "w-10 bg-white/80" : "w-3 bg-white/20")} />
              ))}
            </div>
          </div>

          <div className="container-x min-h-0">
            <m.ul ref={track} style={{ x }} className="flex w-full gap-6 will-change-transform">
              {items.map((it, i) => (
                <li key={it.id} className="w-full shrink-0" aria-hidden={i !== active || undefined}>
                  <FocusCard pos={pos} index={i}>
                    <Card item={it} index={i} total={n} labels={labels} />
                  </FocusCard>
                </li>
              ))}
            </m.ul>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}

/** Cards settle to full size in focus and ease back slightly while sliding. */
function FocusCard({ pos, index, children }: { pos: MotionValue<number>; index: number; children: ReactNode }) {
  const d = useTransform(pos, (v) => Math.min(1, Math.abs(v - index)));
  const scale = useTransform(d, (v) => 1 - 0.05 * v);
  const opacity = useTransform(d, (v) => 1 - 0.5 * v);
  return (
    <m.div className="origin-center" style={{ scale, opacity }}>
      {children}
    </m.div>
  );
}

function Card({ item: it, index, total, labels }: { item: ProductLine; index: number; total: number; labels: Labels }) {
  return (
    <article className={cn(`line-${it.id}`, "spotlight relative flex h-[min(34rem,calc(100svh-14rem))] min-h-[24rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-navy-900/90 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.55)] lg:flex-row")}>
      <div aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: "var(--grad)" }} />
      <div aria-hidden className="pointer-events-none absolute -end-24 -top-24 size-[20rem] rounded-full blur-3xl sm:size-[30rem]" style={{ backgroundColor: "var(--glow)" }} />
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative flex shrink-0 flex-col justify-center p-6 sm:p-8 lg:flex-1 lg:basis-1/2 lg:p-12">
        <p className="font-display text-sm font-extrabold tracking-[0.25em] text-white/45 rtl:tracking-normal" dir="ltr">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 className="grad-text mt-3 text-4xl leading-[0.98] font-bold tracking-[-0.04em] sm:text-5xl xl:text-6xl rtl:leading-tight rtl:tracking-normal">{it.title}</h3>
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

      <div className="relative min-h-0 flex-1 p-4 pt-0 sm:p-6 sm:pt-0 lg:basis-1/2 lg:p-8 lg:ps-0">
        <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-navy-950">
          <Image src={it.image} alt={it.title} fill sizes="(min-width:1024px) 40vw, 92vw" className="object-cover" />
        </div>
      </div>
    </article>
  );
}
