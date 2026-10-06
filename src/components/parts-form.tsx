"use client";

import { Camera, CheckCircle2, Loader2, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useId, useRef, useState, useTransition, type FormEvent } from "react";
import type { PartsState } from "@/app/actions/parts";
import { submitPartsForm } from "@/lib/api-client";
import { engineBrandLabels, engineBrands } from "@/content/taxonomy";
import { trackEvent } from "@/lib/analytics";
import { cn, type Locale } from "@/lib/utils";
import { WhatsAppButton } from "./cta-buttons";
import { Button } from "./ui/button";
import { readUtm } from "./utm-capture";

const MAX_PHOTOS = 3;
const MAX_EDGE = 1600;

/** Downscale a photo to ≤1600 px JPEG so three phone photos fit comfortably in one request. */
async function shrink(file: File): Promise<File> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * k);
  canvas.height = Math.round(bmp.height * k);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
  if (!blob) throw new Error("encode");
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}

const T = {
  en: {
    name: "Your name",
    phone: "Mobile / WhatsApp",
    email: "Email (optional)",
    country: "Country / city",
    brand: "Engine or generator brand",
    brandAny: "Select brand (optional)",
    other: "Other / not sure",
    model: "Generator model or serial number",
    modelHint: "From the nameplate on the canopy or engine, if you have it",
    parts: "Part numbers or description",
    partsHint: "One per line, e.g. 2654403 oil filter, AVR for Stamford alternator, starter motor…",
    qty: "Quantity",
    photos: "Photos of the part or nameplate",
    photosHint: "Up to 3 photos. A clear photo of the part and the generator nameplate is the fastest way to a correct quote.",
    add: "Add photo",
    submit: "Send parts request",
    errName: "Please enter your name.",
    errPhone: "Please enter a valid phone number.",
    errPart: "Add a part number, model or at least one photo.",
    error: "Something went wrong. Please try again, or send the photos on WhatsApp.",
    photoErr: "This photo could not be read — try a JPG or PNG.",
    success: "Request received. A parts engineer will check availability and reply with price and delivery, usually the same working day.",
  },
  ar: {
    name: "الاسم",
    phone: "الجوال / واتساب",
    email: "البريد الإلكتروني (اختياري)",
    country: "الدولة / المدينة",
    brand: "ماركة المحرك أو المولد",
    brandAny: "اختر الماركة (اختياري)",
    other: "أخرى / غير متأكد",
    model: "موديل المولد أو الرقم التسلسلي",
    modelHint: "من لوحة البيانات على الكابينة أو المحرك إن وُجدت",
    parts: "أرقام القطع أو وصفها",
    partsHint: "قطعة في كل سطر، مثل: 2654403 فلتر زيت، AVR لدينامو ستامفورد، مارش…",
    qty: "الكمية",
    photos: "صور القطعة أو لوحة البيانات",
    photosHint: "حتى 3 صور. صورة واضحة للقطعة ولوحة بيانات المولد هي أسرع طريق لعرض سعر صحيح.",
    add: "أضف صورة",
    submit: "أرسل طلب قطع الغيار",
    errName: "يرجى إدخال الاسم.",
    errPhone: "يرجى إدخال رقم هاتف صحيح.",
    errPart: "أضف رقم القطعة أو الموديل أو صورة واحدة على الأقل.",
    error: "حدث خطأ. حاول مرة أخرى أو أرسل الصور على الواتساب.",
    photoErr: "تعذرت قراءة هذه الصورة، جرّب صيغة JPG أو PNG.",
    success: "تم استلام طلبك. سيتحقق مهندس قطع الغيار من التوفر ويرد بالسعر ومدة التوصيل، عادةً في نفس يوم العمل.",
  },
};

export function PartsForm() {
  const locale = useLocale() as Locale;
  const t = T[locale];
  const uid = useId();
  const [state, setState] = useState<PartsState>({ status: "idle" });
  const [pending, start] = useTransition();
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [photoErr, setPhotoErr] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // release preview object URLs when the list changes / unmounts
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos]);

  const addPhotos = async (files: FileList | null) => {
    if (!files) return;
    setPhotoErr(false);
    const next = [...photos];
    for (const f of Array.from(files)) {
      if (next.length >= MAX_PHOTOS) break;
      try {
        const small = await shrink(f);
        next.push({ file: small, url: URL.createObjectURL(small) });
      } catch {
        setPhotoErr(true);
      }
    }
    setPhotos(next);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.delete("photos-picker");
    for (const p of photos) fd.append("photos", p.file);
    fd.set("locale", locale);
    fd.set("source_page", window.location.pathname);
    for (const [k, v] of Object.entries(readUtm())) if (v) fd.set(k, v);
    start(async () => {
      const res = await submitPartsForm(fd);
      setState(res);
      if (res.status === "success") trackEvent("generate_lead", { source: "parts", photos: photos.length });
    });
  };

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <CheckCircle2 className="size-8 text-emerald-600" aria-hidden />
        <p className="mt-3 font-semibold leading-7">{t.success}</p>
        <WhatsAppButton location="parts_success" className="mt-5" />
      </div>
    );
  }

  const field =
    "mt-1.5 block w-full rounded-xl border border-zinc-300 bg-navy-900 px-4 py-3 text-base text-ink placeholder:text-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 aria-[invalid=true]:border-red-600";
  const label = "text-sm font-bold text-ink";
  const err = (k: "name" | "phone" | "part") => (state.errors?.[k] ? t[k === "part" ? "errPart" : k === "name" ? "errName" : "errPhone"] : null);

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label htmlFor={`${uid}-name`} className={label}>{t.name}</label>
        <input id={`${uid}-name`} name="name" autoComplete="name" required className={field} aria-invalid={!!err("name")} />
        {err("name") && <p className="mt-1 text-sm text-red-600">{err("name")}</p>}
      </div>
      <div>
        <label htmlFor={`${uid}-phone`} className={label}>{t.phone}</label>
        <input id={`${uid}-phone`} name="phone" type="tel" dir="ltr" autoComplete="tel" required className={field} aria-invalid={!!err("phone")} />
        {err("phone") && <p className="mt-1 text-sm text-red-600">{err("phone")}</p>}
      </div>
      <div>
        <label htmlFor={`${uid}-email`} className={label}>{t.email}</label>
        <input id={`${uid}-email`} name="email" type="email" dir="ltr" autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor={`${uid}-country`} className={label}>{t.country}</label>
        <input id={`${uid}-country`} name="country" autoComplete="country-name" className={field} />
      </div>
      <div>
        <label htmlFor={`${uid}-brand`} className={label}>{t.brand}</label>
        <select id={`${uid}-brand`} name="brand" defaultValue="" className={field}>
          <option value="">{t.brandAny}</option>
          {engineBrands.map((b) => (
            <option key={b} value={b}>{engineBrandLabels[b]?.[locale] ?? b}</option>
          ))}
          {["Caterpillar", "John Deere", "Mitsubishi", "MTU", "Doosan", "Deutz", "Stamford", "Leroy-Somer"].map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
          <option value="Other">{t.other}</option>
        </select>
      </div>
      <div>
        <label htmlFor={`${uid}-model`} className={label}>{t.model}</label>
        <input id={`${uid}-model`} name="model" dir="ltr" className={field} aria-describedby={`${uid}-model-hint`} />
        <p id={`${uid}-model-hint`} className="mt-1 text-xs text-muted">{t.modelHint}</p>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-parts`} className={label}>{t.parts}</label>
        <textarea id={`${uid}-parts`} name="parts" rows={4} className={field} aria-describedby={`${uid}-parts-hint`} aria-invalid={!!err("part")} />
        <p id={`${uid}-parts-hint`} className="mt-1 text-xs text-muted">{t.partsHint}</p>
      </div>
      <div>
        <label htmlFor={`${uid}-qty`} className={label}>{t.qty}</label>
        <input id={`${uid}-qty`} name="quantity" inputMode="numeric" className={field} />
      </div>

      <div className="sm:col-span-2">
        <p className={label}>{t.photos}</p>
        <p className="mt-1 text-xs text-muted">{t.photosHint}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {photos.map((p, i) => (
            <div key={p.url} className="relative size-24 overflow-hidden rounded-xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a just-picked file */}
              <img src={p.url} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                aria-label={locale === "ar" ? "حذف الصورة" : "Remove photo"}
                className="absolute end-1 top-1 grid size-6 place-items-center rounded-full bg-navy-950/80 text-[#fff]"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="grid size-24 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-zinc-300 text-center text-xs font-semibold text-muted hover:border-brand-500">
              <span className="grid justify-items-center gap-1">
                <Camera className="size-6" aria-hidden />
                {t.add}
              </span>
              <input ref={fileRef} name="photos-picker" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => void addPhotos(e.target.files)} />
            </label>
          )}
        </div>
        {photoErr && <p className="mt-2 text-sm text-red-600">{t.photoErr}</p>}
        {err("part") && <p className="mt-2 text-sm text-red-600">{err("part")}</p>}
      </div>

      {state.status === "error" && !state.errors && <p className="text-sm text-red-600 sm:col-span-2">{t.error}</p>}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={pending} className={cn("w-full sm:w-auto")}>
          {pending && <Loader2 className="size-5 animate-spin" aria-hidden />}
          {t.submit}
        </Button>
      </div>
    </form>
  );
}
