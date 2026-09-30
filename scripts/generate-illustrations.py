"""
Generates the branded placeholder illustrations in public/images/**.
These are intentional technical line-art placeholders (no stock photos were available in the build
environment). CONTENT_TODO: replace with real product / project photography — see CONTENT_TODO.md.

Run: python3 scripts/generate-illustrations.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public" / "images"
NAVY_0, NAVY_1, NAVY_2 = "#0a0a0b", "#111113", "#1c1c20"
AMBER, AMBER_D = "#ffd426", "#e6b800"
LINE = "#a1a1aa"
STEEL = "#26262b"
STEEL_L = "#3a3a41"


def frame(w, h, body, glow=(0.7, 0.35)):
    gx, gy = glow
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{NAVY_2}"/><stop offset="1" stop-color="{NAVY_0}"/></linearGradient>
<radialGradient id="gl" cx="{gx}" cy="{gy}" r="0.6"><stop offset="0" stop-color="{AMBER}" stop-opacity=".22"/><stop offset="1" stop-color="{AMBER}" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern>
<linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{STEEL_L}"/><stop offset="1" stop-color="{STEEL}"/></linearGradient>
<linearGradient id="amber" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdf58"/><stop offset="1" stop-color="{AMBER_D}"/></linearGradient>
</defs>
<rect width="{w}" height="{h}" fill="url(#bg)"/><rect width="{w}" height="{h}" fill="url(#grid)"/><rect width="{w}" height="{h}" fill="url(#gl)"/>
{body}
</svg>"""


def ground(w, y):
    return f'<ellipse cx="{w/2}" cy="{y}" rx="{w*0.42}" ry="18" fill="#000" opacity=".35"/><line x1="{w*0.06}" x2="{w*0.94}" y1="{y}" y2="{y}" stroke="{LINE}" stroke-opacity=".25"/>'


def louvers(x, y, w, h, n, gap=10):
    return "".join(f'<rect x="{x}" y="{y + i*gap}" width="{w}" height="3" rx="1.5" fill="#000" opacity=".35"/>' for i in range(n))


def canopy(x, y, w, h):
    """Sound-attenuated canopy genset seen in 3/4 view."""
    d = h * 0.22
    return f"""
<g>
<polygon points="{x},{y} {x+w},{y} {x+w+d},{y-d} {x+d},{y-d}" fill="{STEEL_L}"/>
<polygon points="{x+w},{y} {x+w+d},{y-d} {x+w+d},{y+h-d} {x+w},{y+h}" fill="#14233f"/>
<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="url(#steel)" stroke="{LINE}" stroke-opacity=".35"/>
<rect x="{x}" y="{y+h-16}" width="{w}" height="16" fill="#0d0d0f"/>
<rect x="{x+18}" y="{y+22}" width="{w*0.28}" height="{h*0.55}" rx="4" fill="none" stroke="{LINE}" stroke-opacity=".35"/>
{louvers(x+26, y+34, w*0.28-16, h*0.55-24, int((h*0.55-24)/10))}
<rect x="{x+w*0.38}" y="{y+22}" width="{w*0.3}" height="{h*0.55}" rx="4" fill="none" stroke="{LINE}" stroke-opacity=".35"/>
<rect x="{x+w*0.74}" y="{y+22}" width="{w*0.2}" height="{h*0.36}" rx="4" fill="{NAVY_1}" stroke="{AMBER}" stroke-opacity=".7"/>
<rect x="{x+w*0.76}" y="{y+30}" width="{w*0.16}" height="{h*0.12}" rx="2" fill="#0e3b2c"/>
<circle cx="{x+w*0.79}" cy="{y+h*0.36}" r="4" fill="{AMBER}"/><circle cx="{x+w*0.84}" cy="{y+h*0.36}" r="4" fill="#22c55e"/><circle cx="{x+w*0.89}" cy="{y+h*0.36}" r="4" fill="#ef4444"/>
<rect x="{x}" y="{y+h*0.72}" width="{w}" height="6" fill="url(#amber)"/>
<rect x="{x+w*0.55+d}" y="{y-d-26}" width="16" height="30" rx="3" fill="#0d0d0f" stroke="{LINE}" stroke-opacity=".4"/>
</g>"""


def open_set(x, y, w, h):
    """Open-frame genset: skid, engine block, radiator, alternator."""
    return f"""
<g>
<rect x="{x}" y="{y+h-22}" width="{w}" height="22" rx="3" fill="#0d0d0f" stroke="{LINE}" stroke-opacity=".4"/>
<rect x="{x+10}" y="{y+h*0.08}" width="{w*0.16}" height="{h*0.78}" rx="6" fill="url(#steel)" stroke="{LINE}" stroke-opacity=".4"/>
{louvers(x+18, y+h*0.12, w*0.16-16, h*0.7, int(h*0.7/9), 9)}
<rect x="{x+w*0.2}" y="{y+h*0.22}" width="{w*0.42}" height="{h*0.56}" rx="10" fill="url(#amber)"/>
<rect x="{x+w*0.23}" y="{y+h*0.14}" width="{w*0.36}" height="{h*0.12}" rx="4" fill="{AMBER_D}"/>
{''.join(f'<rect x="{x+w*0.25+i*w*0.07}" y="{y+h*0.3}" width="{w*0.045}" height="{h*0.36}" rx="3" fill="#000" opacity=".18"/>' for i in range(5))}
<rect x="{x+w*0.64}" y="{y+h*0.28}" width="{w*0.3}" height="{h*0.5}" rx="{h*0.12}" fill="url(#steel)" stroke="{LINE}" stroke-opacity=".4"/>
<circle cx="{x+w*0.79}" cy="{y+h*0.53}" r="{h*0.14}" fill="none" stroke="{LINE}" stroke-opacity=".4"/>
<rect x="{x+w*0.7}" y="{y+h*0.06}" width="{w*0.2}" height="{h*0.18}" rx="4" fill="{NAVY_1}" stroke="{AMBER}" stroke-opacity=".7"/>
<rect x="{x+w*0.72}" y="{y+h*0.09}" width="{w*0.16}" height="{h*0.07}" rx="2" fill="#0e3b2c"/>
</g>"""


def container(x, y, w, h):
    ribs = "".join(f'<line x1="{x+i*w/16}" x2="{x+i*w/16}" y1="{y+8}" y2="{y+h-8}" stroke="#000" stroke-opacity=".25" stroke-width="3"/>' for i in range(1, 16))
    return f"""
<g>
<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="url(#steel)" stroke="{LINE}" stroke-opacity=".4"/>{ribs}
<rect x="{x+w*0.06}" y="{y+h*0.2}" width="{w*0.16}" height="{h*0.6}" rx="3" fill="{NAVY_1}" stroke="{LINE}" stroke-opacity=".4"/>
{louvers(x+w*0.07, y+h*0.24, w*0.14, h*0.5, int(h*0.5/10))}
<rect x="{x+w*0.74}" y="{y+h*0.2}" width="{w*0.18}" height="{h*0.6}" rx="3" fill="{NAVY_1}" stroke="{AMBER}" stroke-opacity=".7"/>
<rect x="{x}" y="{y+h-10}" width="{w}" height="10" fill="url(#amber)"/>
<rect x="{x+w*0.4}" y="{y-40}" width="18" height="42" rx="3" fill="#0d0d0f" stroke="{LINE}" stroke-opacity=".4"/>
<rect x="{x+w*0.48}" y="{y-40}" width="18" height="42" rx="3" fill="#0d0d0f" stroke="{LINE}" stroke-opacity=".4"/>
</g>"""


def panel(x, y, w, h, cols=1, kind="ats"):
    out = []
    cw = w / cols
    for c in range(cols):
        cx = x + c * cw
        out.append(f'<rect x="{cx}" y="{y}" width="{cw-4}" height="{h}" rx="5" fill="url(#steel)" stroke="{LINE}" stroke-opacity=".45"/>')
        out.append(f'<rect x="{cx+cw*0.12}" y="{y+h*0.06}" width="{cw*0.72}" height="{h*0.14}" rx="3" fill="{NAVY_1}" stroke="{AMBER}" stroke-opacity=".6"/>')
        out.append(f'<rect x="{cx+cw*0.18}" y="{y+h*0.09}" width="{cw*0.38}" height="{h*0.08}" rx="2" fill="#0e3b2c"/>')
        out.append(f'<circle cx="{cx+cw*0.66}" cy="{y+h*0.13}" r="{min(cw,h)*0.03}" fill="{AMBER}"/>')
        out.append(f'<circle cx="{cx+cw*0.75}" cy="{y+h*0.13}" r="{min(cw,h)*0.03}" fill="#22c55e"/>')
        if kind in ("ats", "sync"):
            out.append(f'<rect x="{cx+cw*0.2}" y="{y+h*0.3}" width="{cw*0.56}" height="{h*0.22}" rx="4" fill="#0d0d0f" stroke="{LINE}" stroke-opacity=".4"/>')
            out.append(f'<rect x="{cx+cw*0.42}" y="{y+h*0.34}" width="{cw*0.12}" height="{h*0.14}" rx="2" fill="url(#amber)"/>')
        else:
            for r in range(4):
                out.append(f'<rect x="{cx+cw*0.16}" y="{y+h*(0.3+r*0.11)}" width="{cw*0.64}" height="{h*0.07}" rx="2" fill="#0d0d0f" stroke="{LINE}" stroke-opacity=".35"/>')
                for b in range(4):
                    out.append(f'<rect x="{cx+cw*(0.2+b*0.15)}" y="{y+h*(0.315+r*0.11)}" width="{cw*0.08}" height="{h*0.04}" rx="1" fill="{AMBER if b==0 else LINE}" opacity="{1 if b==0 else .5}"/>')
        out.append(f'<rect x="{cx+cw*0.84}" y="{y+h*0.45}" width="{cw*0.04}" height="{h*0.12}" rx="2" fill="{LINE}" opacity=".6"/>')
        out.append(f'<rect x="{cx}" y="{y+h-14}" width="{cw-4}" height="14" fill="#0d0d0f"/>')
    return "<g>" + "".join(out) + "</g>"


def building(x, base, w, h, windows=True):
    out = [f'<rect x="{x}" y="{base-h}" width="{w}" height="{h}" fill="#16161a" stroke="{LINE}" stroke-opacity=".25"/>']
    if windows:
        for r in range(int(h / 28)):
            for c in range(int(w / 26)):
                lit = (r * 7 + c * 3) % 5 == 0
                out.append(f'<rect x="{x+8+c*26}" y="{base-h+10+r*28}" width="14" height="14" fill="{AMBER if lit else "#26262b"}" opacity="{.8 if lit else 1}"/>')
    return "".join(out)


def bolt(cx, cy, s):
    return f'<path transform="translate({cx-20*s},{cy-20*s}) scale({s})" d="M22.5 6 11 22.5h8.2L17 34l12-17.2h-8.3L22.5 6Z" fill="{AMBER}"/>'


def write(rel, svg):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(svg.strip() + "\n", encoding="utf-8")


W, H = 800, 600
# ---------------------------------------------------------------- products
write("products/generator-canopy.svg", frame(W, H, ground(W, 470) + canopy(150, 210, 470, 250)))
write("products/generator-open.svg", frame(W, H, ground(W, 470) + open_set(140, 190, 520, 280)))
write("products/generator-container.svg", frame(W, H, ground(W, 470) + container(90, 260, 620, 210)))
write("products/ats-panel.svg", frame(W, H, ground(W, 500) + panel(290, 110, 220, 390, 1, "ats") + '<path d="M150 230h110M540 230h110" stroke="%s" stroke-width="4" stroke-dasharray="10 8"/>' % AMBER + bolt(120, 230, 1.2) + bolt(680, 230, 1.2)))
write("products/switchgear.svg", frame(W, H, ground(W, 500) + panel(120, 120, 560, 380, 4, "sg")))
write("products/mdb.svg", frame(W, H, ground(W, 500) + panel(220, 110, 360, 390, 2, "sg")))
write("products/sync-panel.svg", frame(W, H, ground(W, 500) + panel(80, 150, 330, 350, 2, "sync") + open_set(440, 300, 300, 190)))

# ---------------------------------------------------------------- projects (scene = context + equipment)
write("projects/warehouse.svg", frame(W, H, ground(W, 480) + '<path d="M60 480V260l170-70 170 70v220Z" fill="#16161a" stroke="%s" stroke-opacity=".3"/>' % LINE + '<rect x="120" y="360" width="90" height="120" fill="#26262b"/><rect x="250" y="360" width="90" height="120" fill="#26262b"/>' + canopy(430, 330, 290, 150)))
write("projects/tower.svg", frame(W, H, ground(W, 490) + building(90, 490, 180, 420) + building(290, 490, 120, 300) + canopy(450, 350, 280, 140)))
write("projects/construction.svg", frame(W, H, ground(W, 490) + '<path d="M150 490V90M150 110h330M150 110l-60 40h60M430 110v120" stroke="%s" stroke-width="10" fill="none"/>' % AMBER + '<rect x="410" y="230" width="40" height="30" fill="%s"/>' % LINE + building(260, 490, 150, 200) + open_set(460, 370, 280, 120)))
write("projects/clinic.svg", frame(W, H, ground(W, 490) + building(80, 490, 330, 250) + '<rect x="215" y="260" width="60" height="60" rx="6" fill="#fff"/><path d="M245 270v40M225 290h40" stroke="#ef4444" stroke-width="10"/>' + canopy(460, 360, 260, 130)))
write("projects/factory.svg", frame(W, H, ground(W, 490) + '<path d="M50 490V300l90 60v-60l90 60v-60l90 60V230h60v260Z" fill="#16161a" stroke="%s" stroke-opacity=".3"/>' % LINE + container(420, 330, 150, 80) + container(590, 330, 150, 80) + container(420, 420, 150, 70) + container(590, 420, 150, 70)))
write("projects/hotel.svg", frame(W, H, ground(W, 490) + building(70, 490, 260, 380) + '<rect x="70" y="100" width="260" height="20" fill="%s"/>' % AMBER + canopy(380, 340, 220, 150) + panel(640, 330, 90, 160, 1, "ats")))
write("projects/telecom.svg", frame(W, H, ground(W, 490) + '<path d="M200 490 250 110 300 490M215 380h70M228 270h44M240 170h20" stroke="%s" stroke-width="6" fill="none"/>' % LINE + '<rect x="238" y="96" width="24" height="40" fill="%s"/>' % AMBER + canopy(400, 380, 240, 110) + '<rect x="660" y="390" width="70" height="100" rx="6" fill="url(#steel)" stroke="%s"/>' % AMBER))
write("projects/farm.svg", frame(W, H, ground(W, 490) + "".join(f'<polygon points="{60+i*120},470 {150+i*120},470 {180+i*120},400 {90+i*120},400" fill="#2c2c33" stroke="{LINE}" stroke-opacity=".5"/>' for i in range(3)) + '<circle cx="660" cy="120" r="44" fill="%s"/>' % AMBER + canopy(470, 380, 260, 100)))
write("projects/mine.svg", frame(W, H, ground(W, 490) + '<path d="M40 490 220 250l120 120 90-80 160 200Z" fill="#16161a" stroke="%s" stroke-opacity=".3"/>' % LINE + container(360, 360, 390, 130)))

# ---------------------------------------------------------------- news covers (1200x630)
NW, NH = 1200, 630
def gauge(cx, cy, r):
    ticks = "".join(
        f'<line x1="{cx}" y1="{cy-r+6}" x2="{cx}" y2="{cy-r+26}" stroke="{LINE}" stroke-width="4" transform="rotate({a} {cx} {cy})"/>'
        for a in range(-120, 121, 20)
    )
    import math
    c = 2 * math.pi * r
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{STEEL_L}" stroke-width="18"/><circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{AMBER}" stroke-width="18" stroke-linecap="round" stroke-dasharray="{c*0.55} {c}" transform="rotate(150 {cx} {cy})"/>{ticks}<line x1="{cx}" y1="{cy}" x2="{cx + r*0.55}" y2="{cy - r*0.55}" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle cx="{cx}" cy="{cy}" r="14" fill="{AMBER}"/>'

write("news/kva-sizing.svg", frame(NW, NH, gauge(330, 340, 190) + canopy(640, 300, 440, 220), glow=(0.3, 0.5)))
write("news/ats-explained.svg", frame(NW, NH, '<rect x="90" y="220" width="220" height="180" rx="12" fill="url(#steel)" stroke="%s"/>' % LINE + bolt(200, 310, 2) + '<path d="M320 310h180M700 310h180" stroke="%s" stroke-width="6" stroke-dasharray="14 10"/>' % AMBER + panel(510, 130, 180, 360, 1, "ats") + open_set(890, 230, 260, 170), glow=(0.5, 0.5)))
write("news/engine-brands.svg", frame(NW, NH, open_set(80, 170, 330, 280) + open_set(440, 170, 330, 280) + open_set(800, 170, 330, 280)))
write("news/diesel-vs-gas.svg", frame(NW, NH, '<path d="M330 150c90 120 140 190 140 260a140 140 0 0 1-280 0c0-70 50-140 140-260Z" fill="url(#amber)"/>' + '<path d="M870 140c30 90 150 140 150 270a150 150 0 0 1-300 0c0-80 60-120 80-190 30 50 50 70 70 80 10-60 0-110 0-160Z" fill="#3b82f6" opacity=".85"/>' + '<text x="600" y="360" font-size="80" font-family="Arial,sans-serif" font-weight="800" fill="#fff" text-anchor="middle" opacity=".9">vs</text>'))
write("news/switchgear-maintenance.svg", frame(NW, NH, panel(90, 110, 620, 440, 4, "sg") + '<rect x="780" y="120" width="330" height="420" rx="18" fill="#16161a" stroke="%s"/>' % LINE + "".join(f'<rect x="820" y="{180+i*80}" width="36" height="36" rx="8" fill="none" stroke="{AMBER}" stroke-width="5"/><path d="M828 {198+i*80}l9 9 16-18" stroke="{AMBER}" stroke-width="6" fill="none"/><rect x="880" y="{188+i*80}" width="190" height="18" rx="9" fill="{STEEL_L}"/>' for i in range(4))))
write("news/export-markets.svg", frame(NW, NH, '<circle cx="600" cy="315" r="230" fill="none" stroke="%s" stroke-opacity=".35" stroke-width="2"/><ellipse cx="600" cy="315" rx="110" ry="230" fill="none" stroke="%s" stroke-opacity=".25"/><line x1="370" x2="830" y1="315" y2="315" stroke="%s" stroke-opacity=".25"/>' % (LINE, LINE, LINE) + '<path d="M640 300Q560 200 470 230M640 300Q600 170 560 150M640 300Q700 420 560 470" stroke="%s" stroke-width="5" fill="none"/>' % AMBER + '<circle cx="640" cy="300" r="14" fill="%s"/><circle cx="470" cy="230" r="10" fill="#fff"/><circle cx="560" cy="150" r="10" fill="#fff"/><circle cx="560" cy="470" r="8" fill="%s"/>' % (AMBER, LINE), glow=(0.53, 0.47)))

# ---------------------------------------------------------------- solar, lighting, fuel & accessories
def pv_module(x, y, w, h, skew=40):
    """Tilted PV module: cell grid on a parallelogram."""
    cells = []
    rows, cols = 4, 6
    for r in range(rows):
        for c in range(cols):
            fx0, fx1 = c / cols, (c + 1) / cols
            fy0, fy1 = r / rows, (r + 1) / rows
            pts = " ".join(f"{x + fx*w + (1-fy)*skew:.1f},{y + fy*h:.1f}" for fx, fy in ((fx0, fy0), (fx1, fy0), (fx1, fy1), (fx0, fy1)))
            cells.append(f'<polygon points="{pts}" fill="#1e3a8a" stroke="#93c5fd" stroke-opacity=".35" stroke-width="1.5"/>')
    edge = f'<polygon points="{x+skew},{y} {x+w+skew},{y} {x+w},{y+h} {x},{y+h}" fill="#0f1b3d" stroke="{LINE}" stroke-opacity=".6" stroke-width="3"/>'
    shine = f'<polygon points="{x+skew+w*0.1},{y+4} {x+skew+w*0.35},{y+4} {x+w*0.2},{y+h-4} {x+w*0.02},{y+h-4}" fill="#fff" opacity=".06"/>'
    return edge + "".join(cells) + shine


def pv_array(x, y, n=3, w=190, h=120, gap=24):
    legs = "".join(f'<path d="M{x+i*(w+gap)+30} {y+h} v70 M{x+i*(w+gap)+w-20} {y+h} v40" stroke="{LINE}" stroke-width="6" stroke-opacity=".6"/>' for i in range(n))
    return legs + "".join(pv_module(x + i * (w + gap), y, w, h) for i in range(n))


def sun(cx, cy, r):
    rays = "".join(f'<line x1="{cx}" y1="{cy-r-14}" x2="{cx}" y2="{cy-r-34}" stroke="{AMBER}" stroke-width="6" stroke-linecap="round" transform="rotate({a} {cx} {cy})"/>' for a in range(0, 360, 45))
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#amber)"/>' + rays


def light_tower(x, base, solar=False):
    """Trailer-mounted light tower: mast, 4 LED heads, body, wheels; optional PV panel on the body."""
    beam = f'<polygon points="{x+60},{base-380} {x+210},{base-380} {x+330},{base-120} {x-60},{base-120}" fill="#fff6c2" opacity=".07"/>'
    mast = f'<rect x="{x+118}" y="{base-380}" width="14" height="300" fill="url(#steel)" stroke="{LINE}" stroke-opacity=".5"/>'
    bar = f'<rect x="{x+56}" y="{base-414}" width="156" height="6" rx="3" fill="{LINE}" opacity=".7"/>'
    heads = "".join(f'<rect x="{x+60+i*38}" y="{base-410}" width="32" height="26" rx="4" fill="{NAVY_1}" stroke="{AMBER}" stroke-width="2"/><rect x="{x+64+i*38}" y="{base-386}" width="24" height="6" rx="2" fill="#fff9d6"/>' for i in range(4))
    body = f'<rect x="{x+20}" y="{base-120}" width="220" height="90" rx="8" fill="url(#amber)"/>' + louvers(x + 34, base - 108, 90, 60, 6)
    body += f'<rect x="{x+150}" y="{base-104}" width="70" height="40" rx="4" fill="{NAVY_1}" stroke="{LINE}" stroke-opacity=".5"/>'
    panel_ = pv_module(x + 30, base - 170, 190, 40, 20) if solar else ""
    wheels = "".join(f'<circle cx="{cx}" cy="{base-22}" r="22" fill="#0d0d0f" stroke="{LINE}" stroke-opacity=".5" stroke-width="4"/>' for cx in (x + 70, x + 190))
    tow = f'<path d="M{x+240} {base-50} h70" stroke="{LINE}" stroke-width="8" stroke-opacity=".6"/>'
    return beam + mast + bar + heads + panel_ + body + wheels + tow


def fuel_tank(x, y, w, h):
    return f"""
<g>
<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h*0.5}" fill="url(#steel)" stroke="{LINE}" stroke-opacity=".5"/>
<rect x="{x+w*0.08}" y="{y+h*0.18}" width="{w*0.84}" height="10" rx="5" fill="#fff" opacity=".07"/>
<rect x="{x+w*0.15}" y="{y+h-6}" width="{w*0.12}" height="46" fill="#0d0d0f"/><rect x="{x+w*0.73}" y="{y+h-6}" width="{w*0.12}" height="46" fill="#0d0d0f"/>
<rect x="{x+w*0.46}" y="{y-26}" width="46" height="30" rx="4" fill="{NAVY_1}" stroke="{AMBER}" stroke-width="2"/>
<circle cx="{x+w*0.3}" cy="{y+h*0.55}" r="{h*0.16}" fill="{NAVY_1}" stroke="{AMBER}" stroke-width="3"/>
<line x1="{x+w*0.3}" y1="{y+h*0.55}" x2="{x+w*0.3+h*0.1}" y2="{y+h*0.47}" stroke="{AMBER}" stroke-width="4"/>
<rect x="{x+w*0.55}" y="{y+h*0.42}" width="{w*0.3}" height="{h*0.26}" rx="4" fill="{NAVY_1}" opacity=".8"/>
<text x="{x+w*0.7}" y="{y+h*0.6}" font-family="Arial,sans-serif" font-size="{h*0.13:.0f}" font-weight="700" fill="{AMBER}" text-anchor="middle">DIESEL</text>
</g>"""


def trailer(x, base, w):
    return (f'<rect x="{x}" y="{base-70}" width="{w}" height="18" fill="#0d0d0f" stroke="{LINE}" stroke-opacity=".5"/>'
            f'<path d="M{x+w} {base-60} h90" stroke="{LINE}" stroke-width="8" stroke-opacity=".6"/>'
            + "".join(f'<circle cx="{cx}" cy="{base-26}" r="26" fill="#0d0d0f" stroke="{LINE}" stroke-opacity=".5" stroke-width="5"/>' for cx in (x + w * 0.3, x + w * 0.3 + 62)))


def load_bank(x, y, w, h):
    grille = "".join(f'<rect x="{x+w*0.08}" y="{y+h*0.14+i*18}" width="{w*0.5}" height="8" rx="3" fill="#000" opacity=".35"/>' for i in range(int(h*0.7/18)))
    fx, fy = x + w * 0.78, y + h * 0.45
    fan = f'<circle cx="{fx}" cy="{fy}" r="{h*0.26}" fill="{NAVY_1}" stroke="{LINE}" stroke-opacity=".5" stroke-width="3"/>'
    fan += "".join(f'<path d="M{fx} {fy} l{h*0.2} {-h*0.06}" stroke="{LINE}" stroke-width="10" stroke-linecap="round" transform="rotate({a} {fx} {fy})"/>' for a in (0, 120, 240))
    heat = "".join(f'<path d="M{x+w*0.2+i*40} {y-14} q12 -20 0 -40 q-12 -20 0 -40" stroke="#ef4444" stroke-opacity=".55" stroke-width="4" fill="none"/>' for i in range(4))
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="url(#steel)" stroke="{LINE}" stroke-opacity=".5"/>' + grille + fan + heat + f'<rect x="{x}" y="{y+h-12}" width="{w}" height="12" fill="url(#amber)"/>'


def bess(x, y, n=3):
    out = []
    for i in range(n):
        bx = x + i * 150
        out.append(f'<rect x="{bx}" y="{y}" width="130" height="260" rx="8" fill="url(#steel)" stroke="{LINE}" stroke-opacity=".5"/>')
        for r in range(6):
            out.append(f'<rect x="{bx+16}" y="{y+20+r*38}" width="98" height="26" rx="4" fill="{NAVY_1}" stroke="#22c55e" stroke-opacity=".5"/>')
            out.append(f'<rect x="{bx+22}" y="{y+28+r*38}" width="{30+((r*17+i*11)%50)}" height="10" rx="2" fill="#22c55e" opacity=".75"/>')
    return "".join(out) + bolt(x + n * 150 + 50, y + 60, 1.6)


write("products/solar-pv.svg", frame(W, H, sun(660, 110, 46) + ground(W, 500) + pv_array(70, 250, 3), glow=(0.82, 0.18)))
write("products/solar-station.svg", frame(W, H, sun(700, 90, 36) + ground(W, 500) + pv_array(40, 190, 3, 170, 90, 20) + pv_array(120, 330, 3, 170, 90, 20), glow=(0.85, 0.15)))
write("products/solar-light-tower.svg", frame(W, H, sun(680, 100, 36) + ground(W, 520) + light_tower(250, 520, solar=True), glow=(0.5, 0.2)))
write("products/light-tower.svg", frame(W, H, ground(W, 520) + light_tower(250, 520), glow=(0.45, 0.2)))
write("products/bess.svg", frame(W, H, ground(W, 480) + bess(120, 200), glow=(0.4, 0.4)))
write("products/fuel-tank.svg", frame(W, H, ground(W, 470) + fuel_tank(130, 230, 540, 200)))
write("products/generator-trailer.svg", frame(W, H, ground(W, 500) + canopy(150, 250, 380, 190) + trailer(130, 500, 420)))
write("products/load-bank.svg", frame(W, H, ground(W, 480) + load_bank(160, 230, 480, 240)))
write("products/mcc-panel.svg", frame(W, H, ground(W, 500) + panel(100, 120, 600, 380, 5, "sg")))
write("products/mv-switchgear.svg", frame(W, H, ground(W, 500) + panel(140, 90, 520, 410, 3, "ats") + bolt(400, 60, 1.1)))

# ---------------------------------------------------------------- hero
write("hero/hero-genset.svg", frame(1200, 900, ground(1200, 760) + container(60, 440, 500, 190) + canopy(620, 480, 440, 250), glow=(0.65, 0.4)))
print("illustrations written to", ROOT)
