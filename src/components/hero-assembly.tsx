"use client";

import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { cn, type Locale } from "@/lib/utils";

/**
 * Full-frame hero: the client's exploded-view generator assembles part by part as the visitor scrolls.
 * Parts are cut from the 2000×1333 exploded render by scripts/generate-brand-assets.py; each glides
 * (translate + gentle scale) onto its spot in the matching assembled render, which cross-fades in last
 * so the closing frame is the real, correctly built genset.
 *
 * Smoothness rules: transform/opacity only, no CSS filters on layers, spring-smoothed scroll progress,
 * stage capped at the 2000px source width.
 */
const CANVAS = { w: 2000, h: 1333 };
const ASPECT = CANVAS.w / CANVAS.h;

type Part = {
  id: string;
  /** exploded position/size (canvas px) */
  x: number;
  y: number;
  w: number;
  h: number;
  /** assembled top-left (canvas px) and scale */
  tx: number;
  ty: number;
  s: number;
  /** scroll window within 0..1 */
  win: [number, number];
  z: number;
  label?: { en: string; ar: string };
  /** callout anchor inside the part (0..1) */
  anchor?: [number, number];
  /** fade the layer out once fitted (hidden under other parts in the real set) */
  hideAfter?: boolean;
};

// geometry mirrors public/images/hero/layers/layers.json
const PARTS: Part[] = [
  { id: "base-frame", x: 412, y: 873, w: 1293, h: 412, tx: 410, ty: 858, s: 1.04, win: [0, 0.1], z: 1 },
  { id: "mounts", x: 723, y: 827, w: 709, h: 109, tx: 724, ty: 900, s: 1, win: [0.02, 0.2], z: 2, hideAfter: true },
  { id: "engine", x: 738, y: 323, w: 795, h: 578, tx: 725, ty: 370, s: 1.05, win: [0.04, 0.24], z: 4, label: { en: "Diesel engine", ar: "محرك الديزل" }, anchor: [0.45, 0.45] },
  { id: "alternator", x: 247, y: 506, w: 503, h: 403, tx: 360, ty: 568, s: 1.06, win: [0.16, 0.36], z: 5, label: { en: "Brushless alternator", ar: "الدينامو بدون فرش" }, anchor: [0.5, 0.05] },
  { id: "radiator", x: 1511, y: 228, w: 476, h: 737, tx: 1478, ty: 215, s: 1.06, win: [0.28, 0.48], z: 6, label: { en: "Radiator & cooling fan", ar: "المبرد ومروحة التبريد" }, anchor: [0.2, 0.08] },
  { id: "control-panel", x: 23, y: 410, w: 225, h: 485, tx: 120, ty: 450, s: 1.18, win: [0.4, 0.58], z: 7, label: { en: "AMF control panel", ar: "لوحة التحكم AMF" }, anchor: [0.6, 0.02] },
  { id: "silencer", x: 978, y: 21, w: 495, h: 310, tx: 932, ty: 59, s: 1.075, win: [0.52, 0.7], z: 8, label: { en: "Exhaust silencer", ar: "كاتم العادم" }, anchor: [0.35, 0.3] },
  { id: "air-filter", x: 534, y: 142, w: 410, h: 236, tx: 559, ty: 256, s: 1.075, win: [0.62, 0.8], z: 9, label: { en: "Air filter", ar: "فلتر الهواء" }, anchor: [0.08, 0.2] },
];
/** assembled render cross-fades over the fitted parts */
const LOCK: [number, number] = [0.82, 0.9];

/** Backdrop word windows [inStart, inEnd, outStart, outEnd] — follow the parts being fitted. */
const WORD_WINDOWS: [number, number, number, number][] = [
  [-1, 0, 0.04, 0.09],
  [0.06, 0.12, 0.26, 0.32],
  [0.28, 0.34, 0.44, 0.5],
  [0.44, 0.5, 0.64, 0.7],
  [0.7, 0.78, 2, 2],
];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const band = (v: number, [a, b, c, d]: [number, number, number, number]) =>
  v < a ? 0 : v < b ? clamp01((v - a) / (b - a || 1)) : v <= c ? 1 : v < d ? 1 - clamp01((v - c) / (d - c)) : 0;
/** smooth ease-in-out (quint) — parts accelerate off the rack and settle softly into place */
const ease = (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);

function useAssembly(part: Part, progress: MotionValue<number>) {
  const [a, b] = part.win;
  const k = useTransform(progress, (v) => (b > a ? ease(clamp01((v - a) / (b - a))) : 1));
  // translate is relative to the layer's own box; scale pivots on its top-left corner
  const x = useTransform(k, (t) => `${(((part.tx - part.x) * t) / part.w) * 100}%`);
  const y = useTransform(k, (t) => `${(((part.ty - part.y) * t) / part.h) * 100}%`);
  const scale = useTransform(k, (t) => 1 + (part.s - 1) * t);
  return { x, y, scale };
}

const box = (p: Part) => ({ left: pct(p.x, CANVAS.w), top: pct(p.y, CANVAS.h), width: pct(p.w, CANVAS.w), height: pct(p.h, CANVAS.h) });

function Layer({ part, progress, priority }: { part: Part; progress: MotionValue<number>; priority?: boolean }) {
  const { x, y, scale } = useAssembly(part, progress);
  const [, b] = part.win;
  const opacity = useTransform(progress, (v) => (part.hideAfter ? 1 - clamp01((v - b) / 0.04) : 1 - clamp01((v - LOCK[1]) / 0.04)));
  return (
    <m.div className="absolute origin-top-left will-change-transform [backface-visibility:hidden]" style={{ ...box(part), x, y, scale, opacity, zIndex: part.z }}>
      <Image
        src={`/images/hero/layers/${part.id}.webp`}
        alt=""
        width={part.w}
        height={part.h}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        loading="eager"
        decoding="async"
        draggable={false}
        // served as-is: hand-optimised WebP at native resolution; re-encoding would only lose detail
        unoptimized
        className="size-full select-none"
      />
    </m.div>
  );
}

/** Pin + label that rides with its part and is visible only while that part travels into place. */
function Callout({ part, progress, locale }: { part: Part; progress: MotionValue<number>; locale: Locale }) {
  const [a, b] = part.win;
  const opacity = useTransform(progress, (v) => band(v, [a - 0.01, a + 0.03, b - 0.06, b - 0.02]));
  const { x, y, scale } = useAssembly(part, progress);
  if (!part.label || !part.anchor) return null;
  return (
    <m.div className="pointer-events-none absolute hidden origin-top-left sm:block" style={{ ...box(part), x, y, scale, opacity, zIndex: 20 }} aria-hidden>
      <div className="absolute flex -translate-y-1/2 items-center gap-2" style={{ left: `${part.anchor[0] * 100}%`, top: `${part.anchor[1] * 100}%` }}>
        <span className="relative grid size-3 place-items-center">
          <span className="absolute size-3 animate-ping rounded-full bg-brand-400/70" />
          <span className="size-2.5 rounded-full bg-brand-400 ring-2 ring-ink-950" />
        </span>
        <span className="h-px w-6 bg-ink-950/60" />
        <span className="whitespace-nowrap rounded-md bg-ink-950 px-2.5 py-1 text-xs font-bold text-white shadow-lg">{part.label[locale]}</span>
      </div>
    </m.div>
  );
}

/** The real assembled render — fades in over the fitted parts so the last frame is exact. */
function Assembled({ progress, still }: { progress: MotionValue<number>; still: boolean }) {
  const opacity = useTransform(progress, (v) => clamp01((v - LOCK[0]) / (LOCK[1] - LOCK[0])));
  return (
    <m.div className="absolute inset-0 [backface-visibility:hidden]" style={{ opacity: still ? 1 : opacity, zIndex: 15 }}>
      <Image src="/images/hero/layers/assembled.webp" alt="" width={CANVAS.w} height={CANVAS.h} loading="eager" decoding="async" draggable={false} unoptimized className="size-full select-none" />
    </m.div>
  );
}

/** Giant display word behind the machine, one per assembly stage. */
function BackWord({ index, word, progress }: { index: number; word: string; progress: MotionValue<number> }) {
  const win = WORD_WINDOWS[index]!;
  const opacity = useTransform(progress, (v) => band(v, win));
  const y = useTransform(progress, (v) => {
    const t = band(v, win);
    return `${(v < win[2] ? 1 - t : -(1 - t)) * 10}%`;
  });
  return (
    <m.span
      aria-hidden
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-x-0 top-[8%] -z-10 select-none text-center font-display text-[24vw] font-extrabold uppercase leading-none tracking-tight text-ink-950/[0.045] [-webkit-text-stroke:1.5px_rgb(17_17_19/0.09)] sm:text-[19vw] rtl:font-[family-name:var(--font-arabic)] rtl:text-[17vw] rtl:tracking-normal"
    >
      {word}
    </m.span>
  );
}

/** brief warm flash as the set "locks" together (masks the hand-off to the assembled render) */
function LockFlash({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, (v) => 0.55 * band(v, [LOCK[0] - 0.01, (LOCK[0] + LOCK[1]) / 2, (LOCK[0] + LOCK[1]) / 2, LOCK[1] + 0.02]));
  return <m.div className="pointer-events-none absolute inset-[-10%] rounded-full bg-[radial-gradient(closest-side,rgb(255_236_160/0.9),transparent)]" style={{ opacity, zIndex: 14 }} aria-hidden />;
}

export function HeroAssembly({ words, strings }: { words: string[]; strings: { scroll: string; label: string } }) {
  const locale = useLocale() as Locale;
  const ref = useRef<HTMLElement>(null);
  const still = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Spring-smoothed progress: wheel/trackpad steps become one continuous glide.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.35, restDelta: 0.0005 });

  const glow = useTransform(progress, (v) => 0.25 + 0.5 * clamp01((v - 0.7) / 0.2));
  const hint = useTransform(scrollYProgress, (v) => 1 - clamp01(v / 0.04));
  const bar = useTransform(progress, (v) => clamp01(v / LOCK[1]));

  return (
    <LazyMotion features={domAnimation} strict>
      <section ref={ref} aria-label={strings.label} className={cn("relative bg-surface", !still && "h-[260vh] lg:h-[300vh]")}>
        <div className={cn("isolate overflow-hidden", still ? "relative h-[70svh] min-h-[420px]" : "sticky top-16 h-[calc(100svh-4rem)] lg:top-18 lg:h-[calc(100svh-4.5rem)]")}>
          <div
            className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,rgb(17_17_19/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(17_17_19/0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_85%)]"
            aria-hidden
          />
          <m.div
            className="pointer-events-none absolute start-1/2 top-1/2 -z-10 size-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400 blur-[120px] rtl:translate-x-1/2"
            style={{ opacity: still ? 0.45 : glow }}
            aria-hidden
          />
          {!still && words.map((w, i) => <BackWord key={i} index={i} word={w} progress={progress} />)}

          {/* stage: the generator owns the whole frame (never wider than its 2000px source) */}
          <div className="absolute inset-0 flex items-center justify-center px-2 pb-10 pt-6 sm:px-6 max-md:pb-24">
            <div
              className="relative shrink-0 [--hero-vw:118vw] max-sm:[--hero-vw:104vw]"
              style={{ aspectRatio: `${CANVAS.w} / ${CANVAS.h}`, width: `min(${CANVAS.w}px, var(--hero-vw), calc((100svh - 7.5rem) * ${ASPECT.toFixed(4)}))` }}
            >
              {!still && PARTS.map((p) => <Layer key={p.id} part={p} progress={progress} priority={p.id === "engine" || p.id === "base-frame"} />)}
              <Assembled progress={progress} still={still} />
              {!still && PARTS.map((p) => <Callout key={p.id} part={p} progress={progress} locale={locale} />)}
              {!still && <LockFlash progress={progress} />}
              <div className="absolute inset-x-[12%] bottom-[-2%] -z-10 h-[8%] rounded-[50%] bg-ink-950/20 blur-2xl" aria-hidden />
            </div>
          </div>

          {!still && (
            <>
              <m.p
                style={{ opacity: hint }}
                className="absolute bottom-6 start-1/2 z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-muted shadow-sm backdrop-blur max-md:bottom-24 rtl:translate-x-1/2 rtl:tracking-normal"
              >
                <span className="inline-block h-5 w-3 rounded-full border-2 border-ink-600 p-0.5" aria-hidden>
                  <span className="block h-1 w-full animate-bounce rounded-full bg-ink-600" />
                </span>
                {strings.scroll}
              </m.p>
              <div className="absolute inset-x-0 bottom-0 z-30 h-1 bg-ink-950/10 max-md:bottom-[4.5rem]" aria-hidden>
                <m.div className="hazard h-full origin-left rtl:origin-right" style={{ scaleX: bar }} />
              </div>
            </>
          )}
        </div>
      </section>
    </LazyMotion>
  );
}
