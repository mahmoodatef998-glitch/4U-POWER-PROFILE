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
/** smooth ease-in-out (cubic) plus a small overshoot-and-settle at the end — parts "clunk" into place */
const ease = (u: number) => {
  const base = u < 0.5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2;
  const settle = u > 0.72 ? 0.035 * Math.sin(Math.PI * ((u - 0.72) / 0.28)) : 0;
  return base + settle;
};

/** extra spread of the exploded state, away from the machine's centre (0.15 = 15% wider); less vertically so the exhaust stack stays in frame */
const SPREAD = 0.15;
const SPREAD_Y = 0.05;
const CENTRE = { x: 1032, y: 656 };

/**
 * Per-part motion: start 15% further out than the render, travel on a short arc with a slight tilt,
 * overshoot a touch and settle. While waiting its turn a part hovers gently as the visitor scrolls.
 */
function useAssembly(part: Part, progress: MotionValue<number>, index: number) {
  const [a, b] = part.win;
  const sx = SPREAD * (part.x + part.w / 2 - CENTRE.x);
  const sy = SPREAD_Y * (part.y + part.h / 2 - CENTRE.y);
  const dist = Math.hypot(part.tx - part.x - sx, part.ty - part.y - sy);
  const arc = Math.min(90, dist * 0.18);
  const tilt = (index % 2 ? 1 : -1) * Math.min(4, 1 + dist / 120);
  const phase = index * 1.7;

  const u = useTransform(progress, (v) => (b > a ? clamp01((v - a) / (b - a)) : 1));
  const px = useTransform(u, (t) => {
    const k = ease(t);
    return sx + (part.tx - part.x - sx) * k;
  });
  const py = useTransform([u, progress], ([t, v]: number[]) => {
    const k = ease(t!);
    const lift = -arc * Math.sin(Math.PI * t!);
    const hover = 7 * Math.sin(v! * 26 + phase) * (1 - Math.min(1, t! * 3));
    return sy + (part.ty - part.y - sy) * k + lift + hover;
  });
  // translate is relative to the layer's own box; scale/rotate pivot on its top-left corner
  const x = useTransform(px, (d) => `${(d / part.w) * 100}%`);
  const y = useTransform(py, (d) => `${(d / part.h) * 100}%`);
  const scale = useTransform(u, (t) => 1 + (part.s - 1) * Math.min(1, ease(t)));
  const rotate = useTransform(u, (t) => tilt * Math.sin(Math.PI * t));
  return { x, y, scale, rotate };
}

const box = (p: Part) => ({ left: pct(p.x, CANVAS.w), top: pct(p.y, CANVAS.h), width: pct(p.w, CANVAS.w), height: pct(p.h, CANVAS.h) });

function Layer({ part, index, progress, priority }: { part: Part; index: number; progress: MotionValue<number>; priority?: boolean }) {
  const { x, y, scale, rotate } = useAssembly(part, progress, index);
  const [, b] = part.win;
  const opacity = useTransform(progress, (v) => (part.hideAfter ? 1 - clamp01((v - b) / 0.04) : 1 - clamp01((v - LOCK[1]) / 0.04)));
  return (
    <m.div className="absolute origin-top-left will-change-transform [backface-visibility:hidden]" style={{ ...box(part), x, y, scale, rotate, opacity, zIndex: part.z }}>
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
function Callout({ part, index, progress, locale }: { part: Part; index: number; progress: MotionValue<number>; locale: Locale }) {
  const [a, b] = part.win;
  const opacity = useTransform(progress, (v) => band(v, [a - 0.01, a + 0.03, b - 0.06, b - 0.02]));
  const { x, y, scale } = useAssembly(part, progress, index);
  if (!part.label || !part.anchor) return null;
  return (
    <m.div className="pointer-events-none absolute hidden origin-top-left sm:block" style={{ ...box(part), x, y, scale, opacity, zIndex: 20 }} aria-hidden>
      <div className="absolute flex -translate-y-1/2 items-center gap-2" style={{ left: `${part.anchor[0] * 100}%`, top: `${part.anchor[1] * 100}%` }}>
        <span className="relative grid size-3 place-items-center">
          <span className="absolute size-3 animate-ping rounded-full bg-brand-400/70" />
          <span className="size-2.5 rounded-full bg-brand-400 ring-2 ring-navy-950" />
        </span>
        <span className="h-px w-6 bg-white/40" />
        <span className="whitespace-nowrap rounded-full border border-white/15 bg-navy-900/80 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur">{part.label[locale]}</span>
      </div>
    </m.div>
  );
}

/** Warm ring that pulses where a part lands */
function Landing({ part, progress }: { part: Part; progress: MotionValue<number> }) {
  const [, b] = part.win;
  const t = useTransform(progress, (v) => clamp01((v - (b - 0.03)) / 0.07));
  const opacity = useTransform(t, (k) => (k <= 0 || k >= 1 ? 0 : Math.sin(Math.PI * k) * 0.9));
  const scale = useTransform(t, (k) => 0.3 + 1.2 * k);
  const w = part.w * part.s;
  return (
    <m.div
      aria-hidden
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-brand-400/50 bg-[radial-gradient(closest-side,rgb(255_214_60/0.5),transparent)]"
      style={{
        left: pct(part.tx + w / 2, CANVAS.w),
        top: pct(part.ty + part.h * part.s * 0.85, CANVAS.h),
        width: pct(w * 0.9, CANVAS.w),
        aspectRatio: "3 / 1",
        opacity,
        scale,
        zIndex: 12,
      }}
    />
  );
}

/** The real assembled render — fades in over the fitted parts so the last frame is exact. */
function Assembled({ progress, still }: { progress: MotionValue<number>; still: boolean }) {
  const opacity = useTransform(progress, (v) => clamp01((v - LOCK[0]) / (LOCK[1] - LOCK[0])));
  return (
    <m.div className="absolute inset-0 [backface-visibility:hidden]" style={{ opacity: still ? 1 : opacity, zIndex: 15 }}>
      <Image src="/images/hero/layers/assembled.webp" alt="" width={CANVAS.w} height={CANVAS.h} loading="eager" fetchPriority={still ? "high" : "low"} decoding="async" draggable={false} unoptimized className="size-full select-none" />
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
      className="pointer-events-none absolute inset-x-0 top-[8%] -z-10 select-none text-center font-display text-[24vw] font-extrabold uppercase leading-none tracking-tight text-white/[0.025] [-webkit-text-stroke:1.5px_rgb(255_255_255/0.07)] sm:text-[19vw] rtl:font-[family-name:var(--font-arabic)] rtl:text-[17vw] rtl:tracking-normal"
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

export function HeroAssembly({ words, strings }: { words: string[]; strings: { scroll: string; label: string; badge: string } }) {
  const locale = useLocale() as Locale;
  const ref = useRef<HTMLElement>(null);
  const still = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Spring-smoothed progress: wheel/trackpad steps become one continuous glide.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.35, restDelta: 0.0005 });

  const glow = useTransform(progress, (v) => 0.12 + 0.3 * clamp01((v - 0.7) / 0.2));
  const hint = useTransform(scrollYProgress, (v) => 1 - clamp01(v / 0.04));
  const bar = useTransform(progress, (v) => clamp01(v / LOCK[1]));

  return (
    <LazyMotion features={domAnimation} strict>
      <section ref={ref} aria-label={strings.label} className={cn("relative bg-navy-950", !still && "h-[260vh] lg:h-[300vh]")}>
        <div className={cn("isolate overflow-hidden", still ? "relative h-[70svh] min-h-[420px]" : "sticky top-16 h-[calc(100svh-4rem)] lg:top-18 lg:h-[calc(100svh-4.5rem)]")}>
          <div
            className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_85%)]"
            aria-hidden
          />
          <div className="nebula pointer-events-none absolute inset-0 -z-20" aria-hidden />
          {/* big hairline arc behind the machine */}
          <div
            className="pointer-events-none absolute start-1/2 top-[14%] -z-10 aspect-square w-[min(140vw,150vh)] -translate-x-1/2 rounded-full border border-white/10 [mask-image:linear-gradient(to_bottom,black_30%,transparent_75%)] rtl:translate-x-1/2"
            aria-hidden
          />
          <p className="absolute start-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white/85 backdrop-blur sm:top-6 sm:text-sm rtl:translate-x-1/2">
            <span className="relative flex size-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative size-2.5 rounded-full bg-emerald-400" />
            </span>
            {strings.badge}
          </p>
          <m.div
            className="pointer-events-none absolute start-1/2 top-1/2 -z-10 size-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400 blur-[120px] rtl:translate-x-1/2"
            style={{ opacity: still ? 0.45 : glow }}
            aria-hidden
          />
          {!still && words.map((w, i) => <BackWord key={i} index={i} word={w} progress={progress} />)}

          {/* stage: the generator owns the whole frame (never wider than its 2000px source) */}
          <div className="absolute inset-0 flex items-center justify-center px-2 pb-10 pt-16 sm:px-6 max-md:pb-24">
            <div
              className="relative shrink-0 [--hero-vw:118vw] max-sm:[--hero-vw:104vw]"
              style={{ aspectRatio: `${CANVAS.w} / ${CANVAS.h}`, width: `min(${CANVAS.w}px, var(--hero-vw), calc((100svh - 11rem) * ${ASPECT.toFixed(4)}))` }}
            >
              {!still && PARTS.map((p, i) => <Layer key={p.id} part={p} index={i} progress={progress} priority={p.id === "engine" || p.id === "base-frame"} />)}
              {!still && PARTS.map((p) => (p.label ? <Landing key={p.id} part={p} progress={progress} /> : null))}
              <Assembled progress={progress} still={still} />
              {!still && PARTS.map((p, i) => <Callout key={p.id} part={p} index={i} progress={progress} locale={locale} />)}
              {!still && <LockFlash progress={progress} />}
              <div className="absolute inset-x-[12%] bottom-[-2%] -z-10 h-[8%] rounded-[50%] bg-black/60 blur-2xl light:bg-black/15" aria-hidden />
            </div>
          </div>

          {!still && (
            <>
              <m.p
                style={{ opacity: hint }}
                className="absolute bottom-6 start-1/2 z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur max-md:bottom-24 rtl:translate-x-1/2 rtl:tracking-normal"
              >
                <span className="inline-block h-5 w-3 rounded-full border-2 border-white/50 p-0.5" aria-hidden>
                  <span className="block h-1 w-full animate-bounce rounded-full bg-white/70" />
                </span>
                {strings.scroll}
              </m.p>
              <div className="absolute inset-x-0 bottom-0 z-30 h-1 bg-white/5 max-md:bottom-[4.5rem]" aria-hidden>
                <m.div className="hazard h-full origin-left rtl:origin-right" style={{ scaleX: bar }} />
              </div>
            </>
          )}
        </div>
      </section>
    </LazyMotion>
  );
}
