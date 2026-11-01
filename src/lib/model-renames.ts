/**
 * Model URLs that changed when codes moved from the standby to the prime kVA (owner's rule, 1 Nov 2026: a set of
 * 100 kVA prime / 110 kVA standby is 4U-x100), plus models dropped earlier. Each old slug points to the same set's
 * new slug; an old slug that is now another model's slug (e.g. 4u-p150, now the 150 kVA prime set) is not listed —
 * that address stays a live page. Applied as permanent redirects in next.config (via legacy-exact.ts).
 * No imports here: next.config.ts loads this file.
 */
export const MODEL_RENAMES: [string, string][] = [
  ["4u-p9-9", "4u-p9"], ["4u-p17", "4u-p15"], ["4u-p22", "4u-p20"], ["4u-p33", "4u-p30"], ["4u-p50", "4u-p45"],
  ["4u-p66", "4u-p60"], ["4u-p88", "4u-p80"], ["4u-p110", "4u-p100"], ["4u-p165", "4u-p150"],
  ["4u-p220", "4u-p200"], ["4u-p228", "4u-p207"], ["4u-p275", "4u-p250"], ["4u-p337", "4u-p308"],
  ["4u-p343", "4u-p311"], ["4u-p388", "4u-p352"], ["4u-p450", "4u-p400"], ["4u-p550", "4u-p500"],
  ["4u-p660", "4u-p600"], ["4u-p700", "4u-p650"], ["4u-p780", "4u-p706"], ["4u-p825", "4u-p750"],
  ["4u-p850", "4u-p770"], ["4u-p1100", "4u-p1000"], ["4u-p1385", "4u-p1253"], ["4u-p1656", "4u-p1505"],
  ["4u-p1880", "4u-p1710"], ["4u-p2500", "4u-p2250"], ["4u-c22", "4u-c26"], ["4u-c39", "4u-c35"],
  ["4u-c55", "4u-c53"], ["4u-c66", "4u-c60"], ["4u-c75", "4u-c68"], ["4u-c110b", "4u-c100"],
  ["4u-c110a", "4u-c100b"], ["4u-c150b", "4u-c135"], ["4u-c150a", "4u-c136"], ["4u-c165", "4u-c150"],
  ["4u-c170", "4u-c155"], ["4u-c200a", "4u-c180"], ["4u-c220b", "4u-c200"], ["4u-c220a", "4u-c200b"],
  ["4u-c275", "4u-c250"], ["4u-c283", "4u-c250b"], ["4u-c350", "4u-c300"], ["4u-c345", "4u-c300b"],
  ["4u-c400", "4u-c370"], ["4u-c450", "4u-c409"], ["4u-c550c", "4u-c501"], ["4u-c550b", "4u-c500"],
  ["4u-c550", "4u-c500b"], ["4u-c550a", "4u-c500c"], ["4u-c700", "4u-c640"], ["4u-c715", "4u-c652"],
  ["4u-c825", "4u-c750"], ["4u-c900a", "4u-c810"], ["4u-c900b", "4u-c900"], ["4u-c1110", "4u-c1000"],
  ["4u-c1100", "4u-c1000b"], ["4u-c1426", "4u-c1275"], ["4u-c1675", "4u-c1416"], ["4u-c1781", "4u-c1619"],
  ["4u-c2250", "4u-c2047"], ["4u-c2519", "4u-c2290"], ["4u-k10", "4u-k9"], ["4u-k13", "4u-k12"],
  ["4u-k16", "4u-k14"], ["4u-k22", "4u-k20"], ["4u-k22b", "4u-k22-5"],
  ["4u-k25", "4u-k22-5"], ["4u-k32", "4u-k30"], ["4u-k40", "4u-k36"], ["4u-b20", "4u-b18"], ["4u-b25", "4u-b23"],
  ["4u-b35", "4u-b32"], ["4u-b44", "4u-b40"], ["4u-b55", "4u-b50"], ["4u-b72", "4u-b65"], ["4u-b88", "4u-b80"],
  ["4u-b110", "4u-b100"], ["4u-b165", "4u-b130"], ["4u-b250b", "4u-b230"], ["4u-b300", "4u-b275"],
  ["4u-b350", "4u-b320"], ["4u-b440", "4u-b400"], ["4u-b550", "4u-b500"], ["4u-b660", "4u-b600"],
  ["4u-b715", "4u-b650"], ["4u-b715b", "4u-b650b"], ["4u-b825", "4u-b750"], ["4u-b1000", "4u-b900"],
  ["4u-l11", "4u-l10"], ["4u-l14", "4u-l12-5"], ["4u-l18", "4u-l16"], ["4u-l23", "4u-l21"], ["4u-l28", "4u-l25"],
  ["4u-l28b", "4u-l25b"], ["4u-l34", "4u-l31"], ["4u-l44", "4u-l40"], ["4u-l55", "4u-l50"],
  ["4u-l55b", "4u-l50b"], ["4u-l66b", "4u-l60b"], ["4u-l69", "4u-l63"], ["4u-l72", "4u-l66"],
  ["4u-l90", "4u-l83"], ["4u-l110", "4u-l100"], ["4u-l138b", "4u-l125b"], ["4u-l165", "4u-l150"],
  ["4u-l227", "4u-l206"], ["4u-l248", "4u-l225"], ["4u-l275", "4u-l250"], ["4u-l300", "4u-l280"],
  ["4u-l358", "4u-l325"], ["4u-l385", "4u-l350"], ["4u-l413", "4u-l375"], ["4u-l440", "4u-l400"],
  ["4u-l545", "4u-l500"], ["4u-l630", "4u-l575"], ["4u-l695", "4u-l638"], ["4u-l765", "4u-l700"],
  ["4u-l820", "4u-l750"], ["4u-l985", "4u-l900"], ["4u-l1095", "4u-l1000"], ["4u-c63", "4u-c60b"],
  ["4u-c1109", "4u-c1000"],
  // ratings corrected on 1 Nov 2026 against Baudouin's rating tables and Kubota's engine data (docs/price-list.md);
  // 4U-K20B was the V2003-T-E2-BG of 4U-K22.5 at a derated 20 / 22 kVA
  ["4u-b66", "4u-b65"], ["4u-b180", "4u-b150"], ["4u-b150b", "4u-b150"], ["4u-k15", "4u-k14"], ["4u-k20b", "4u-k22-5"],
  // Cummins ratings from Cummins' G-Drive ratings card, held to the alternator's rating (1 Nov 2026)
  ["4u-c20", "4u-c26"], ["4u-c50", "4u-c53"], ["4u-c180b", "4u-c182"], ["4u-c250c", "4u-c271"], ["4u-c416", "4u-c410"], ["4u-c455b", "4u-c501"], ["4u-c650", "4u-c652"], ["4u-c1400", "4u-c1416"],
];

const BY_OLD = new Map(MODEL_RENAMES);

/** The current slug for a model slug from before the rename (shared links, saved configurator URLs). */
export const currentModelSlug = (slug: string) => BY_OLD.get(slug) ?? slug;
