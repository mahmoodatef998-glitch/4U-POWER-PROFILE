import { SITE_URL } from "./site";

/**
 * IndexNow (Bing, Yandex, Seznam, Naver…): tells search engines about new or changed URLs instantly.
 * The key is public by design — search engines verify it against /<key>.txt on our own host.
 */
export const INDEXNOW_KEY = "64928c3767aa5737763d9e0652dff43c";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10_000;

/** Submit absolute URLs on our host. No-ops outside production so previews never ping search engines. */
export async function submitIndexNow(urls: string[]): Promise<{ ok: boolean; status?: number; count: number }> {
  if (process.env.VERCEL_ENV !== "production") return { ok: false, count: 0 };
  const host = new URL(SITE_URL).host;
  const urlList = [...new Set(urls)].filter((u) => new URL(u).host === host).slice(0, MAX_URLS);
  if (!urlList.length) return { ok: false, count: 0 };
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList }),
    });
    return { ok: res.ok, status: res.status, count: urlList.length };
  } catch (err) {
    console.error("[indexnow] submit failed", err);
    return { ok: false, count: urlList.length };
  }
}
