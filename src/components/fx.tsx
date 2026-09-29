"use client";

import { LazyMotion, domAnimation, m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Children, Fragment, useEffect, useRef, type ElementType, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const words = text.split(/\s+/).filter(Boolean);
  if (reduce) return <Tag id={id} className={className}>{text}</Tag>;
  return (
    <LazyMotion features={domAnimation} strict>
      <Tag id={id} className={className}>
        {words.map((w, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
              <m.span
                className="inline-block will-change-transform"
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.9, delay: delay + i * 0.045, ease: EASE }}
              >
                {w}
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
