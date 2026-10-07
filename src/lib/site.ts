/**
 * Single source of truth for business identity (from SAIF Zone trade license No. 23919).
 * NAP (Name / Address / Phone) here must match Google Business Profile exactly.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.4ugenerators.com").replace(/\/$/, "");

export const company = {
  brand: "4U Power Generation",
  brandAr: "فور يو باور جينيريشن",
  legalName: "4U POWER GENERATION (FZC)",
  legalNameAr: "فور يو باور جينيريشن (ش.م.ح)",
  licenseNo: "23919",
  licenseAuthority: "Sharjah Airport International Free Zone (SAIF ZONE), Government of Sharjah",
  licenseAuthorityAr: "المنطقة الحرة لمطار الشارقة الدولي (سيف زون)، حكومة الشارقة",
  legalStatus: "Free Zone Co. with Limited Liability",
  legalStatusAr: "شركة منطقة حرة ذات مسؤولية محدودة",
  activity: "Power Generation, Transmission & Distribution Equipment Trading",
  activityAr: "تجارة معدات توليد ونقل وتوزيع الطاقة",
  foundingDate: "2023-08-10",
  owners: ["Yasir Adnan Jasim", "Fadi Abdul-Halim"],
  address: {
    street: "600 M² Warehouse A2-020, SAIF Zone",
    streetAr: "مستودع A2-020 (600 م²)، المنطقة الحرة لمطار الشارقة الدولي",
    poBox: "P.O. Box 513810",
    city: "Sharjah",
    cityAr: "الشارقة",
    country: "United Arab Emirates",
    countryAr: "الإمارات العربية المتحدة",
    countryCode: "AE",
  },
  // CONTENT_TODO: confirm exact pin of Warehouse A2-020 in Google Maps and update.
  geo: { lat: 25.3263, lng: 55.5186 },
  phone: "+971 52 336 7694",
  phoneE164: "+971523367694",
  whatsapp: "971523367694",
  email: "info@4ugenerators.com", // CONTENT_TODO: confirm mailbox exists
  hours: "Mo-Sa 08:00-18:00",
  mapQuery: "SAIF Zone Warehouse A2-020, Sharjah, United Arab Emirates",
} as const;

/** Business directory listings (same NAP as above) — emitted as schema.org `sameAs` so Google ties them to this site. */
export const listings = ["https://www.yellowpages-uae.com/4u-power-generation-fzc-188988"] as const;

/** Leave a URL empty to hide that network everywhere. */
export const social = {
  facebook: "",
  instagram: "",
  linkedin: "",
  tiktok: "",
  youtube: "",
  whatsappBusiness: `https://wa.me/${company.whatsapp}`,
} as const;

export type SocialNetwork = keyof typeof social;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${company.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const telUrl = `tel:${company.phoneE164}`;
