import type { Faq } from "@/content/faq";
import { faqSchema } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";
import { FaqAccordion } from "./faq-section";
import { JsonLd } from "./json-ld";
import { SectionHeading } from "./section-heading";

export function FaqBlock({ locale, items, title, eyebrow, className = "bg-surface", dark }: { locale: Locale; items: Faq[]; title: string; eyebrow?: string; className?: string; dark?: boolean }) {
  const localized = items.map((f) => ({ q: pick(f.q, locale), a: pick(f.a, locale) }));
  return (
    <section className={`section ${dark ? "on-dark bg-navy-950 text-white" : className}`} aria-labelledby="faq-title">
      <JsonLd data={faqSchema(localized)} />
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="faq-title" dark={dark} eyebrow={eyebrow} title={title} />
        </div>
        <div className="lg:col-span-8">
          <FaqAccordion items={localized} dark={dark} />
        </div>
      </div>
    </section>
  );
}
