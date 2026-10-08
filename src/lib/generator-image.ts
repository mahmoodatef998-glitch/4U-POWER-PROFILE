import type { Product } from "./types";

/**
 * Which photo represents a diesel generator of a given size:
 *  < 250 kVA      → the product's own small-canopy photo
 *  250 – 999 kVA  → medium 4U canopy, one photo per engine brand (Perkins fallback)
 *  ≥ 1000 kVA     → the real 2000 kVA 4U containerized set (same for every brand)
 */
const P = "/images/products";

export const CONTAINER_IMAGES = [`${P}/generator-container-2000kva-4u.webp`, `${P}/generator-container-2000kva-side-4u.webp`] as const;

const MEDIUM: Record<string, string> = {
  Perkins: `${P}/perkins-diesel-generator-250-1000kva-4u.webp`,
  Cummins: `${P}/cummins-diesel-generator-250-1000kva-4u.webp`,
  "Volvo Penta": `${P}/volvo-penta-diesel-generator-250-1000kva-4u.webp`,
  Baudouin: `${P}/baudouin-diesel-generator-250-1000kva-4u.webp`,
};

export function generatorImageForKva(kva: number, brand?: string | null): string | null {
  if (kva >= 1000) return CONTAINER_IMAGES[0];
  if (kva >= 250) return MEDIUM[brand ?? ""] ?? MEDIUM.Perkins ?? null;
  return null;
}

/** For size pages: lead a diesel generator card with the photo that matches the requested kVA. */
export function withSizeImage(p: Product, kva: number): Product {
  if (p.category !== "generator" || p.fuel_type !== "diesel" || !p.engine_brand || p.engine_brand === "Chinese Engine Series") return p;
  const img = generatorImageForKva(kva, p.engine_brand);
  return img ? { ...p, images: [img, ...p.images.filter((i) => i !== img)] } : p;
}
