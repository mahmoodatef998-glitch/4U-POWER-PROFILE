export const CATEGORIES = ["generator", "ats_panel", "switchgear", "mdb", "sync_panel", "solar", "accessories"] as const;
export type Category = (typeof CATEGORIES)[number];

export const FUEL_TYPES = ["diesel", "gas", "hybrid", "solar"] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

export type SpecRow = { label_en: string; label_ar: string; value_en: string; value_ar: string };

export type Product = {
  id?: string;
  category: Category;
  slug: string;
  name_en: string;
  name_ar: string;
  kva_min: number | null;
  kva_max: number | null;
  engine_brand: string | null;
  fuel_type: FuelType | null;
  description_en: string;
  description_ar: string;
  specs: SpecRow[];
  spec_sheet_url: string | null;
  images: string[];
  sort_order: number;
  is_published: boolean;
};

export type Project = {
  id?: string;
  slug: string;
  title_en: string;
  title_ar: string;
  country: MarketCode;
  sector: Sector;
  kva: number | null;
  summary_en: string;
  summary_ar: string;
  images: string[];
  is_published: boolean;
};

export const SECTORS = ["industrial", "commercial", "construction", "healthcare", "hospitality", "oil_gas", "telecom", "residential"] as const;
export type Sector = (typeof SECTORS)[number];

export type Testimonial = {
  id?: string;
  client_name: string;
  client_company: string | null;
  country: MarketCode | null;
  quote_en: string;
  quote_ar: string;
  rating: number;
  is_published: boolean;
};

export type NewsPost = {
  id?: string;
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  body_en: string;
  body_ar: string;
  cover_image: string | null;
  published_at: string;
  is_published: boolean;
  meta_title_en?: string | null;
  meta_title_ar?: string | null;
};

export const MARKETS = ["uae", "saudi-arabia", "iraq", "qatar", "kenya", "south-africa"] as const;
export type MarketCode = (typeof MARKETS)[number];
