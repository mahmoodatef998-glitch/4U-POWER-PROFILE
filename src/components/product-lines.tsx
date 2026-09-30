"use client";

import { LazyMotion, domAnimation, m, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { company, telUrl, whatsappUrl } from "@/lib/site";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SplitText } from "./fx";
import { WhatsAppIcon } from "./icons";

export type ProductLine = { id: Category; title: string; body: string; image: string; href: string; wa: string };
type Labels = { region: string; explore: string; whatsapp: string; call: string; prev: string; next: string; hint: string; total: string };

/** Share of a screen height of scrolling per card. */
const PER_CARD = 0.6;

/**
 * Pinned, full-bleed "card deck": vertical scrolling surfs through the product lines. Cards sit on a
 * diagonal in 3D — the focused card large and bright in the centre, the others receding along the
 * diagonal — and everything moves continuously on a soft spring. Arrows/dots scroll the page, so the
 * scrollbar and the deck always agree. The stage is always dark (cinematic), in both site themes.
 */
export function ProductLines({ items, labels, eyebrow, title }: { items: ProductLine[]; labels: Labels; eyebrow: string; title: string }) {
  const reduce = useReducedMotion();
  const section = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [geo, setGeo] = useState({ dx: 380, dy: 90, dir: 1 });
  const n = items.length;

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 640;
      setGeo({ dx: mobile ? w * 0.7 : Math.min(w * 0.24, 420), dy: mobile ? 0 : Math.min(h * 0.09, 80), dir: document.documentElement.dir === "rtl" ? -1 : 1 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 20, mass: 0.6, restDelta: 0.0002 });
  const pos = useTransform(smooth, (p) => Math.min(n - 1, Math.max(0, p * (n - 1))));
  useMotionValueEvent(pos, "change", (v) => setActive(Math.round(v)));

  /** Scroll the page so card i is in focus (keeps the deck and the scrollbar in sync). */
  const goTo = (i: number) => {
    const el = section.current;
    if (!el) return;
    const k = Math.max(0, Math.min(n - 1, i));
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (range * k) / (n - 1), behavior: "smooth" });
  };

  if (reduce)
    return (
      <div className="stage-dark bg-navy-950 py-16 text-white">
        <div className="container-x">
          <Heading eyebrow={eyebrow} title={title} total={labels.total} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <li key={it.id} className="h-[30rem]">
                <Card item={it} index={i} total={n} labels={labels} focused />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={section} className="stage-dark relative" style={{ height: `${100 + (n - 1) * PER_CARD * 100}svh` }} role="region" aria-label={labels.region}>
        <div className="sticky top-0 h-svh overflow-hidden bg-navy-950 text-white">
          {/* stage lighting follows the active line */}
          <div aria-hidden className={cn(`line-${items[active]!.id}`, "pointer-events-none absolute inset-0")}>
            <div className="absolute start-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[110px] transition-[background-color] duration-1000 rtl:translate-x-1/2" style={{ backgroundColor: "var(--glow)" }} />
          </div>
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

          {/* headline + counter */}
          <div className="container-x relative z-[60] flex items-start justify-between gap-6 pt-22 sm:pt-26 [@media(max-height:800px)]:sm:pt-22">
            <Heading eyebrow={eyebrow} title={title} total={labels.total} />
            <p className="font-display text-5xl leading-none font-extrabold tabular-nums text-white sm:text-7xl lg:text-8xl" dir="ltr" aria-live="polite">
              {String(active + 1).padStart(2, "0")}
            </p>
          </div>

          {/* the deck */}
          <div className="absolute inset-0 [perspective:1600px]">
            {items.map((it, i) => (
              <DeckCard key={it.id} index={i} pos={pos} geo={geo} onSelect={() => goTo(i)} focused={i === active}>
                <Card item={it} index={i} total={n} labels={labels} focused={i === active} />
              </DeckCard>
            ))}
          </div>

          {/* controls */}
          <div className="container-x absolute inset-x-0 bottom-24 z-[60] flex items-center justify-between gap-4 md:bottom-8">
            <div className="flex gap-2">
              <button type="button" onClick={() => goTo(active - 1)} aria-label={labels.prev} className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur transition hover:bg-white/15">
                <ArrowLeft className="flip-rtl size-5" aria-hidden />
              </button>
              <button type="button" onClick={() => goTo(active + 1)} aria-label={labels.next} className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur transition hover:bg-white/15">
                <ArrowRight className="flip-rtl size-5" aria-hidden />
              </button>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center">
                {items.map((it, i) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={it.title}
                    aria-current={i === active ? "true" : undefined}
                    className="group grid h-6 min-w-6 place-items-center"
                  >
                    <span className={cn("block h-1.5 rounded-full transition-all duration-500", i === active ? "w-9 bg-white" : "w-1.5 bg-white/35 group-hover:bg-white/60")} />
                  </button>
                ))}
              </div>
              <p className="hidden text-[0.7rem] font-semibold tracking-[0.3em] text-white/60 uppercase sm:block rtl:tracking-normal">{labels.hint}</p>
            </div>
            <div className="hidden w-[6.5rem] sm:block" aria-hidden />
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}

function Heading({ eyebrow, title, total }: { eyebrow: string; title: string; total: string }) {
  return (
    <div className="min-w-0 max-w-2xl">
      <p className="text-xs font-bold tracking-[0.3em] text-white/60 uppercase rtl:text-sm rtl:tracking-normal [@media(max-height:800px)]:hidden">{eyebrow}</p>
      <SplitText
        id="cat-title"
        text={title}
        className="mt-3 text-2xl leading-[1.05] font-bold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl rtl:leading-tight rtl:tracking-normal [@media(max-height:800px)]:sm:mt-0 [@media(max-height:800px)]:sm:text-3xl"
      />
      <p className="mt-3 hidden text-xs font-bold tracking-[0.3em] text-white/60 uppercase sm:block rtl:text-sm rtl:tracking-normal [@media(max-height:800px)]:sm:hidden">{total}</p>
    </div>
  );
}

/** Places one card on the 3D diagonal according to its distance from the scroll position. */
function DeckCard({ index, pos, geo, focused, onSelect, children }: { index: number; pos: MotionValue<number>; geo: { dx: number; dy: number; dir: number }; focused: boolean; onSelect: () => void; children: ReactNode }) {
  const o = useTransform(pos, (v) => index - v);
  const x = useTransform(o, (v) => v * geo.dx * geo.dir);
  const y = useTransform(o, (v) => -v * geo.dy);
  const z = useTransform(o, (v) => -Math.abs(v) * 220);
  const rotateY = useTransform(o, (v) => -Math.max(-2, Math.min(2, v)) * 14 * geo.dir);
  const opacity = useTransform(o, (v) => Math.max(0, 1 - Math.max(0, Math.abs(v) - 0.4) * 0.45));
  const zIndex = useTransform(o, (v) => 50 - Math.round(Math.abs(v) * 10));
  const filter = useTransform(o, (v) => `brightness(${(1 - Math.min(1, Math.abs(v)) * 0.45).toFixed(3)})`);

  return (
    <m.div
      className="absolute start-1/2 top-[13.5rem] h-[max(24rem,min(36rem,calc(100svh-22rem)))] w-[min(82vw,25rem)] [translate:-50%_0] will-change-transform sm:top-[15rem] sm:h-[max(26rem,min(38rem,calc(100svh-20rem)))] sm:w-[min(42vw,28rem)] rtl:[translate:50%_0] [@media(max-height:800px)]:sm:top-[10.5rem] [@media(max-height:800px)]:sm:h-[max(25rem,calc(100svh-15.5rem))]"
      style={{ x, y, z, rotateY, opacity, zIndex, filter }}
      inert={!focused}
      onClick={focused ? undefined : onSelect}
    >
      <div className={cn("h-full", !focused && "cursor-pointer")}>{children}</div>
    </m.div>
  );
}

function Card({ item: it, index, total, labels, focused }: { item: ProductLine; index: number; total: number; labels: Labels; focused: boolean }) {
  return (
    <article
      className={cn(
        `line-${it.id}`,
        "relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-navy-900 text-white shadow-[0_50px_100px_-40px_rgb(0_0_0/0.9)] transition-[border-color] duration-500",
        focused ? "border-white/30" : "border-white/10",
      )}
    >
      <div className="relative min-h-[10rem] flex-1">
        <Image src={it.image} alt={it.title} fill sizes="(min-width:640px) 26rem, 80vw" className="object-cover" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: "var(--grad)" }} />
        <span className="absolute start-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white backdrop-blur" dir="ltr">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-900 via-navy-900/70 to-transparent" />
      </div>

      <div className="relative -mt-20 flex flex-col gap-3 p-5 sm:p-6">
        <h3 className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl rtl:tracking-normal" style={{ backgroundImage: "var(--grad)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
          {it.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-white/75">{it.body}</p>

        <div className="mt-1 flex items-center gap-1.5 sm:gap-2">
          <a
            href={whatsappUrl(it.wa)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { location: "product_deck", category: it.id })}
            className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#0B7038] px-3 text-[0.8rem] font-bold sm:px-4 sm:text-sm text-[#fff] shadow-[0_10px_24px_-10px_rgb(18_140_75/0.8)] transition hover:bg-[#095c2e]"
          >
            <WhatsAppIcon className="size-4" />
            {labels.whatsapp}
          </a>
          <a
            href={telUrl}
            onClick={() => trackEvent("call_click", { location: "product_deck", category: it.id })}
            aria-label={`${labels.call} ${company.phone}`}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 text-[0.8rem] font-semibold sm:px-4 sm:text-sm text-white backdrop-blur transition hover:bg-white/20"
          >
            <Phone className="size-4" aria-hidden />
            <span dir="ltr" className="whitespace-nowrap">{company.phone}</span>
          </a>
        </div>
        <Link href={it.href} className="group/cta inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white">
          {labels.explore}
          <span className="sr-only"> — {it.title}</span>
          <ArrowRight className="flip-rtl size-4 transition-transform group-hover/cta:translate-x-1 rtl:group-hover/cta:-translate-x-1" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
