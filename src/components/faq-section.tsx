"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export type FaqItem = { q: string; a: string };

/** Accessible accordion. Answers stay in the DOM (forceMount + hidden) so crawlers can read them. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion.Root type="single" collapsible defaultValue="faq-0" className="divide-y divide-line rounded-2xl border border-line bg-white">
      {items.map((f, i) => (
        <Accordion.Item key={f.q} value={`faq-${i}`} className="group">
          <Accordion.Header asChild>
            <h3>
              <Accordion.Trigger className="flex w-full items-center justify-between gap-4 px-5 py-5 text-start text-base font-bold text-ink hover:text-amber-700 sm:px-6 sm:text-lg">
                {f.q}
                <Plus className="size-5 shrink-0 text-amber-600 transition-transform duration-200 group-data-[state=open]:rotate-45" aria-hidden />
              </Accordion.Trigger>
            </h3>
          </Accordion.Header>
          <Accordion.Content forceMount className="px-5 pb-5 text-muted data-[state=closed]:hidden sm:px-6">
            <p className="leading-7">{f.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
