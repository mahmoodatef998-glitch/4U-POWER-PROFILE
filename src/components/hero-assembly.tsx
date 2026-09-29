"use client";

import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRef, type ReactNode } from "react";
import { cn, type Locale } from "@/lib/utils";

/**
 * Scroll-story hero. The generator fills the stage and assembles part by part while the copy
 * underneath advances through chapters (intro → engine → cooling → control → ready to ship).
 * Layers are cut from the client's exploded-view render (1536×840 canvas) by
 * scripts/generate-brand-assets.py. Pure GPU transforms, no video.
 */
const CANVAS = { w: 1536, h: 840 };
const ASPECT = CANVAS.w / CANVAS.h;

/** Chapter windows on the 0..1 scroll progress: [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd]. */
const CHAPTERS: [number, number, number, number][] = [
  [-1, 0, 0.09, 0.14], // intro (H1)
  [0.14, 0.19, 0.34, 0.39], // engine + alternator
  [0.39, 0.44, 0.55, 0.6], // cooling
  [0.6, 0.65, 0.74, 0.79], // control
  [0.79, 0.84, 2, 2], // ready to ship (stays)
];

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
  { id: "base-frame", x: 276, y: 613, w: 964, h: 211, dx: 0, dy: 0, win: [0.13, 0.13], z: 1, label: { en: "Base frame & AV mounts", ar: "القاعدة ومساند الاهتزاز" }, anchor: [0.18, 0.7] },
  { id: "engine", x: 618, y: 147, w: 559, h: 488, dx: -8, dy: 26, win: [0.14, 0.3], z: 4, label: { en: "Diesel engine", ar: "محرك الديزل" }, anchor: [0.55, 0.45] },
  { id: "alternator", x: 360, y: 339, w: 297, h: 279, dx: -18, dy: 44, win: [0.2, 0.36], z: 3, label: { en: "Brushless alternator", ar: "الدينامو بدون فرش" }, anchor: [0.62, -0.06] },
  { id: "radiator", x: 1167, y: 140, w: 353, h: 464, dx: -34, dy: 40, win: [0.39, 0.56], z: 5, label: { en: "Radiator & cooling fan", ar: "المبرد ومروحة التبريد" }, anchor: [0.45, 0.16] },
  { id: "end-cover", x: 16, y: 334, w: 189, h: 322, dx: 196, dy: 36, win: [0.6, 0.72], z: 2, label: { en: "Alternator end cover", ar: "غطاء الدينامو الخلفي" }, anchor: [0.3, -0.08] },
  { id: "control-panel", x: 216, y: 345, w: 154, h: 326, dx: 86, dy: 22, win: [0.63, 0.77], z: 6, label: { en: "AMF control panel", ar: "لوحة التحكم AMF" }, anchor: [0.4, 1.06] },
  { id: "air-filter", x: 529, y: 64, w: 239, h: 153, dx: 118, dy: 96, win: [0.79, 0.9], z: 7, label: { en: "Air filter", ar: "فلتر الهواء" }, anchor: [0.3, 0.2] },
  { id: "silencer", x: 881, y: 45, w: 104, h: 123, dx: 2, dy: 78, win: [0.82, 0.94], z: 7, label: { en: "Exhaust silencer", ar: "كاتم العادم" }, anchor: [0.5, 0.15] },
];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0 → 1 → 0 envelope. Function-form transforms stay on the JS path (reliable on overlays). */
const band = (v: number, [a, b, c, d]: [number, number, number, number]) =>
  v < a ? 0 : v < b ? clamp01((v - a) / (b - a || 1)) : v <= c ? 1 : v < d ? 1 - clamp01((v - c) / (d - c)) : 0;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Layer({ part, progress, still, priority }: { part: Part; progress: MotionValue<number>; still: boolean; priority?: boolean }) {
  const [a, b] = part.win;
  const t = useTransform(progress, (v) => (b > a ? easeInOut(clamp01((v - a) / (b - a))) : 1));
  const x = useTransform(t, (k) => pct(part.dx * k, CANVAS.w));
  const y = useTransform(t, (k) => pct(part.dy * k, CANVAS.h));
  // parts not yet placed hang slightly tilted, then settle square when fitted
  const rotate = useTransform(t, (k) => (1 - k) * (part.id === "engine" || part.id === "base-frame" ? 0 : part.dx > 0 ? -2 : 2));
  const style = still ? { x: pct(part.dx, CANVAS.w), y: pct(part.dy, CANVAS.h) } : { x, y, rotate };
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
        sizes={`(min-width:1024px) ${Math.ceil((part.w / CANVAS.w) * 80)}vw, ${Math.ceil((part.w / CANVAS.w) * 100)}vw`}
        className="absolute h-auto drop-shadow-[0_28px_28px_rgb(0_0_0/0.2)]"
        style={{ left: pct(part.x, CANVAS.w), top: pct(part.y, CANVAS.h), width: pct(part.w, CANVAS.w) }}
      />
    </m.div>
  );
}

/** Pin + label that appears only while its part is moving into place. */
function Callout({ part, progress, locale }: { part: Part; progress: MotionValue<number>; locale: Locale }) {
  const [a, b] = part.win;
  const opacity = useTransform(progress, (v) => band(v, [a - 0.05, a, b - 0.04, b + 0.01]));
  const scale = useTransform(opacity, (o) => 0.85 + o * 0.15);
  return (
    <m.div
      className="pointer-events-none absolute z-20 hidden -translate-y-1/2 items-center gap-2 sm:flex"
      style={{ left: pct(part.x + part.w * part.anchor[0], CANVAS.w), top: pct(part.y + part.h * part.anchor[1], CANVAS.h), opacity, scale }}
      aria-hidden
    >
      <span className="relative grid size-3 place-items-center">
        <span className="absolute size-3 animate-ping rounded-full bg-brand-400/70" />
        <span className="size-2.5 rounded-full bg-brand-400 ring-2 ring-ink-950" />
      </span>
      <span className="h-px w-6 bg-ink-950/60" />
      <span className="whitespace-nowrap rounded-md bg-ink-950 px-2.5 py-1 text-xs font-bold text-white shadow-lg">{part.label[locale]}</span>
    </m.div>
  );
}

export type HeroChapter = { kicker: string; title: string; body: string; stat: string };

/** One chapter of copy: fades/slides/un-blurs in, then out upward as the next one arrives. */
function Chapter({ index, progress, children, still }: { index: number; progress: MotionValue<number>; children: ReactNode; still: boolean }) {
  const win = CHAPTERS[index]!;
  const o = useTransform(progress, (v) => band(v, win));
  const y = useTransform(progress, (v) => {
    const k = band(v, win);
    return v < win[2] ? (1 - k) * 36 : -(1 - k) * 36;
  });
  const filter = useTransform(o, (k) => `blur(${((1 - k) * 8).toFixed(2)}px)`);
  const visibility = useTransform(o, (k) => (k < 0.02 ? "hidden" : "visible"));
  if (still) return index === 0 ? <div>{children}</div> : null;
  return (
    <m.div className="absolute inset-x-0 top-0 h-full" style={{ opacity: o, y, filter, visibility }}>
      {children}
    </m.div>
  );
}

function RailDot({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const win = CHAPTERS[index]!;
  const width = useTransform(progress, (v) => `${12 + band(v, win) * 28}px`);
  const bg = useTransform(progress, (v) => (band(v, win) > 0.5 || v >= win[3] ? "var(--color-brand-500)" : "rgb(17 17 19 / 0.15)"));
  return <m.span className="block h-1.5 rounded-full" style={{ width, backgroundColor: bg }} />;
}

/** Huge outlined chapter number behind the stage. */
function BigNumeral({ progress }: { progress: MotionValue<number> }) {
  const text = useTransform(progress, (v) => {
    // intro shows no numeral; story chapters are 01..04 (matches their kicker)
    const i = CHAPTERS.findIndex((w) => v < w[3]);
    const n = i === -1 ? CHAPTERS.length - 1 : i;
    return n === 0 ? "" : String(n).padStart(2, "0");
  });
  return (
    <m.span
      aria-hidden
      className="pointer-events-none absolute end-4 top-2 hidden select-none font-display sm:block text-[22vmin] font-extrabold leading-none text-transparent [-webkit-text-stroke:2px_rgb(17_17_19/0.08)] sm:end-10"
    >
      {text}
    </m.span>
  );
}

export function HeroAssembly({
  intro,
  chapters,
  outroCta,
  strings,
}: {
  intro: ReactNode;
  chapters: HeroChapter[];
  outroCta: ReactNode;
  strings: { scroll: string; label: string };
}) {
  const locale = useLocale() as Locale;
  const ref = useRef<HTMLElement>(null);
  const still = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const stageScale = useTransform(scrollYProgress, (v) => 0.94 + 0.1 * easeInOut(clamp01(v / 0.95)));
  const glow = useTransform(scrollYProgress, (v) => 0.2 + 0.55 * clamp01((v - 0.7) / 0.25));
  const hint = useTransform(scrollYProgress, (v) => 1 - clamp01(v / 0.06));
  const bar = useTransform(scrollYProgress, (v) => clamp01(v / 0.94));

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        ref={ref}
        aria-label={strings.label}
        className={cn("relative bg-surface [--hero-copy-h:22.5rem] sm:[--hero-copy-h:19rem] lg:[--hero-copy-h:18rem]", !still && "h-[520vh] lg:h-[600vh]")}
      >
        <div className={cn("flex flex-col", still ? "relative" : "sticky top-16 h-[calc(100svh-4rem)] overflow-hidden lg:top-18 lg:h-[calc(100svh-4.5rem)]")}>
          {/* backdrop: blueprint grid + brand glow + chapter numeral */}
          <div
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(17_17_19/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(17_17_19/0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_78%)]"
            aria-hidden
          />
          <m.div
            className="pointer-events-none absolute start-1/2 top-[38%] size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400 blur-[110px] rtl:translate-x-1/2"
            style={{ opacity: still ? 0.45 : glow }}
            aria-hidden
          />
          {!still && <BigNumeral progress={scrollYProgress} />}

          {/* STAGE — the generator takes all the space above the copy */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 pt-2 sm:overflow-visible sm:px-6 lg:pt-4">
            <m.div
              className="relative max-sm:!w-[118%] max-sm:shrink-0 max-sm:-translate-x-[6%]"
              style={{
                aspectRatio: `${CANVAS.w} / ${CANVAS.h}`,
                width: `min(100%, calc((100svh - var(--hero-copy-h)) * ${ASPECT.toFixed(4)}))`,
                scale: still ? 1 : stageScale,
              }}
            >
              {PARTS.map((p) => (
                <Layer key={p.id} part={p} progress={scrollYProgress} still={still} priority={p.id === "engine"} />
              ))}
              {!still && PARTS.map((p) => <Callout key={p.id} part={p} progress={scrollYProgress} locale={locale} />)}
              <div className="absolute inset-x-[14%] bottom-[-3%] h-[7%] rounded-[50%] bg-ink-950/25 blur-xl" aria-hidden />
            </m.div>
            {!still && (
              <m.p
                style={{ opacity: hint }}
                className="absolute bottom-2 start-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted rtl:translate-x-1/2 rtl:tracking-normal sm:flex"
              >
                <span className="inline-block h-6 w-3.5 rounded-full border-2 border-ink-600 p-0.5" aria-hidden>
                  <span className="block h-1.5 w-full animate-bounce rounded-full bg-ink-600" />
                </span>
                {strings.scroll}
              </m.p>
            )}
          </div>

          {/* COPY — chapters crossfade under the stage */}
          <div className="relative z-30 mb-[4.5rem] border-t border-ink-950/10 bg-surface/85 backdrop-blur-sm md:mb-0">
            <div className={cn("container-x py-4 lg:py-5", !still && "h-[calc(var(--hero-copy-h)-5.5rem)] sm:h-[calc(var(--hero-copy-h)-5rem)]")}>
             {/* inner box keeps absolutely-stacked chapters inside the container padding; end gutter clears the floating CTAs */}
             <div className="relative h-full md:pe-20">
              <Chapter index={0} progress={scrollYProgress} still={still}>
                {intro}
              </Chapter>
              {chapters.map((c, i) => (
                <Chapter key={c.kicker} index={i + 1} progress={scrollYProgress} still={still}>
                  <div className="grid h-full content-start gap-3 lg:grid-cols-12 lg:items-center lg:content-center lg:gap-8">
                    <div className="lg:col-span-8">
                      <p className="eyebrow">{c.kicker}</p>
                      <h2 className="mt-2 text-[1.75rem] text-ink sm:text-4xl lg:text-5xl rtl:text-2xl rtl:sm:text-3xl">{c.title}</h2>
                      <p className="mt-2 line-clamp-4 max-w-2xl sm:line-clamp-3 text-sm leading-6 text-muted sm:text-base sm:leading-7">{c.body}</p>
                    </div>
                    <div className="hidden flex-wrap items-center gap-3 sm:flex lg:col-span-4 lg:flex-col lg:items-end">
                      <p className="font-display text-2xl font-extrabold uppercase text-ink sm:text-4xl lg:text-5xl rtl:font-[family-name:var(--font-arabic)] rtl:text-2xl">{c.stat}</p>
                      {i === chapters.length - 1 && outroCta}
                    </div>
                  </div>
                </Chapter>
              ))}
             </div>
            </div>
            {!still && (
              <div className="container-x flex items-center justify-between pb-3 md:pe-28" aria-hidden>
                <div className="flex items-center gap-1.5">
                  {CHAPTERS.map((_, i) => (
                    <RailDot key={i} index={i} progress={scrollYProgress} />
                  ))}
                </div>
                <div className="h-1 w-32 overflow-hidden rounded-full bg-ink-950/10 sm:w-56">
                  <m.div className="hazard h-full origin-left rtl:origin-right" style={{ scaleX: bar }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
