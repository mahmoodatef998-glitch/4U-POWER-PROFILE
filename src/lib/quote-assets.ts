import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getAdminClient } from "./supabase/server";

/**
 * The letterhead and Terms & Conditions PDFs quotations are printed on. They live in the private
 * "quotation-assets" bucket (uploaded from /admin/quotes), never in the public repository: a blank
 * letterhead with the company TRN must not be downloadable. assets/quotation/ (git-ignored) is a local fallback for development.
 */

export const BUCKET = "quotation-assets";
export const ASSET_FILES = { letterhead: "letterhead.pdf", terms: "terms.pdf" } as const;
export type AssetKey = keyof typeof ASSET_FILES;

export type QuoteAssets = Record<AssetKey, Uint8Array>;

async function fromStorage(key: AssetKey): Promise<Uint8Array | null> {
  const sb = getAdminClient();
  if (!sb) return null;
  try {
    const { data, error } = await sb.storage.from(BUCKET).download(ASSET_FILES[key]);
    if (error || !data) return null;
    return new Uint8Array(await data.arrayBuffer());
  } catch {
    return null;
  }
}

async function fromDisk(key: AssetKey): Promise<Uint8Array | null> {
  try {
    return new Uint8Array(await readFile(path.join(process.cwd(), "assets/quotation", ASSET_FILES[key])));
  } catch {
    return null;
  }
}

export async function loadQuoteAssets(): Promise<QuoteAssets | { missing: AssetKey[] }> {
  const keys = Object.keys(ASSET_FILES) as AssetKey[];
  const files = await Promise.all(keys.map(async (k) => (await fromStorage(k)) ?? (await fromDisk(k))));
  const missing = keys.filter((_, i) => !files[i]);
  if (missing.length) return { missing };
  return Object.fromEntries(keys.map((k, i) => [k, files[i]!])) as QuoteAssets;
}

/** When each file was last uploaded, for the status line on /admin/quotes. */
export async function assetStatus(): Promise<Record<AssetKey, string | null>> {
  const out: Record<AssetKey, string | null> = { letterhead: null, terms: null };
  const sb = getAdminClient();
  if (sb) {
    try {
      const { data } = await sb.storage.from(BUCKET).list("", { limit: 20 });
      for (const f of data ?? []) {
        const key = (Object.keys(ASSET_FILES) as AssetKey[]).find((k) => ASSET_FILES[k] === f.name);
        if (key) out[key] = f.updated_at ?? f.created_at ?? "uploaded";
      }
    } catch {
      /* bucket not created yet */
    }
  }
  for (const k of Object.keys(out) as AssetKey[]) if (!out[k] && (await fromDisk(k))) out[k] = "local";
  return out;
}
