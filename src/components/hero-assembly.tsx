"use client";

import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRef, type ReactNode } from "react";
import type { Locale } from "@/lib/utils";

/**
 * Scroll-driven "exploded view → assembled generator" hero.
 * Layers are cut from the client's exploded-view render (public/images/hero/layers, 1536×840 canvas).
 * Each part travels from its exploded position to its assembled position in its own scroll window,
 * so the set is built piece by piece. Pure transforms (GPU), no video, no canvas.
 */
const CANVAS = { w: 1536, h: 840 };

type Part = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** assembled offset in canvas px */
  dx: number;
  dy: number;
  /** scroll window [start, end] within 0..1 */
  win: [number, number];
  z: number;
  label: { en: string; ar: string };
  /** callout anchor inside the part, 0..1 */
  anchor: [number, number];
};

const PARTS: Part[] = [
  { id: "base-frame", x: 276, y: 613, w: 964, h: 211, dx: 0, dy: 0, win: [0, 0], z: 1, label: { en: "Base frame & anti-vibration mounts", ar: "القاعدة ومساند منع الاهتزاز" }, anchor: [0.2, 0.75] },
  { id: "engine", x: 618, y: 147, w: 559, h: 488, dx: -8, dy: 26, win: [0.04, 0.26], z: 4, label: { en: "Diesel engine", ar: "محرك الديزل" }, anchor: [0.55, 0.45] },
  { id: "alternator", x: 360, y: 339, w: 297, h: 279, dx: -18, dy: 44, win: [0.14, 0.36], z: 3, label: { en: "Brushless alternator", ar: "الدينامو (بدون فرش)" }, anchor: [0.62, -0.06] },
  { id: "radiator", x: 1167, y: 140, w: 353, h: 464, dx: -34, dy: 40, win: [0.22, 0.44], z: 5, label: { en: "Radiator & cooling fan", ar: "المبرد ومروحة التبريد" }, anchor: [0.5, 0.18] },
  { id: "end-cover", x: 16, y: 334, w: 189, h: 322, dx: 196, dy: 36, win: [0.3, 0.52], z: 2, label: { en: "Alternator end cover", ar: "غطاء الدينامو الخلفي" }, anchor: [0.3, -0.08] },
  { id: "control-panel", x: 216, y: 345, w: 154, h: 326, dx: 86, dy: 22, win: [0.38, 0.6], z: 6, label: { en: "AMF control panel", ar: "لوحة التحكم AMF" }, anchor: [0.4, 1.06] },
  { id: "air-filter", x: 529, y: 64, w: 239, h: 153, dx: 118, dy: 96, win: [0.46, 0.68], z: 7, label: { en: "Air filter assembly", ar: "مجموعة فلتر الهواء" }, anchor: [0.3, 0.3] },
  { id: "silencer", x: 881, y: 45, w: 104, h: 123, dx: 2, dy: 78, win: [0.54, 0.76], z: 7, label: { en: "Exhaust silencer", ar: "كاتم العادم" }, anchor: [0.5, 0.2] },
];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/** 1 → 0 between from..to. Function-form transforms keep these on the JS path (the accelerated
 *  ScrollTimeline path did not apply reliably to these absolutely positioned overlays). */
const fade = (v: number, from: number, to: number) => (v <= from ? 1 : v >= to ? 0 : 1 - (v - from) / (to - from));

function Layer({ part, progress, still, priority }: { part: Part; progress: MotionValue<number>; still: boolean; priority?: boolean }) {
  const [a, b] = part.win;
  const moves = b > a;
  const x = useTransform(progress, [a, b], ["0%", pct(part.dx, CANVAS.w)], { clamp: true });
  const y = useTransform(progress, [a, b], ["0%", pct(part.dy, CANVAS.h)], { clamp: true });
  const style = still || !moves ? { x: still ? pct(part.dx, CANVAS.w) : "0%", y: still ? pct(part.dy, CANVAS.h) : "0%" } : { x, y };
  return (
    <m.div className="absolute inset-0 will-change-transform" style={{ ...style, zIndex: part.z }}>
      <Image
        src={`/images/hero/layers/${part.id}.webp`}
        alt=""
        width={part.w}
        height={part.h}
        priority={priority}
        fetchPriority={priority ? "high" : "low"}
        loading={priority ? undefined : "eager"}
        // each part only occupies part.w/1536 of the stage (≈56vw desktop, 118vw mobile)
        sizes={`(min-width:1024px) ${Math.ceil((part.w / CANVAS.w) * 56)}vw, ${Math.ceil((part.w / CANVAS.w) * 118)}vw`}
        className="absolute h-auto drop-shadow-[0_24px_24px_rgb(0_0_0/0.18)]"
        style={{ left: pct(part.x, CANVAS.w), top: pct(part.y, CANVAS.h), width: pct(part.w, CANVAS.w) }}
      />
    </m.div>
  );
}

function Callout({ part, index, progress, locale }: { part: Part; index: number; progress: MotionValue<number>; locale: Locale }) {
  const [a] = part.win;
  const opacity = useTransform(progress, (v) => fade(v, Math.max(0, a - 0.06), a + 0.02));
  const left = part.x + part.w * part.anchor[0];
  const top = part.y + part.h * part.anchor[1];
  return (
    <m.div
      className="pointer-events-none absolute z-20 hidden -tranzinc-y-1/2 items-center gap-2 sm:flex"
      style={{ left: pct(left, CANVAS.w), top: pct(top, CANVAS.h), opacity }}
      aria-hidden
    >
      <span className="grid size-6 place-items-center rounded-full bg-brand-400 font-display text-xs font-extrabold text-ink-950 ring-4 ring-brand-400/25">
        {index + 1}
      </span>
      <span className="whitespace-nowrap rounded-md bg-ink-950/90 px-2 py-1 text-[11px] font-bold text-white shadow-lg backdrop-blur">
        {part.label[locale]}
      </span>
    </m.div>
  );
}

export function HeroAssembly({ children, strings }: { children: ReactNode; strings: { scroll: string; assembled: string; progress: string } }) {
  const locale = useLocale() as Locale;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const still = !!reduce;

  const barScale = useTransform(scrollYProgress, [0, 0.76], [0, 1], { clamp: true });
  const hintOpacity = useTransform(scrollYProgress, (v) => fade(v, 0, 0.08));
  const doneOpacity = useTransform(scrollYProgress, (v) => 1 - fade(v, 0.74, 0.82));
  const stageScale = useTransform(scrollYProgress, [0, 0.8], [0.96, 1.04]);
  const glow = useTransform(scrollYProgress, [0.6, 0.85], [0.25, 0.7]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section ref={ref} className={still ? "relative bg-surface" : "relative h-[240vh] bg-surface lg:h-[300vh]"} aria-label={strings.progress}>
        <div className={still ? "relative" : "sticky top-16 h-[calc(100svh-4rem)] overflow-hidden lg:top-18 lg:h-[calc(100svh-4.5rem)]"}>
          {/* backdrop: blueprint grid + brand glow */}
          <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(17_17_19/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(17_17_19/0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" aria-hidden />
          <m.div className="pointer-events-none absolute end-[-10%] top-1/2 size-[60vw] max-w-[900px] -tranzinc-y-1/2 rounded-full bg-brand-400 blur-[120px]" style={{ opacity: still ? 0.5 : glow }} aria-hidden />

          <div className="container-x relative grid h-full grid-rows-[auto_1fr] gap-4 py-6 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-8 lg:py-10">
            <div className="relative z-30 lg:col-span-5">{children}</div>

            <div className="relative flex min-h-0 items-center lg:col-span-7">
              <m.div className="relative -mx-[9%] w-[118%] sm:mx-0 sm:w-full" style={{ aspectRatio: `${CANVAS.w} / ${CANVAS.h}`, scale: still ? 1 : stageScale }}>
                {PARTS.map((p) => (
                  <Layer key={p.id} part={p} progress={scrollYProgress} still={still} priority={p.id === "engine"} />
                ))}
                {!still && PARTS.map((p, i) => <Callout key={p.id} part={p} index={i} progress={scrollYProgress} locale={locale} />)}
                {/* floor shadow */}
                <div className="absolute inset-x-[15%] bottom-[-2%] h-[6%] rounded-[50%] bg-ink-950/20 blur-xl" aria-hidden />
              </m.div>
            </div>
          </div>

          {!still && (
            <>
              {/* assembly progress */}
              <div className="absolute inset-x-0 bottom-0 z-30 h-1 bg-ink-950/10">
                <m.div className="hazard h-full origin-left rtl:origin-right" style={{ scaleX: barScale }} />
              </div>
              <m.p style={{ opacity: hintOpacity }} className="absolute bottom-5 start-1/2 z-30 hidden -tranzinc-x-1/2 items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted rtl:tranzinc-x-1/2 rtl:tracking-normal lg:flex">
                <span className="inline-block h-6 w-3.5 rounded-full border-2 border-ink-600 p-0.5" aria-hidden>
                  <span className="block h-1.5 w-full animate-bounce rounded-full bg-ink-600" />
                </span>
                {strings.scroll}
              </m.p>
              <m.p style={{ opacity: doneOpacity }} className="absolute bottom-5 start-1/2 z-30 inline-flex -tranzinc-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-ink-950 px-4 py-2 text-xs font-bold text-white shadow-xl rtl:tranzinc-x-1/2">
                <span className="size-2 rounded-full bg-brand-400" aria-hidden />
                {strings.assembled}
              </m.p>
            </>
          )}
        </div>
      </section>
    </LazyMotion>
  );
}
