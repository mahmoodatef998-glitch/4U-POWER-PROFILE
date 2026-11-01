import {
  ArrowLeftRight,
  ArrowLeft,
  BatteryCharging,
  Briefcase,
  Cog,
  Container,
  Fan,
  Fuel,
  Globe,
  MapPin,
  Monitor,
  Phone,
  Settings,
  SquareStack,
  Thermometer,
  Volume2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { FitPages } from "./fit-pages";
import { Barlow_Condensed } from "next/font/google";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { PrintButton } from "@/components/print-button";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { buildDatasheet, OPTIONS, SHUTDOWNS, VOLTAGES, type Row } from "@/lib/datasheet";
import { gensetModels, getModel, modelImage, modelName, modelPath } from "@/lib/genset-models";
import { amps } from "@/lib/quote";
import { buildMetadata } from "@/lib/seo";
import { company } from "@/lib/site";
import type { Locale } from "@/lib/utils";
import s from "./datasheet.module.css";

const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], style: ["normal", "italic"], variable: "--ds-font", display: "swap" });


export function generateStaticParams() {
  return routing.locales.flatMap((locale) => gensetModels.map((m) => ({ locale, slug: m.slug })));
}

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const m = getModel(slug);
  if (!m) return {};
  // gated asset: the indexable version is the model page
  return buildMetadata({ locale, path: `${modelPath(m)}/datasheet`, title: `${m.code} — ${locale === "ar" ? "الداتا شيت" : "Product data sheet"}`, description: modelName(m, locale), noindex: true });
}

const ICONS: Record<string, LucideIcon> = {
  engine: Cog,
  alternator: BatteryCharging,
  control: Monitor,
  bolt: Zap,
  fuel: Fuel,
  sound: Volume2,
  breaker: SquareStack,
  transfer: ArrowLeftRight,
  fan: Fan,
  battery: BatteryCharging,
  tank: Briefcase,
};
const Icon = ({ name }: { name: string }) => {
  const C = ICONS[name] ?? Settings;
  return <C aria-hidden />;
};

/** Product data sheet in the 4U style (navy / red, five A4 pages), every value from src/lib/datasheet.ts. */
export default async function ModelDatasheetPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const m = getModel(slug);
  if (!m) notFound();
  const ar = locale === "ar";
  const L = (en: string, a: string) => (ar ? a : en);
  const d = buildDatasheet(m, locale);
  const today = new Date().toISOString().slice(0, 10);
  const codeTail = m.code.replace(/^4U-/, "");
  const n = (x: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(x);
  const fuelMax = Math.max(...d.fuel.map((f) => f.lph), 1);
  const controllerName = m.controller ? `Deep Sea ${m.controller}` : L("Deep Sea controller", "وحدة تحكم Deep Sea");

  const Band = ({ title }: { title: string }) => (
    <div className={s.band}>
      <i className={s.slash} aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-full-red.png" alt="4U Power" className={s.bandLogo} />
      <div className={s.bandTitle}>
        <span className={s.kicker}>{L("Product data sheet", "بيانات فنية للمنتج")}</span>
        <strong>
          <span className={s.ltr}>
            4U-<span className={s.tail}>{codeTail}</span>
          </span>{" "}
          · {title}
        </strong>
      </div>
    </div>
  );
  const Foot = ({ no }: { no: number }) => (
    <div className={s.footBand}>
      <span className={s.ltr}>
        {d.docNo} · {today} · www.4ugenerators.com
      </span>
      <b>0{no}</b>
    </div>
  );
  const KV = ({ rows }: { rows: Row[] }) => (
    <table className={`${s.table} ${s.kv}`}>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <th scope="row">{k}</th>
            <td className={s.ltr}>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  const H2 = ({ children }: { children: ReactNode }) => <h2 className={s.h2}>{children}</h2>;

  const sixtyNotes =
    d.sixty.kind === "rated"
      ? [
          L("Engine speed 1800 rpm instead of 1500 rpm (4-pole alternator).", "سرعة المحرك 1800 لفة بدلاً من 1500 (دينامو 4 أقطاب)."),
          m.alternator.leroySomer
            ? L(
                `Ratings are the engine maker's published 1800 rpm figures, held to the ${m.alternator.leroySomer} rating at 480 V.`,
                `القدرات هي أرقام صانع المحرك على 1800 لفة، ومحدودة بقدرة ${m.alternator.leroySomer} على 480 فولت.`,
              )
            : L("Ratings are the engine maker's published 1800 rpm figures; the alternator is sized with the order.", "القدرات هي أرقام صانع المحرك على 1800 لفة؛ الدينامو يتحدد مع الطلب."),
          L("Voltage range 380–480 V; output below 480 V is confirmed with the quotation.", "مدى الجهد 380–480 فولت؛ الخرج تحت 480 فولت يتأكد مع عرض السعر."),
          L("Fuel consumption at 60 Hz on request.", "استهلاك الوقود على 60 هرتز عند الطلب."),
        ]
      : d.sixty.kind === "sixty-only"
        ? [
            L(`${m.brand} rates this engine build at 1800 rpm (60 Hz) only; the ratings on this sheet are its 60 Hz figures.`, `${m.brand} بتقنّن نسخة المحرك دي على 1800 لفة (60 هرتز) بس؛ القدرات في الشيت دي على 60 هرتز.`),
            ...(d.sixty.fiftyHzModel ? [L(`For a 50 Hz supply, see ${d.sixty.fiftyHzModel}.`, `لشبكة 50 هرتز شوف ${d.sixty.fiftyHzModel}.`)] : []),
            L("Voltage range 380–480 V at 60 Hz; output below 480 V is confirmed with the quotation.", "مدى الجهد 380–480 فولت؛ الخرج تحت 480 فولت يتأكد مع عرض السعر."),
          ]
      : d.sixty.kind === "fifty-only"
        ? [
            L("This engine build runs at 1500 rpm (50 Hz) only.", "نسخة المحرك دي بتشتغل على 1500 لفة (50 هرتز) بس."),
            L("For 60 Hz, ask for the matching 1800 rpm model.", "لـ 60 هرتز اطلب الموديل المقابل على 1800 لفة."),
          ]
        : [
            L("Engine speed becomes 1800 rpm instead of 1500 rpm (4-pole alternator).", "سرعة المحرك 1800 لفة بدلاً من 1500 (دينامو 4 أقطاب)."),
            L("Voltage range 380–480 V at 60 Hz (e.g. 480/277 V, 440/254 V).", "مدى الجهد 380–480 فولت على 60 هرتز (مثل 480/277، 440/254 فولت)."),
            L("kVA / kW output, current and fuel follow the engine's 60 Hz rating — confirmed with the quotation.", "القدرة والتيار والوقود حسب قدرة المحرك على 60 هرتز — تتأكد مع عرض السعر."),
            L("Alternator frame and AVR are re-checked per order.", "فريم الدينامو والـ AVR يتراجعوا مع كل طلب."),
          ];

  return (
    <div className={barlow.variable}>
      <div className="no-print mx-auto mt-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-2">
        <Link href={modelPath(m)} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft className="flip-rtl size-4" aria-hidden />
          {L("Back to the model", "رجوع للموديل")}
        </Link>
        <PrintButton label={L("Download PDF / print", "تحميل PDF / طباعة")} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#e02b36] px-5 text-sm font-bold text-white hover:bg-[#b81d27]" />
      </div>

      <div className={`sheet ${s.doc}`} dir={ar ? "rtl" : "ltr"} lang={locale}>
        {/* ------------------------------------------------------------ 1 · cover */}
        <section className={s.page}>
          <div className={s.hero}>
            <div className={s.heroImg}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={modelImage(m)} alt={modelName(m, locale)} />
            </div>
            <div className={s.heroShade} />
            <i className={s.slash} aria-hidden />
            <div className={s.heroTop}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-full-red.png" alt="4U Power Generation" className={s.logo} />
              <div className={s.docLabel}>
                <span className={s.kicker}>{L("Product data sheet", "بيانات فنية للمنتج")}</span>
                <span className={`${s.tag} ${s.ltr}`}>{d.docNo}</span>
              </div>
            </div>
            <div className={s.heroText}>
              <div className={s.powered}>
                {L(`${d.brandUpper} powered`, `بمحرك ${m.brand}`)}
                <br />
                {L("Diesel generating set", "مولد ديزل")}
                <span className={s.tag}>{d.hz === 60 ? "60 HZ" : d.sixty.kind === "rated" ? "50 / 60 HZ" : "50 HZ"}</span>
              </div>
              <div className={`${s.code} ${s.ltr}`}>
                4U-<span className={s.tail}>{codeTail}</span>
              </div>
              <div className={s.specLines}>
                <div className={s.ltr}>{m.brand} {m.engine} engine</div>
                <div className={s.ltr}>{d.alternatorMake.endsWith("alternator") ? d.alternatorMake : `${d.alternatorMake} alternator`}</div>
                <div className={s.ltr}>{m.controller ? `${m.controller} controller` : "Deep Sea auto start controller"}</div>
              </div>
            </div>
            <span className={`${s.tag} ${s.buildBadge}`}>
              <Container aria-hidden />
              {d.buildsBadge.toUpperCase()}
            </span>
          </div>

          <div className={s.kpis}>
            <div className={`${s.kpi} ${s.kpiRed}`}>
              <div className={s.kpiHead}>
                <Zap aria-hidden /> {L("Prime (PRP)", "أساسي (PRP)")}
              </div>
              <div className={`${s.kpiVal} ${s.ltr}`}>
                {n(d.prime.kva)}
                <small>kVA</small>
              </div>
              <div className={`${s.kpiSub} ${s.ltr}`}>{n(d.prime.kw)} kW · {d.hz === 60 ? "480 V · 60 Hz" : "400 V · 50 Hz"}</div>
            </div>
            <div className={`${s.kpi} ${s.kpiNavy}`}>
              <div className={s.kpiHead}>
                <Zap aria-hidden /> {L("Standby (ESP)", "احتياطي (ESP)")}
              </div>
              <div className={`${s.kpiVal} ${s.ltr}`}>
                {n(d.standby.kva)}
                <small>kVA</small>
              </div>
              <div className={`${s.kpiSub} ${s.ltr}`}>{n(d.standby.kw)} kW</div>
            </div>
            <div className={`${s.kpi} ${s.kpiWhite}`}>
              <div className={s.kpiHead}>
                <Fuel aria-hidden /> {L("Fuel · 75 % prime", "الوقود · 75% أساسي")}
              </div>
              <div className={`${s.kpiVal} ${s.ltr}`}>
                {d.fuel75 ? n(d.fuel75) : "—"}
                <small>L/h</small>
              </div>
              <div className={s.kpiSub}>
                <Volume2 aria-hidden />
                <span className={s.ltr}>{d.noiseDb ? `${m.enclosed?.container ? "Container" : "Silent"} ${d.noiseDb} dB(A) @ 7 m` : L("Noise on request", "الصوت عند الطلب")}</span>
              </div>
            </div>
          </div>

          <div className={s.cols}>
            <div className={s.col}>
              <div>
                <H2>{L("Overview", "نظرة عامة")}</H2>
                <p className={s.p}>{d.overview[0]}</p>
                <p className={s.p}>
                  {d.overview[1]} <span className={s.redText}>({d.overview[2]})</span>. {d.overview[3]}
                </p>
              </div>
              <div>
                <H2>{L("Supply options", "خيارات التوريد")}</H2>
                <div className={s.tiles}>
                  {[
                    { i: Settings, t: L("Open frame or silent canopy", "مفتوح أو كابينة صامتة") },
                    { i: ArrowLeftRight, t: L("ATS panel and synchronising (parallel) control", "لوحة ATS وتشغيل متوازي") },
                    { i: Thermometer, t: L("55 °C radiator and engine heaters", "رادياتير 55°م وسخانات المحرك") },
                    { i: Briefcase, t: L("External fuel tank (500–5000 L)", "خزان وقود خارجي (500–5000 لتر)") },
                  ].map(({ i: I, t }) => (
                    <div key={t} className={s.tile}>
                      <I aria-hidden />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={s.col}>
              <div>
                <H2>{L("Key features", "المميزات الرئيسية")}</H2>
                <div className={s.features}>
                  {d.features.map((f) => (
                    <div key={f.title} className={s.feature}>
                      <Icon name={f.icon} />
                      <div className={s.ltr}>
                        {f.title}
                        {f.sub && <small className={f.icon === "bolt" ? s.redSmall : undefined}>{f.sub}</small>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={s.contactBar}>
            <div className={s.contactItem}>
              <MapPin aria-hidden />
              <div>
                <b>{ar ? company.legalNameAr : "4U Power Generation (FZC)"}</b>
                <span>{L("SAIF Zone, Sharjah, UAE", "المنطقة الحرة لمطار الشارقة، الإمارات")}</span>
              </div>
            </div>
            <div className={s.contactItem}>
              <Globe aria-hidden />
              <div className={s.ltr}>
                <b>www.4ugenerators.com</b>
                <span>{company.email}</span>
              </div>
            </div>
            <div className={s.contactItem}>
              <Phone aria-hidden />
              <div>
                <b className={s.ltr}>{company.phone}</b>
                <span>{L("Sales & support", "المبيعات والدعم")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ 2 · ratings & engine */}
        <section className={s.page}>
          <Band title={L("Ratings & engine", "القدرات والمحرك")} />
          <div className={s.body}>
            <div>
              <H2>{L("Output ratings", "القدرات")}</H2>
              <table className={`${s.table} ${s.head}`}>
                <thead>
                  <tr>
                    <th className={s.ltr}>{d.hz === 60 ? "Rating · 480/277 V · 60 Hz · 1800 rpm · 0.8 pf" : "Rating · 400/230 V · 50 Hz · 1500 rpm · 0.8 pf"}</th>
                    <th>kVA</th>
                    <th>kW</th>
                    <th>{d.hz === 60 ? L("Current at 480 V", "التيار على 480 فولت") : L("Current at 400 V", "التيار على 400 فولت")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={s.rowRed}>
                    <th scope="row">{L("Prime (PRP)", "أساسي (PRP)")}</th>
                    <td>{n(d.prime.kva)}</td>
                    <td>{n(d.prime.kw)}</td>
                    <td>{d.prime.amps} A</td>
                  </tr>
                  <tr>
                    <th scope="row">{L("Standby (ESP)", "احتياطي (ESP)")}</th>
                    <td>{n(d.standby.kva)}</td>
                    <td>{n(d.standby.kw)}</td>
                    <td>{d.standby.amps} A</td>
                  </tr>
                </tbody>
              </table>
              {d.sixty.kind === "rated" && (
                <table className={`${s.table} ${s.head}`} style={{ marginTop: "3mm" }}>
                  <thead>
                    <tr>
                      <th className={s.ltr}>Rating · {d.sixty.volts ?? "480/277"} V · 60 Hz · 1800 rpm · 0.8 pf</th>
                      <th>kVA</th>
                      <th>kW</th>
                      <th>{L("Current at 480 V", "التيار على 480 فولت")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={s.rowRed}>
                      <th scope="row">{L("Prime (PRP)", "أساسي (PRP)")}</th>
                      <td>{n(d.sixty.prime)}</td>
                      <td>{n(d.sixty.primeKw)}</td>
                      <td>{amps(d.sixty.prime, "480/277")} A</td>
                    </tr>
                    <tr>
                      <th scope="row">{L("Standby (ESP)", "احتياطي (ESP)")}</th>
                      <td>{n(d.sixty.standby)}</td>
                      <td>{n(d.sixty.standbyKw)}</td>
                      <td>{amps(d.sixty.standby, "480/277")} A</td>
                    </tr>
                  </tbody>
                </table>
              )}
              <p className={s.note}>{d.hz === 60 ? L("Other voltages: 440/254 · 416/240 · 380/220 V at 60 Hz. Derating may apply.", "جهود أخرى: 440/254 · 416/240 · 380/220 فولت على 60 هرتز. قد يلزم تخفيض القدرة.") : L("Other voltages: 380/220 · 415/240 · 440/254 V at 50 Hz. Derating may apply.", "جهود أخرى: 380/220 · 415/240 · 440/254 فولت على 50 هرتز. قد يلزم تخفيض القدرة.")}</p>
              <p className={s.note}>
                <b>
                  (
                  {d.sixty.kind === "rated"
                    ? d.sixty.engine
                      ? L(`60 Hz: engine build ${d.sixty.engine}; ${d.sixty.volts ? "" : "typical genset output, "}voltage confirmed per order.`, `60 هرتز: نسخة المحرك ${d.sixty.engine}؛ الجهد يتأكد مع الطلب.`)
                      : L(`60 Hz: ${d.sixty.volts ? "rated at " + d.sixty.volts + " V" : "typical genset output"}; other voltages confirmed per order.`, "60 هرتز: الجهود الأخرى تتأكد مع الطلب.")
                    : d.sixty.kind === "sixty-only"
                      ? L(`60 Hz engine build — ${m.brand} gives no 50 Hz rating${d.sixty.fiftyHzModel ? `; 50 Hz set: ${d.sixty.fiftyHzModel}` : ""}.`, `نسخة محرك 60 هرتز — مفيش قدرة 50 هرتز${d.sixty.fiftyHzModel ? `؛ موديل 50 هرتز: ${d.sixty.fiftyHzModel}` : ""}.`)
                    : d.sixty.kind === "fifty-only"
                      ? L("50 Hz engine build — not offered at 60 Hz.", "نسخة محرك 50 هرتز — غير متاحة على 60 هرتز.")
                      : L("60 Hz / 1800 rpm: kVA, kW and current follow the engine's 60 Hz rating — confirmed per order.", "60 هرتز / 1800 لفة: القدرة والتيار حسب قدرة المحرك على 60 هرتز — تتأكد مع الطلب.")}
                  )
                </b>
              </p>
            </div>
            <div className={s.grid2w}>
              <div className={s.stack}>
                <div>
                  <H2>{L("Engine", "المحرك")}</H2>
                  <KV rows={d.engineRows} />
                </div>
              </div>
              <div className={s.stack}>
                <div className={s.darkBox}>
                  <h3>{L("How to read the ratings", "إزاي تقرأ القدرات")}</h3>
                  <h4>{L("Prime power (PRP)", "القدرة الأساسية (PRP)")}</h4>
                  <p>{L("For varying loads for unlimited hours, at an average load factor of 80 % over each 24 hours. 10 % overload is available for 1 hour in every 12 hours.", "أحمال متغيرة لعدد ساعات غير محدود، بمتوسط حمل 80% خلال كل 24 ساعة، مع تحميل زائد 10% لمدة ساعة كل 12 ساعة.")}</p>
                  <h4>{L("Standby power (ESP)", "القدرة الاحتياطية (ESP)")}</h4>
                  <p>{L("For varying loads during a mains failure only, up to 500 hours a year. No overload is permitted on standby power.", "أحمال متغيرة أثناء انقطاع الكهرباء فقط، حتى 500 ساعة سنوياً، بدون تحميل زائد.")}</p>
                  <h4>{L("Warranty", "الضمان")}</h4>
                  <p>{L("12 months or 1,000 running hours, whichever comes first.", "12 شهراً أو 1000 ساعة تشغيل أيهما أسبق.")}</p>
                </div>
                <div className={s.lightBox}>
                  <h3>{L("60 Hz operation — notes", "التشغيل على 60 هرتز — ملاحظات")}</h3>
                  <ul className={s.bullets}>
                    {sixtyNotes.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <Foot no={2} />
        </section>

        {/* ------------------------------------------------------------ 3 · alternator & fuel */}
        <section className={s.page}>
          <Band title={L("Alternator, fuel & cooling", "الدينامو والوقود والتبريد")} />
          <div className={s.body}>
            <div className={s.grid2}>
              <div>
                <H2>{L("Alternator", "الدينامو")}</H2>
                <KV rows={d.alternatorRows} />
              </div>
              <div className={s.stack}>
                {d.operatingRows.length > 0 && (
                  <div>
                    <H2>{L("Operating data", "بيانات التشغيل")}</H2>
                    <KV rows={d.operatingRows} />
                  </div>
                )}
                {d.airRows.length > 0 && (
                  <div>
                    <H2>{L("Air system", "نظام الهواء")}</H2>
                    <KV rows={d.airRows} />
                  </div>
                )}
              </div>
            </div>
            <div>
              <H2>{L("Fuel consumption", "استهلاك الوقود")}</H2>
              {d.fuel.length ? (
                <div className={s.fuelWrap}>
                  <table className={`${s.table} ${s.head} ${s.fuelTable}`}>
                    <thead>
                      <tr>
                        <th>{L("Load (% of prime)", "الحمل (% من الأساسي)")}</th>
                        <th>{d.hz} Hz · L/h</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...d.fuel].reverse().map((f) => (
                        <tr key={f.label} className={f.highlight ? s.rowRed : undefined}>
                          <th scope="row">{f.label}</th>
                          <td>{n(f.lph)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className={s.chart} aria-hidden>
                    <div className={s.bars}>
                      {d.fuel.map((f) => (
                        <div key={f.label} className={`${s.bar} ${f.highlight ? s.hot : ""}`}>
                          <b>{n(f.lph)}</b>
                          <i style={{ height: `${Math.round((f.lph / fuelMax) * 78)}%` }} />
                        </div>
                      ))}
                    </div>
                    <div className={s.barLabels}>
                      {d.fuel.map((f) => (
                        <span key={f.label}>{f.label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className={s.p}>{L("Fuel consumption figures on request.", "أرقام استهلاك الوقود عند الطلب.")}</p>
              )}
              <p className={s.note}>
                {L("Class A2 diesel. Engine published data at the engine's own rating; tolerance ± 5 %.", "ديزل فئة A2. بيانات المحرك المنشورة عند قدرته؛ التفاوت ± 5%.")} {d.hz === 60 ? <b>{L("(Figures at 1800 rpm / 60 Hz.)", "(الأرقام على 1800 لفة / 60 هرتز.)")}</b> : <b>{L("(60 Hz: consumption changes with the 1800 rpm rating — figures on request.)", "(60 هرتز: الاستهلاك يتغير مع قدرة 1800 لفة — عند الطلب.)")}</b>}
              </p>
            </div>
            <div className={s.grid2}>
              {d.coolingRows.length > 0 && (
                <div>
                  <H2>{L("Cooling", "التبريد")}</H2>
                  <KV rows={d.coolingRows} />
                </div>
              )}
              {d.lubeRows.length > 0 && (
                <div>
                  <H2>{L("Lubrication & exhaust", "التزييت والعادم")}</H2>
                  <KV rows={d.lubeRows} />
                </div>
              )}
            </div>
          </div>
          <Foot no={3} />
        </section>

        {/* ------------------------------------------------------------ 4 · control & dimensions */}
        <section className={s.page}>
          <Band title={L("Control & dimensions", "التحكم والمقاسات")} />
          <div className={s.body}>
            <div>
              <H2>
                {L("Control system", "نظام التحكم")} — <span className={s.ltr}>{controllerName.toUpperCase()}</span>
              </H2>
              <div className={s.grid2w}>
                <div className={s.cardList}>
                  {d.controllerFeatures.length ? (
                    <ul className={`${s.bullets} ${s.twoCol}`}>
                      {d.controllerFeatures.slice(0, 18).map((x) => (
                        <li key={x} className={s.ltr}>
                          {x}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={s.p}>{L("Deep Sea auto start / AMF controller; the model and its feature list are confirmed with the quotation.", "وحدة تحكم Deep Sea للتشغيل التلقائي / AMF؛ الموديل ومواصفاته تتأكد مع عرض السعر.")}</p>
                  )}
                </div>
                <div className={s.darkBox}>
                  <h3>{L("Shutdowns & alarms", "الإيقاف والإنذارات")}</h3>
                  <ul className={s.bullets}>
                    {SHUTDOWNS[ar ? "ar" : "en"].map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <H2>{L("Dimensions, weight & noise", "المقاسات والوزن والصوت")}</H2>
              <table className={`${s.table} ${s.head}`}>
                <thead>
                  <tr>
                    <th>{L("Build", "النوع")}</th>
                    <th>L × W × H (mm)</th>
                    <th>{L("Fuel tank", "خزان الوقود")}</th>
                    <th>{L("Weight", "الوزن")}</th>
                    <th>{L("Noise @ 7 m", "الصوت على 7 م")}</th>
                  </tr>
                </thead>
                <tbody>
                  {d.builds.length ? (
                    d.builds.map((b) => (
                      <tr key={b.name} className={b.highlight ? s.rowRed : undefined}>
                        <th scope="row">{b.name}</th>
                        <td className={s.ltr}>{b.dims}</td>
                        <td className={s.ltr}>{b.tank}</td>
                        <td className={s.ltr}>{b.weight}</td>
                        <td className={s.ltr}>{b.noise}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>{L("Dimensions and weights on request.", "المقاسات والأوزان عند الطلب.")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p className={s.note}>{L("Dimensions and weights are preliminary guidance. Request the general arrangement drawing (GAD) before civil or lifting work.", "المقاسات والأوزان إرشادية. اطلب الرسم العام (GAD) قبل أعمال القواعد أو الرفع.")}</p>
            </div>
            <div className={s.grid2}>
              <div>
                <H2>{m.enclosed?.container ? L("Container", "الحاوية") : L("Acoustic enclosure", "الكابينة العازلة للصوت")}</H2>
                <KV rows={d.enclosureRows} />
              </div>
              <div>
                <H2>{L("Standard scope of supply", "نطاق التوريد القياسي")}</H2>
                <div className={s.cardList}>
                  <ul className={s.bullets}>
                    {d.scope.map((x) => (
                      <li key={x} className={s.ltr}>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <Foot no={4} />
        </section>

        {/* ------------------------------------------------------------ 5 · options */}
        <section className={s.page}>
          <Band title={L("Options", "الاختيارات")} />
          <div className={s.body}>
            <div>
              <H2>{L("Optional configurations", "إضافات اختيارية")}</H2>
              <div className={s.optGrid}>
                {OPTIONS.map((o, i) => (
                  <div key={o.en} className={`${s.opt} ${i === OPTIONS.length - 1 ? s.optWide : ""}`}>
                    <h3>
                      <Icon name={o.icon} />
                      {ar ? o.ar : o.en}
                    </h3>
                    <ul className={s.bullets}>
                      {o.items.map((x) => (
                        <li key={x} className={s.ltr}>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <H2>{L("Voltages", "الجهود")}</H2>
              <div className={s.chips}>
                {VOLTAGES.map((v, i) => (
                  <span key={v} className={`${s.chip} ${i === 0 ? s.chipOn : ""} ${s.ltr}`}>
                    {v}
                  </span>
                ))}
              </div>
              <p className={s.note}>
                {L("50 Hz: 380–415 V.", "50 هرتز: 380–415 فولت.")} <b>{L("(60 Hz: 380–480 V, incl. 480/277 · 440/254 · 416/240 · 220/127 · 208/120 V.)", "(60 هرتز: 380–480 فولت.)")}</b> {L("Derating may apply. Offered subject to application duty and site conditions.", "قد يلزم تخفيض القدرة حسب ظروف التشغيل والموقع.")}
              </p>
            </div>
            <div className={s.office}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-full-red.png" alt="4U Power Generation" />
              <div>
                <h3>{L("Head office", "المكتب الرئيسي")}</h3>
                <p>
                  <b>{ar ? company.legalNameAr : "4U Power Generation (FZC)"}</b>
                  <br />
                  {ar ? company.address.streetAr : company.address.street}
                  <br />
                  {company.address.poBox}, {ar ? company.address.cityAr : company.address.city}, {ar ? "الإمارات" : "UAE"}
                </p>
              </div>
              <div>
                <h3>{L("Contact", "التواصل")}</h3>
                <p className={s.ltr}>
                  <b>{company.phone}</b>
                  <br />
                  {company.email}
                  <br />
                  www.4ugenerators.com
                </p>
              </div>
            </div>
          </div>
          <Foot no={5} />
        </section>
      </div>
      {/* phones: scale each A4 page to the screen width (layout-true zoom, so the whole sheet shows; print stays 1:1) */}
      <FitPages />
    </div>
  );
}
