"use client";

import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { cn, type Locale } from "@/lib/utils";

/**
 * Full-frame hero: the client's exploded-view generator assembles part by part as the visitor scrolls.
 * Layers are cut from the 1536×840 render by scripts/generate-brand-assets.py.
 *
 * Quality/smoothness rules (why the code looks like this):
 *  - transforms are translate-only (no scale/rotate) so the browser never resamples the bitmaps → no pixelation
 *  - the stage is capped at the 1536px source width → never upscaled
 *  - scroll progress goes through a spring → parts glide instead of stepping with wheel ticks
 *  - no per-layer CSS filters (drop-shadow) → cheap compositing, steady 60fps
 */
const CANVAS = { w: 1536, h: 840 };
const ASPECT = CANVAS.w / CANVAS.h;

type Part = {
  id: string;
  /** exploded position (canvas px) */
  x: number;
  y: number;
  w: number;
  h: number;
  /** assembled offset (canvas px) — tuned so the final frame reads as a real, correctly built genset */
  dx: number;
  dy: number;
  /** scroll window within 0..1 */
  win: [number, number];
  z: number;
  label: { en: string; ar: string };
  /** callout anchor inside the part (0..1) */
  anchor: [number, number];
};

const PARTS: Part[] = [
  { id: "base-frame", x: 276, y: 613, w: 964, h: 211, dx: 0, dy: 0, win: [0, 0], z: 1, label: { en: "Base frame & AV mounts", ar: "القاعدة ومساند الاهتزاز" }, anchor: [0.18, 0.7] },
  { id: "engine", x: 618, y: 140, w: 607, h: 495, dx: -10, dy: 50, win: [0.04, 0.26], z: 4, label: { en: "Diesel engine", ar: "محرك الديزل" }, anchor: [0.5, 0.5] },
  { id: "alternator", x: 360, y: 339, w: 297, h: 279, dx: -30, dy: 58, win: [0.14, 0.36], z: 3, label: { en: "Brushless alternator", ar: "الدينامو بدون فرش" }, anchor: [0.62, -0.06] },
  { id: "radiator", x: 1167, y: 200, w: 353, h: 404, dx: -262, dy: 64, win: [0.26, 0.48], z: 2, label: { en: "Radiator & cooling fan", ar: "المبرد ومروحة التبريد" }, anchor: [0.7, 0.2] },
  { id: "end-cover", x: 16, y: 334, w: 189, h: 322, dx: 300, dy: 50, win: [0.36, 0.52], z: 5, label: { en: "Alternator end cover", ar: "غطاء الدينامو الخلفي" }, anchor: [0.3, -0.08] },
  { id: "control-panel", x: 216, y: 345, w: 154, h: 326, dx: 70, dy: 52, win: [0.53, 0.68], z: 6, label: { en: "AMF control panel", ar: "لوحة التحكم AMF" }, anchor: [0.5, -0.05] },
  { id: "air-filter", x: 529, y: 64, w: 239, h: 153, dx: 62, dy: 96, win: [0.6, 0.78], z: 7, label: { en: "Air filter", ar: "فلتر الهواء" }, anchor: [0.12, 0.55] },
  { id: "silencer", x: 881, y: 45, w: 104, h: 123, dx: 42, dy: 147, win: [0.7, 0.88], z: 8, label: { en: "Exhaust silencer", ar: "كاتم العادم" }, anchor: [0.95, 0.5] },
];

/** Backdrop word windows [inStart, inEnd, outStart, outEnd] — follow the parts being fitted. */
const WORD_WINDOWS: [number, number, number, number][] = [
  [-1, 0, 0.05, 0.1],
  [0.08, 0.14, 0.3, 0.36],
  [0.34, 0.4, 0.46, 0.52],
  [0.5, 0.56, 0.66, 0.72],
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
  const x = useTransform(k, (t) => pct(part.dx * t, CANVAS.w));
  const y = useTransform(k, (t) => pct(part.dy * t, CANVAS.h));
  return { x, y };
}

function Layer({ part, progress, still, priority }: { part: Part; progress: MotionValue<number>; still: boolean; priority?: boolean }) {
  const { x, y } = useAssembly(part, progress);
  return (
    <m.div
      className="absolute inset-0 [backface-visibility:hidden]"
      style={{ x: still ? pct(part.dx, CANVAS.w) : x, y: still ? pct(part.dy, CANVAS.h) : y, zIndex: part.z }}
    >
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
        className="absolute h-auto select-none"
        style={{ left: pct(part.x, CANVAS.w), top: pct(part.y, CANVAS.h), width: pct(part.w, CANVAS.w) }}
      />
    </m.div>
  );
}

/** Pin + label that rides with its part and is visible only while that part travels into place. */
function Callout({ part, progress, locale }: { part: Part; progress: MotionValue<number>; locale: Locale }) {
  const [a, b] = part.win;
  const opacity = useTransform(progress, (v) => (b > a ? band(v, [a - 0.01, a + 0.03, b - 0.07, b - 0.02]) : 0));
  const { x, y } = useAssembly(part, progress);
  return (
    <m.div className="pointer-events-none absolute inset-0 hidden sm:block" style={{ x, y, opacity, zIndex: 20 }} aria-hidden>
      <div
        className="absolute flex -translate-y-1/2 items-center gap-2"
        style={{ left: pct(part.x + part.w * part.anchor[0], CANVAS.w), top: pct(part.y + part.h * part.anchor[1], CANVAS.h) }}
      >
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

export function HeroAssembly({ words, strings }: { words: string[]; strings: { scroll: string; label: string } }) {
  const locale = useLocale() as Locale;
  const ref = useRef<HTMLElement>(null);
  const still = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Spring-smoothed progress: wheel/trackpad steps become one continuous glide.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.35, restDelta: 0.0005 });

  const glow = useTransform(progress, (v) => 0.25 + 0.5 * clamp01((v - 0.7) / 0.22));
  const hint = useTransform(scrollYProgress, (v) => 1 - clamp01(v / 0.04));
  const bar = useTransform(progress, (v) => clamp01(v / 0.9));

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

          {/* stage: the generator owns the whole frame (never wider than its 1536px source) */}
          <div className="absolute inset-0 flex items-center justify-center px-2 pb-10 pt-6 sm:px-6 max-md:pb-24">
            <div
              className="relative shrink-0 [--hero-vw:118vw] max-sm:[--hero-vw:134vw] max-sm:-translate-x-[3.5%]"
              style={{ aspectRatio: `${CANVAS.w} / ${CANVAS.h}`, width: `min(${CANVAS.w}px, var(--hero-vw), calc((100svh - 7.5rem) * ${ASPECT.toFixed(4)}))` }}
            >
              {PARTS.map((p) => (
                <Layer key={p.id} part={p} progress={progress} still={still} priority={p.id === "engine" || p.id === "base-frame"} />
              ))}
              {!still && PARTS.map((p) => <Callout key={p.id} part={p} progress={progress} locale={locale} />)}
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
