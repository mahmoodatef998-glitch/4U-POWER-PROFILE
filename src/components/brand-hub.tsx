import { Gauge, Layers, ShieldCheck, Zap } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { FaqBlock } from "@/components/faq-block";
import { JsonLd } from "@/components/json-ld";
import { ModelTable } from "@/components/model-table";
import { PageHero } from "@/components/page-hero";
import { PopularSearches } from "@/components/popular-searches";
import { ProductCard } from "@/components/product-card";
import type { Faq } from "@/content/faq";
import { GENERATOR_SIZES } from "@/content/generator-sizes";
import { home } from "@/content/pages";
import { Link } from "@/i18n/navigation";
import { getProducts } from "@/lib/data";
import { BRANDS, brandHubPath, brandModels, brandName, modelName, modelPath, type GensetBrand, type GensetModel } from "@/lib/genset-models";
import { buildMetadata, localeUrl } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";

/**
 * One landing page per engine brand ("/perkins-diesel-generators"): the address the old site ranked with for
 * "perkins diesel generator" and similar searches. Everything on it comes from the model datasheets.
 */

const fmt = (n: number, locale: Locale) => new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", { maximumFractionDigits: 1 }).format(n);

function facts(brand: GensetBrand) {
  const list = brandModels(brand);
  const standby = list.map((m) => m.standbyKva);
  const prime = list.map((m) => m.primeKva);
  return {
    list,
    min: Math.min(...standby),
    max: Math.max(...standby),
    pmin: Math.min(...prime),
    pmax: Math.max(...prime),
    controllers: [...new Set(list.map((m) => m.controller))],
    container: list.some((m) => m.enclosed?.container),
  };
}

export function brandHubMetadata(brand: GensetBrand, locale: Locale) {
  const { list, min, max } = facts(brand);
  const range = `${fmt(min, locale)}–${fmt(max, locale)}`;
  return buildMetadata({
    locale,
    path: brandHubPath(brand),
    title: locale === "ar" ? `مولدات ${brandName(brand, "ar")} ديزل في الإمارات | ${range} ك.ف.أ | فور يو` : `${brand} Diesel Generators UAE | ${range} kVA | 4U`,
    description:
      locale === "ar"
        ? `${list.length} موديل مولد ديزل ${brandName(brand, "ar")} من ${fmt(min, "ar")} إلى ${fmt(max, "ar")} ك.ف.أ: القدرة الاحتياطية والأساسية واستهلاك الوقود وداتا شيت لكل موديل. مفتوح أو كاتم للصوت، مع عرض سعر في الإمارات.`
        : `${list.length} ${brand} diesel generator models from ${fmt(min, "en")} to ${fmt(max, "en")} kVA: standby and prime ratings, fuel use and a datasheet for each. Open or silent, with a UAE quote.`,
  });
}

/** Smallest, mid-size (nearest 500 kVA) and largest model that have fuel figures. */
function fuelExamples(list: GensetModel[]) {
  const withFuel = list.filter((m) => m.fuelLph);
  if (!withFuel.length) return [];
  const mid = [...withFuel].sort((a, b) => Math.abs(a.standbyKva - 500) - Math.abs(b.standbyKva - 500))[0]!;
  return [...new Set([withFuel[0]!, mid, withFuel[withFuel.length - 1]!])].sort((a, b) => a.standbyKva - b.standbyKva);
}

function hubFaq(brand: GensetBrand, f: ReturnType<typeof facts>): Faq[] {
  const arName = brandName(brand, "ar");
  const kvas = [...new Set(f.list.map((m) => m.standbyKva))];
  const fuel = fuelExamples(f.list);
  const example = f.list.find((m) => m.standbyKva >= 100) ?? f.list[0]!;
  const ctrl = f.controllers.join(" / ");
  const items: Faq[] = [
    {
      q: { en: `What sizes of ${brand} diesel generator do you supply?`, ar: `ما هي أحجام مولدات ${arName} الديزل المتوفرة لديكم؟` },
      a: {
        en: `${f.list.length} models from ${fmt(f.min, "en")} to ${fmt(f.max, "en")} kVA standby: ${kvas.map((k) => fmt(k, "en")).join(", ")} kVA. Each model has its own datasheet with the engine, alternator, fuel consumption and dimensions.`,
        ar: `${f.list.length} موديل من ${fmt(f.min, "ar")} إلى ${fmt(f.max, "ar")} ك.ف.أ احتياطي: ${kvas.map((k) => fmt(k, "ar")).join("، ")} ك.ف.أ. لكل موديل داتا شيت خاصة به تشمل المحرك والدينامو واستهلاك الوقود والأبعاد.`,
      },
    },
  ];
  if (fuel.length) {
    items.push({
      q: { en: `How much diesel does a ${brand} generator use?`, ar: `كم يستهلك مولد ${arName} من الديزل؟` },
      a: {
        en: `It depends on the rating and the load. From the datasheets: ${fuel.map((m) => `${m.code} (${fmt(m.standbyKva, "en")} kVA) uses about ${fmt(m.fuelLph!.p75, "en")} L/h at 75% and ${fmt(m.fuelLph!.p100, "en")} L/h at 100% prime load`).join("; ")}. Every model page lists its own figures.`,
        ar: `يعتمد على القدرة والحمل. من الداتا شيت: ${fuel.map((m) => `${m.code} (${fmt(m.standbyKva, "ar")} ك.ف.أ) يستهلك نحو ${fmt(m.fuelLph!.p75, "ar")} لتر/ساعة عند 75% و${fmt(m.fuelLph!.p100, "ar")} لتر/ساعة عند 100% من القدرة الأساسية`).join("؛ ")}. صفحة كل موديل فيها أرقامه.`,
      },
    });
  }
  items.push(
    {
      q: { en: "What is the difference between the standby and prime rating?", ar: "ما الفرق بين القدرة الاحتياطية والقدرة الأساسية؟" },
      a: {
        en: `Standby is the rating for mains-failure use; prime is the rating for continuous running with a varying load (ISO 8528). For example, the ${example.code} is ${fmt(example.standbyKva, "en")} kVA standby and ${fmt(example.primeKva, "en")} kVA prime. Size on prime if the generator is your main source of power.`,
        ar: `القدرة الاحتياطية للاستخدام عند انقطاع الكهرباء، والأساسية للتشغيل المستمر بحمل متغير (ISO 8528). مثلاً ${example.code} قدرته ${fmt(example.standbyKva, "ar")} ك.ف.أ احتياطي و${fmt(example.primeKva, "ar")} ك.ف.أ أساسي. اختر على أساس القدرة الأساسية إذا كان المولد مصدر الكهرباء الرئيسي.`,
      },
    },
    {
      q: { en: `Which alternator and controller come with a ${brand} set?`, ar: `ما الدينامو ولوحة التحكم في مولد ${arName}؟` },
      a: {
        en: `Alternator: 4U · Leroy-Somer | Stamford. Controller: Deep Sea ${ctrl}, depending on the model. The exact frame and controller for each rating are on its datasheet.`,
        ar: `الدينامو: 4U · Leroy-Somer | Stamford. لوحة التحكم: Deep Sea ${ctrl} حسب الموديل. موديل الدينامو ولوحة التحكم لكل قدرة موجودان في الداتا شيت الخاصة بها.`,
      },
    },
    {
      q: { en: `What warranty comes with a ${brand} generator?`, ar: `ما ضمان مولد ${arName}؟` },
      a: {
        en: "12 months / 1,000 running hours from 4U Power Generation, with service contracts available after handover.",
        ar: "12 شهراً / 1,000 ساعة تشغيل من فور يو باور، مع عقود صيانة متاحة بعد التسليم.",
      },
    },
  );
  return items;
}

export async function BrandHub({ brand, locale }: { brand: GensetBrand; locale: Locale }) {
  setRequestLocale(locale);
  const t = await getTranslations();
  const ar = locale === "ar";
  const L = <T,>(v: { en: T; ar: T }) => pick(v, locale);
  const f = facts(brand);
  const name = brandName(brand, locale);
  const path = brandHubPath(brand);
  const range = `${fmt(f.min, locale)}–${fmt(f.max, locale)}`;
  const products = (await getProducts()).filter((p) => p.category === "generator" && p.engine_brand === brand);
  // one link per standard size this brand is built in, e.g. "Perkins 500 kVA"
  const sizes = f.list.filter((m, i, all) => (GENERATOR_SIZES as readonly number[]).includes(m.standbyKva) && all.findIndex((x) => x.standbyKva === m.standbyKva) === i);
  const faq = hubFaq(brand, f);
  const title = ar ? `مولدات ${name} ديزل في الإمارات، ${range} ك.ف.أ` : `${brand} diesel generators in the UAE, ${range} kVA`;
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: f.list.length,
    itemListElement: f.list.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: modelName(m, locale), url: localeUrl(locale, modelPath(m)) })),
  };
  const stats = [
    { I: Layers, k: ar ? "الموديلات" : "Models", v: String(f.list.length) },
    { I: Zap, k: ar ? "احتياطي" : "Standby", v: `${range} ${ar ? "ك.ف.أ" : "kVA"}` },
    { I: Gauge, k: ar ? "أساسي" : "Prime", v: `${fmt(f.pmin, locale)}–${fmt(f.pmax, locale)} ${ar ? "ك.ف.أ" : "kVA"}` },
    { I: ShieldCheck, k: ar ? "الضمان" : "Warranty", v: ar ? "12 شهراً / 1,000 س" : "12 months / 1,000 h" },
  ];
  const kit = [
    { k: ar ? "المحرك" : "Engine", v: `${brand} ${f.list[0]!.engine} … ${f.list[f.list.length - 1]!.engine}` },
    { k: ar ? "الدينامو" : "Alternator", v: "4U · Leroy-Somer | Stamford" },
    { k: ar ? "لوحة التحكم" : "Controller", v: `Deep Sea ${f.controllers.join(" / ")}` },
    { k: ar ? "الهيكل" : "Enclosure", v: ar ? `مفتوح أو كابينة كاتمة للصوت${f.container ? " أو حاوية" : ""}` : `Open skid or silent canopy${f.container ? ", or container" : ""}` },
    { k: ar ? "التردد" : "Frequency", v: ar ? "50 هرتز · 1500 لفة/دقيقة" : "50 Hz · 1500 rpm" },
    { k: ar ? "الضمان" : "Warranty", v: ar ? "12 شهراً / 1,000 ساعة تشغيل" : "12 months / 1,000 running hours" },
  ];
  const location = `brand_${brand.toLowerCase()}`;

  return (
    <>
      <JsonLd data={list} />
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.generators"), path: "/generators" },
          { name: ar ? `مولدات ${name}` : `${brand} generators`, path },
        ]}
        eyebrow={ar ? `${f.list.length} موديل · 50 هرتز` : `${f.list.length} models · 50 Hz`}
        title={title}
        intro={
          ar
            ? `${f.list.length} موديل مولد ديزل بمحركات ${name} من ${fmt(f.min, locale)} إلى ${fmt(f.max, locale)} ك.ف.أ احتياطي، مع دينامو Leroy-Somer أو Stamford ولوحة تحكم Deep Sea. مفتوح أو بكابينة كاتمة للصوت، ولكل موديل داتا شيت وسعر في نفس اليوم.`
            : `${f.list.length} ${brand}-engined diesel generator models from ${fmt(f.min, locale)} to ${fmt(f.max, locale)} kVA standby, with a Leroy-Somer or Stamford alternator and a Deep Sea controller. Open or in a silent canopy, each with its own datasheet and a same-day price.`
        }
        aside={
          <dl className="grid grid-cols-2 gap-3">
            {stats.map(({ I, k, v }) => (
              <div key={k} className="spotlight rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <I className="size-5 text-brand-400" aria-hidden />
                <dt className="mt-3 text-xs text-white/60">{k}</dt>
                <dd className="mt-1 text-xl font-bold text-white" dir="auto">{v}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location={location} message={t("cta.whatsappPage", { topic: ar ? `مولدات ${name}` : `${brand} diesel generators` })} size="lg" />
          <CallButton location={location} size="lg" variant="ghostDark" />
        </div>
      </PageHero>

      {sizes.length > 0 && (
        <section className="border-b border-line py-8" aria-labelledby="hub-sizes">
          <div className="container-x">
            <h2 id="hub-sizes" className="text-lg font-bold">{ar ? `مولدات ${name} حسب الحجم` : `${brand} generators by size`}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {sizes.map((m) => (
                <li key={m.slug}>
                  <Link href={modelPath(m)} className="inline-flex rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-brand-400 hover:text-brand-700">
                    {ar ? `${name} ${fmt(m.standbyKva, locale)} ك.ف.أ` : `${brand} ${fmt(m.standbyKva, locale)} kVA`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="hub-models">
        <div className="container-x">
          <h2 id="hub-models" className="text-2xl sm:text-3xl">{ar ? `كل موديلات مولدات ${name} (${f.list.length})` : `All ${brand} generator models (${f.list.length})`}</h2>
          <p className="mt-2 text-muted">
            {ar ? "افتح أي موديل لتحميل الداتا شيت أو طلب السعر." : "Open any model to download its datasheet or request a price."}
            {brand !== "Perkins" && (ar ? " الحرف (A/B/C) بعد الكود يعني محركاً بديلاً لنفس القدرة." : " A letter suffix (A/B/C) marks an alternative engine at the same rating.")}
          </p>
          <div className="mt-6">
            <ModelTable models={f.list} locale={locale} />
          </div>
          <p className="mt-3 text-xs text-muted">{ar ? "القيم حسب ISO 8528 عند 50 هرتز و1500 لفة/دقيقة." : "Ratings to ISO 8528 at 50 Hz, 1500 rpm."}</p>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="hub-kit">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="hub-kit" className="text-2xl sm:text-3xl">{ar ? `ما يأتي مع كل مولد ${name}` : `What comes with every ${brand} set`}</h2>
            <p className="mt-3 leading-7 text-muted">
              {ar ? "مواصفات من الداتا شيت. لترى أي موديل بالتفصيل افتح صفحته من الجدول أعلاه، أو " : "Straight from the datasheets. For one model in detail open its page from the table above, or "}
              <Link href="/configurator" className="font-semibold text-brand-700 underline">{ar ? "صمّم مولدك ثلاثي الأبعاد" : "build it in 3D"}</Link>
              {ar ? "." : "."}
            </p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {kit.map((r) => (
              <div key={r.k} className="rounded-2xl border border-line p-4">
                <dt className="text-xs text-muted">{r.k}</dt>
                <dd className="mt-1 font-bold text-ink" dir="auto">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {products.length > 0 && (
        <section className="section" aria-labelledby="hub-ranges">
          <div className="container-x">
            <h2 id="hub-ranges" className="text-2xl sm:text-3xl">{ar ? `مجموعات مولدات ${name}` : `${brand} generator ranges`}</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FaqBlock locale={locale} items={faq} title={ar ? `أسئلة عن مولدات ${name}` : `${brand} generator questions`} />

      <section className="section" aria-labelledby="hub-more">
        <div className="container-x">
          <h2 id="hub-more" className="text-xl sm:text-2xl">{ar ? "اختر بطريقة أخرى" : "Other ways to choose"}</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {[
              ...BRANDS.filter((b) => b !== brand).map((b) => ({ href: brandHubPath(b), label: ar ? `مولدات ${brandName(b, locale)}` : `${b} diesel generators` })),
              { href: "/generators/sizes", label: ar ? "جدول أحجام المولدات" : "Generator size chart" },
              { href: "/calculator", label: ar ? "حاسبة القدرة ك.ف.أ" : "kVA calculator" },
              { href: "/models", label: ar ? "كل الموديلات" : "All models" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-brand-400 hover:text-brand-700">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PopularSearches locale={locale} />
      <CtaBanner title={L(home.cta.title)} body={L(home.cta.body)} location={`${location}_cta`} />
    </>
  );
}
