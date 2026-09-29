"use client";

import { LazyMotion, domAnimation, m, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Children, Fragment, useEffect, useRef, useState, type ElementType, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** "Plain **bright words** plain" → words flagged as emphasised (bright) or not (muted). */
function parseMarks(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*)/)
    .flatMap((seg) => {
      const em = seg.startsWith("**");
      return seg
        .replace(/\*\*/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => ({ w, em }));
    });
}

/**
 * Heading whose words rise out of a mask one after another. The full text stays in the DOM as real
 * text (SEO/screen readers read it normally); only the per-word wrappers animate.
 */
export function SplitText({
  text,
  as: Tag = "h2",
  className,
  id,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const words = parseMarks(text);
  const marked = words.some((w) => w.em);
  const tone = (em: boolean) => (marked && !em ? "opacity-45" : undefined);
  if (reduce)
    return (
      <Tag id={id} className={className}>
        {words.map((w, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className={tone(w.em)}>{w.w}</span>
          </Fragment>
        ))}
      </Tag>
    );
  return (
    <LazyMotion features={domAnimation} strict>
      {/* observe the heading itself: the word spans start fully clipped by their masks, so they can't be observed */}
      <Tag ref={ref} id={id} className={className}>
        {words.map((w, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className={cn("inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top", tone(w.em))}>
              <m.span
                className="inline-block will-change-transform"
                initial={{ y: "110%" }}
                animate={inView ? { y: "0%" } : { y: "110%" }}
                transition={{ duration: 0.9, delay: delay + i * 0.045, ease: EASE }}
              >
                {w.w}
              </m.span>
            </span>
          </Fragment>
        ))}
      </Tag>
    </LazyMotion>
  );
}

/** Moves its child a few pixels toward the pointer (desktop only), springing back on leave. */
export function Magnetic({ children, strength = 0.22, className }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div className={cn("inline-flex", className)} style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
        {children}
      </m.div>
    </LazyMotion>
  );
}

/** Drifts its content against the scroll for a sense of depth. */
export function Parallax({ children, offset = 50, className }: { children: ReactNode; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div ref={ref} className={className} style={{ y: reduce ? 0 : y }}>
        {children}
      </m.div>
    </LazyMotion>
  );
}

/**
 * Cards pin one after another and pile up like a deck: each card sticks slightly lower than the last,
 * and the cards underneath ease back (scale + dim) as the next one slides over them.
 */
export function StackCards({ children, className, top = 112 }: { children: ReactNode; className?: string; top?: number }) {
  const ref = useRef<HTMLUListElement>(null);
  const items = Children.toArray(children);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <LazyMotion features={domAnimation} strict>
      <ul ref={ref} className={cn("relative", className)}>
        {items.map((child, i) => (
          <StackItem key={i} index={i} total={items.length} progress={scrollYProgress} top={top}>
            {child}
          </StackItem>
        ))}
      </ul>
    </LazyMotion>
  );
}

function StackItem({ children, index, total, progress, top }: { children: ReactNode; index: number; total: number; progress: ReturnType<typeof useScroll>["scrollYProgress"]; top: number }) {
  const reduce = useReducedMotion();
  const start = index / total;
  const target = 1 - (total - 1 - index) * 0.045;
  const scale = useTransform(progress, [start, 1], [1, target]);
  const dim = useTransform(progress, [start, 1], [0, (total - 1 - index) * 0.12]);
  const last = index === total - 1;
  return (
    <li className={cn("sticky", !last && "pb-[18vh] lg:pb-[24vh]")} style={{ top: top + index * 22 }}>
      <m.div className="relative origin-top will-change-transform" style={{ scale: reduce ? 1 : scale }}>
        {children}
        {!reduce && !last && <m.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] bg-navy-950" style={{ opacity: dim, borderRadius: "1.75rem" }} />}
      </m.div>
    </li>
  );
}

/** Pointer-follow glow for any element with the `spotlight` class (one listener for the page). */
export function SpotlightTracker() {
  useEffect(() => {
    let raf = 0;
    const onMove = (e: globalThis.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = (e.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}

/** Cycles through words in place (e.g. "Built for Hospitals → Data centres → …"). All words stay in the DOM for crawlers. */
export function RotatingWords({ words, interval = 2200, className }: { words: string[]; interval?: number; className?: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [reduce, interval, words.length]);
  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      {words.map((w, k) => (
        <span
          key={w}
          aria-hidden={k !== i || undefined}
          className={cn(
            "[grid-area:1/1] whitespace-nowrap transition-[translate,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            k === i ? "translate-y-0 opacity-100 blur-0" : k === (i - 1 + words.length) % words.length ? "-translate-y-full opacity-0 blur-sm" : "translate-y-full opacity-0 blur-sm",
          )}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

/** Screen-like panel that tilts back in 3D and straightens as it scrolls into view. */
export function Tilt3D({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [26, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={ref} className={className} style={{ perspective: 1400 }}>
        <m.div className="origin-bottom will-change-transform" style={reduce ? undefined : { rotateX, scale, y }}>
          {children}
        </m.div>
      </div>
    </LazyMotion>
  );
}
