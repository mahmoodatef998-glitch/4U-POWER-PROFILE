"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export type FaqItem = { q: string; a: string };

/** Accessible accordion. Answers stay in the DOM (forceMount + hidden) so crawlers can read them. */
export function FaqAccordion({ items, dark }: { items: FaqItem[]; dark?: boolean }) {
  return (
    <Accordion.Root type="single" collapsible defaultValue="faq-0" className={dark ? "divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur" : "divide-y divide-line rounded-2xl border border-line bg-navy-900"}>
      {items.map((f, i) => (
        <Accordion.Item key={f.q} value={`faq-${i}`} className="group">
          <Accordion.Header asChild>
            <h3>
              <Accordion.Trigger className={`flex w-full items-center justify-between gap-4 px-5 py-5 text-start text-base font-bold sm:px-6 sm:text-lg ${dark ? "text-white hover:text-brand-400" : "text-ink hover:text-brand-700"}`}>
                {f.q}
                <Plus className={`size-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-45 ${dark ? "text-brand-400" : "text-brand-600"}`} aria-hidden />
              </Accordion.Trigger>
            </h3>
          </Accordion.Header>
          <Accordion.Content forceMount className={`px-5 pb-5 data-[state=closed]:hidden sm:px-6 ${dark ? "text-white/70" : "text-muted"}`}>
            <p className="leading-7">{f.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
