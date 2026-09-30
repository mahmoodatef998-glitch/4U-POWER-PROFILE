import { marketGeo, marketNames } from "@/content/taxonomy";
import type { MarketCode } from "@/lib/types";
import type { Locale } from "@/lib/utils";

const W = 400;
const H = 520;
const LON = [24, 60] as const;
const LAT = [38, -30] as const;
const px = (lng: number) => ((lng - LON[0]) / (LON[1] - LON[0])) * W;
const py = (lat: number) => ((LAT[0] - lat) / (LAT[0] - LAT[1])) * H;

/** Label placement per market so nearby Gulf labels never collide. */
const LABEL: Record<MarketCode, { dx: number; dy: number; anchor: "start" | "end" | "middle" }> = {
  uae: { dx: 0, dy: 30, anchor: "middle" },
  qatar: { dx: -2, dy: -16, anchor: "middle" },
  "saudi-arabia": { dx: -14, dy: 5, anchor: "end" },
  iraq: { dx: 14, dy: 5, anchor: "start" },
  kenya: { dx: 14, dy: 5, anchor: "start" },
  "south-africa": { dx: 14, dy: 5, anchor: "start" },
};

/** Stylised export-route map: Sharjah hub → six markets, primary markets emphasised. */
export function CoverageMap({ locale, primary }: { locale: Locale; primary: MarketCode[] }) {
  const hub = marketGeo.uae;
  const hx = px(hub.lng);
  const hy = py(hub.lat);
  const codes = Object.keys(marketGeo) as MarketCode[];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="map-title" className="h-auto w-full" style={{ direction: "ltr" }}>
      <title id="map-title">
        {locale === "ar" ? "خريطة الأسواق التي نخدمها من الشارقة" : "Markets served from our Sharjah hub"}
      </title>
      <defs>
        <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill="var(--color-white)" fillOpacity="0.12" />
        </pattern>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#ffd426" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd426" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#dots)" rx="24" />
      {/* equator */}
      <line x1="0" x2={W} y1={py(0)} y2={py(0)} stroke="var(--color-white)" strokeOpacity="0.12" strokeDasharray="4 6" />
      <circle cx={hx} cy={hy} r="70" fill="url(#glow)" />
      {codes
        .filter((c) => c !== "uae")
        .map((c) => {
          const g = marketGeo[c];
          const x = px(g.lng);
          const y = py(g.lat);
          const mx = (hx + x) / 2 - (y - hy) * 0.25;
          const my = (hy + y) / 2 + (x - hx) * 0.25;
          const isPrimary = primary.includes(c);
          return (
            <path
              key={c}
              d={`M${hx},${hy} Q${mx},${my} ${x},${y}`}
              fill="none"
              stroke={isPrimary ? "#ffd426" : "var(--color-white)"}
              strokeOpacity={isPrimary ? 1 : 0.35}
              strokeWidth={isPrimary ? 2 : 1.2}
              strokeDasharray={isPrimary ? undefined : "5 5"}
            />
          );
        })}
      {codes.map((c) => {
        const g = marketGeo[c];
        const x = px(g.lng);
        const y = py(g.lat);
        const isPrimary = primary.includes(c);
        const isHub = c === "uae";
        const lab = LABEL[c];
        return (
          <g key={c}>
            {isPrimary && <circle cx={x} cy={y} r="14" fill="#ffd426" opacity="0.18" />}
            <circle cx={x} cy={y} r={isHub ? 8 : isPrimary ? 6 : 4.5} fill={isPrimary ? "#ffd426" : "#d4d4d8"} stroke="var(--color-navy-950)" strokeWidth="2" />
            <text
              x={x + lab.dx}
              y={y + lab.dy}
              textAnchor={lab.anchor}
              fontSize={isPrimary ? 15 : 13}
              fontWeight={isPrimary ? 800 : 600}
              fill="var(--color-white)"
              fillOpacity={isPrimary ? 1 : 0.75}
              fontFamily="inherit"
            >
              {isHub ? g.city[locale] : marketNames[c][locale].replace("المملكة العربية ", "")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
