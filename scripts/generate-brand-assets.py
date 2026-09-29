"""
Builds every brand asset from the two client-supplied sources in assets/source/:
  logo.jpg           -> public/brand/logo-{full,mark}-{light,dark}.png, icons, favicon
  exploded-view.jpg  -> public/images/hero/layers/*.webp (hero scroll-assembly parts), OG image
Run: pip install pillow numpy scipy && python3 scripts/generate-brand-assets.py
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "source"
BRAND = ROOT / "public" / "brand"
LAYERS = ROOT / "public" / "images" / "hero" / "layers"
BRAND.mkdir(parents=True, exist_ok=True)
LAYERS.mkdir(parents=True, exist_ok=True)


def bbox_alpha(img, t=20):
    return img.getchannel("A").point(lambda a: 255 if a > t else 0).getbbox()


# ------------------------------------------------------------------ logo
im = np.asarray(Image.open(SRC / "logo.jpg").convert("RGB")).astype(float)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
dist = 255 - np.minimum(np.minimum(r, g), b)
yellow = (r > 150) & (g > 120) & (b < 150) & (r - b > 60)

light = Image.fromarray(np.dstack([im, np.clip(dist * 2.2, 0, 255)]).astype(np.uint8), "RGBA")
dark_rgb = im.copy()
dark_rgb[~yellow] = 255  # black ink -> white for dark backgrounds
dark_a = np.where(yellow, np.clip(dist * 2.2, 0, 255), np.clip(dist * 3.2, 0, 255))
dark = Image.fromarray(np.dstack([dark_rgb, dark_a]).astype(np.uint8), "RGBA")
box = bbox_alpha(light)
for name, img in (("light", light), ("dark", dark)):
    full = img.crop(box)
    full.save(BRAND / f"logo-full-{name}.png")
    mark = full.crop((0, 0, 275, full.height))  # gear + bolt, left of the POWER wordmark
    mark.crop(bbox_alpha(mark)).save(BRAND / f"logo-mark-{name}.png")

mark_dark = Image.open(BRAND / "logo-mark-dark.png")


def tile(size, pad=0.14, radius=0.22):
    c = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(c).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * radius), fill=(10, 10, 11, 255))
    m = mark_dark.copy()
    inner = int(size * (1 - 2 * pad))
    m.thumbnail((inner, inner), Image.LANCZOS)
    c.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
    return c


tile(512).save(ROOT / "src/app/icon.png")
tile(180, radius=0).save(ROOT / "src/app/apple-icon.png")
tile(512).save(ROOT / "public/images/logo-mark.png")
tile(64).save(ROOT / "src/app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

# ------------------------------------------------------------------ hero layers
ex = np.asarray(Image.open(SRC / "exploded-view.jpg").convert("RGB")).astype(float)
H, W, _ = ex.shape
d = 255 - np.min(ex, axis=2)
mask = d > 28
mask[850:, :] = False  # legend block
mask[:115, :460] = False  # title block
opened = ndi.binary_opening(mask, structure=np.ones((7, 7)))  # drops text + leader lines
lab, _ = ndi.label(opened)
alpha = np.clip((d - 10) * 4, 0, 255)
xx = np.arange(W)[None, :].repeat(H, 0)


def comp_at(x, y):
    return lab == lab[y, x]


engine_block = comp_at(900, 450)  # engine + radiator + expansion tank
genset_left = comp_at(300, 500)  # control panel + alternator
# expansion tank + its pipe (sits on the engine) must stay with the engine, not the radiator
yy = np.arange(H)[:, None].repeat(W, 1)
tank = (xx >= 1110) & (xx < 1220) & (yy < 300)
parts = {
    "end-cover": comp_at(100, 500),
    "control-panel": genset_left & (xx < 365),
    "alternator": genset_left & (xx >= 365),
    "engine": engine_block & ((xx < 1172) | tank),
    "radiator": engine_block & (xx >= 1172) & ~tank,
    "air-filter": comp_at(600, 130),
    "silencer": comp_at(930, 100),
    "base-frame": comp_at(700, 760),
}
# yellow leader lines / callout dots sitting on dark parts (original-image coords)
cleanup = {
    "radiator": [(1285, 140, 1375, 365)],
    "base-frame": [(700, 640, 860, 800), (640, 775, 700, 805)],
    "end-cover": [(22, 338, 50, 362)],
    "alternator": [(370, 370, 395, 420), (490, 338, 515, 368)],
    "control-panel": [(222, 390, 245, 412)],
}
meta = {}
for name, m in parts.items():
    a = np.where(ndi.binary_dilation(m, iterations=5), alpha, 0)
    rgb = ex.copy()
    er, eg, eb = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    ylw = (er > 150) & (eg > 110) & (eb < 120) & (er - eb > 70)
    sel = np.zeros(a.shape, bool)
    for x0, y0, x1, y1 in cleanup.get(name, []):
        sel[y0:y1, x0:x1] = True
    bad = ndi.binary_dilation(ylw & sel, iterations=2) & sel
    if bad.any():
        _, (iy, ix) = ndi.distance_transform_edt(bad, return_indices=True)
        rgb, a = rgb[iy, ix], a[iy, ix]
    ys, xs = np.where(a > 20)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    Image.fromarray(np.dstack([rgb, a]).astype(np.uint8)[y0:y1, x0:x1], "RGBA").save(LAYERS / f"{name}.webp", quality=86, method=6)
    meta[name] = dict(x=int(x0), y=int(y0), w=int(x1 - x0), h=int(y1 - y0))
(LAYERS / "layers.json").write_text(json.dumps(meta, indent=2))
print("layers:", meta)

# ------------------------------------------------------------------ OG image (assembled set)
ASSEMBLED = {"base-frame": (0, 0), "engine": (-8, 26), "alternator": (-18, 44), "radiator": (-34, 40),
             "end-cover": (196, 36), "control-panel": (86, 22), "air-filter": (118, 96), "silencer": (2, 78)}
ORDER = ["base-frame", "end-cover", "alternator", "engine", "radiator", "control-panel", "air-filter", "silencer"]
scene = Image.new("RGBA", (1536, 840), (0, 0, 0, 0))
for n in ORDER:
    v, (dx, dy) = meta[n], ASSEMBLED[n]
    scene.alpha_composite(Image.open(LAYERS / f"{n}.webp").convert("RGBA"), (v["x"] + dx, v["y"] + dy))
scene = scene.crop(scene.getbbox())
scene.thumbnail((640, 380), Image.LANCZOS)

og = Image.new("RGBA", (1200, 630), (10, 10, 11, 255))
dr = ImageDraw.Draw(og)
for x in range(0, 1200, 48):
    dr.line([(x, 0), (x, 630)], fill=(24, 24, 27, 255))
for y in range(0, 630, 48):
    dr.line([(0, y), (1200, y)], fill=(24, 24, 27, 255))
glow = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
ImageDraw.Draw(glow).ellipse([700, 120, 1250, 620], fill=(255, 212, 38, 70))
og.alpha_composite(glow.filter(__import__("PIL.ImageFilter", fromlist=["GaussianBlur"]).GaussianBlur(90)))
logo = Image.open(BRAND / "logo-full-dark.png")
logo.thumbnail((380, 190), Image.LANCZOS)
og.alpha_composite(logo, (60, 48))
og.alpha_composite(scene, (1200 - scene.width - 30, 630 - scene.height - 50))
dr = ImageDraw.Draw(og)
bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 38)
reg = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
dr.text((64, 290), "DIESEL GENERATORS", font=bold, fill=(255, 255, 255))
dr.text((64, 336), "ATS · SWITCHGEAR", font=bold, fill=(255, 223, 88))
dr.text((64, 400), "10–2500 kVA · SAIF Zone, Sharjah", font=reg, fill=(212, 212, 216))
dr.text((64, 432), "UAE · Saudi Arabia · Iraq", font=reg, fill=(212, 212, 216))
dr.rounded_rectangle([64, 500, 440, 556], radius=28, fill=(255, 212, 38))
dr.text((88, 512), "WhatsApp +971 52 336 7694", font=reg, fill=(10, 10, 11))
og.convert("RGB").save(ROOT / "public/images/og-default.png", optimize=True)
print("brand assets written")
