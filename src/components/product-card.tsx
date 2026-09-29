"use client";

import { Gauge, Cog } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryLabels, engineBrandLabels, fuelLabels } from "@/content/taxonomy";
import { trackEvent } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/site";
import { FUEL_ICONS, kvaLabel } from "@/lib/product-meta";
import type { Product } from "@/lib/types";
import type { Locale } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";

export function ProductCard({ product, headingLevel = "h3" }: { product: Product; headingLevel?: "h2" | "h3" }) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const name = locale === "ar" ? product.name_ar : product.name_en;
  const kva = product.category === "generator" ? kvaLabel(product, locale, t("common.kva")) : null;
  const FuelIcon = product.fuel_type ? FUEL_ICONS[product.fuel_type] : null;
  const H = headingLevel;
  const href = `/products/${product.slug}`;

  return (
    <article className={`line-${product.category} grad-border group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-navy-900 shadow-[0_1px_2px_rgb(10_10_11/0.04)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgb(10_10_11/0.35)]`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-950">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={name}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute start-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-navy-950/85 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
            {categoryLabels[product.category][locale]}
          </span>
          {kva && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold text-ink-950" style={{ background: "var(--grad)" }}>
              <Gauge className="size-3.5" aria-hidden />
              <span dir="ltr">{kva}</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <H className="text-lg leading-snug text-ink">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {name}
          </Link>
        </H>
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted">
          {product.engine_brand && (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">{t("common.engine")}</dt>
              <Cog className="size-4 text-brand-600" aria-hidden />
              <dd>{engineBrandLabels[product.engine_brand]?.[locale] ?? product.engine_brand}</dd>
            </div>
          )}
          {product.fuel_type && FuelIcon && (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">{t("common.fuel")}</dt>
              <FuelIcon className="size-4 text-brand-600" aria-hidden />
              <dd>{fuelLabels[product.fuel_type][locale]}</dd>
            </div>
          )}
        </dl>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{locale === "ar" ? product.description_ar : product.description_en}</p>

        <div className="relative z-10 mt-auto flex items-center gap-2 pt-5">
          <Link
            href={{ pathname: "/contact", query: { product: product.slug } }}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {t("cta.quote")}
          </Link>
          <a
            href={whatsappUrl(t("cta.whatsappProduct", { product: name }))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { location: "product_card", product: product.slug })}
            aria-label={`${t("cta.whatsapp")} — ${name}`}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[#0B7038] text-white transition hover:bg-[#095c2e]"
          >
            <WhatsAppIcon className="size-5" />
          </a>
        </div>
      </div>
    </article>
  );
}
