"use client";

import { LazyMotion, domAnimation, m, useInView, useReducedMotion, animate } from "framer-motion";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

const initialFor = (from: "up" | "start" | "end" | "scale", dir: 1 | -1) =>
  from === "start" ? { opacity: 0, x: -40 * dir } : from === "end" ? { opacity: 0, x: 40 * dir } : from === "scale" ? { opacity: 0, scale: 0.96, y: 16 } : { opacity: 0, y: 28 };

/** Fade/slide-up on first entry into the viewport. Content is visible without JS (SSR opacity 1 on reduced motion). */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  from = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
  /** entry direction; "start"/"end" follow the reading direction */
  from?: "up" | "start" | "end" | "scale";
}) {
  const reduce = useReducedMotion();
  const locale = useLocale();
  const Comp = as === "li" ? m.li : as === "section" ? m.section : m.div;
  return (
    <LazyMotion features={domAnimation} strict>
      <Comp
        className={className}
        initial={reduce ? false : initialFor(from, locale === "ar" ? -1 : 1)}
        whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </Comp>
    </LazyMotion>
  );
}

/** Animated number counter; renders the final value on the server for crawlers. */
export function Counter({ to, suffix = "", locale }: { to: number; suffix?: string; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const fmt = (n: number) => new Intl.NumberFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-AE").format(Math.round(n));
  const [value, setValue] = useState(fmt(to));

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setValue(fmt(v)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
