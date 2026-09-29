"""
Builds every brand asset from the two client-supplied sources in assets/source/:
  logo.jpg           -> public/brand/logo-{full,mark}-{light,dark}.png, icons, favicon
  exploded-v2.webp + assembled-v2.webp -> public/images/hero/layers/*.webp (hero scroll-assembly), OG image
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

# ------------------------------------------------------------------ hero layers (v2 renders)
# exploded-v2 and assembled-v2 share one camera and a 2000x1333 canvas on a white backdrop.
# Parts are cut from the exploded render at native resolution; TARGETS place each one over its
# spot in the assembled render (top-left x, y, uniform scale), tuned by overlaying both renders.
# The assembled render itself is matted and cross-faded in last, so the final frame is exact.
TARGETS = {
    "base-frame": (410, 858, 1.04),
    "mounts": (724, 900, 1.0),
    "radiator": (1478, 215, 1.06),
    "engine": (725, 370, 1.05),
    "alternator": (360, 568, 1.06),
    "control-panel": (120, 450, 1.18),
    "silencer": (932, 59, 1.075),
    "air-filter": (559, 256, 1.075),
}
# a pixel on each part (exploded coords); mounts are the two loose AV mounts
SEEDS = {
    "base-frame": [(1000, 1150)],
    "mounts": [(1390, 870), (764, 900)],
    "radiator": [(1700, 600)],
    "engine": [(1100, 600)],
    "alternator": [(500, 700)],
    "control-panel": [(130, 650)],
    "silencer": [(1200, 200)],
    "air-filter": [(700, 260)],
}


def matte(rgb):
    """
    White-backdrop matte that also works on a dark page:
      - solid mask; thin enclosed pockets (specular highlights) stay filled, wide enclosed pockets of
        backdrop (gaps inside frames, between feet) are cut out
      - soft edge alpha from the distance to white, then colours are un-blended from white so no light
        fringe shows on dark backgrounds
    """
    d = (254 - rgb).max(axis=2)
    solid = ndi.binary_closing(d > 14, iterations=3)
    holes = ndi.binary_fill_holes(solid) & ~solid
    hl, hn = ndi.label(holes)
    if hn:
        # thin pockets (<= ~24px across) are highlights on metal; wider ones are backdrop showing through
        width = ndi.maximum(ndi.distance_transform_edt(holes), hl, range(1, hn + 1))
        keep = np.isin(hl, np.where(np.asarray(width) <= 12)[0] + 1)
        solid = solid | keep
    edge = np.clip(d / 36.0, 0, 1)  # partial coverage near the backdrop
    inner = ndi.binary_erosion(solid, iterations=2)
    a = np.where(inner, 1.0, np.where(solid | ndi.binary_dilation(solid, iterations=1), edge, 0.0))
    a = ndi.gaussian_filter(a, 0.5)
    safe = np.maximum(a, 1e-3)[..., None]
    fg = np.clip((rgb - (1 - a[..., None]) * 255.0) / safe, 0, 255)
    rgb_out = np.where(a[..., None] > 0.98, rgb, fg)
    return solid, np.clip(a * 255, 0, 255), rgb_out


ex = np.asarray(Image.open(SRC / "exploded-v2.webp").convert("RGB")).astype(float)
mask, alpha, ex = matte(ex)
lab, _ = ndi.label(mask)
meta = {"canvas": {"w": ex.shape[1], "h": ex.shape[0]}, "parts": {}}
for name, seeds in SEEDS.items():
    m = np.isin(lab, [lab[y, x] for x, y in seeds])
    a = np.where(ndi.binary_dilation(m, iterations=2), alpha, 0)
    ys, xs = np.where(a > 8)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    Image.fromarray(np.dstack([ex, a]).astype(np.uint8)[y0:y1, x0:x1], "RGBA").save(LAYERS / f"{name}.webp", quality=88, method=6)
    tx, ty, sc = TARGETS[name]
    meta["parts"][name] = dict(x=int(x0), y=int(y0), w=int(x1 - x0), h=int(y1 - y0), tx=tx, ty=ty, s=sc)

asm = np.asarray(Image.open(SRC / "assembled-v2.webp").convert("RGB")).astype(float)
_, a_asm, asm = matte(asm)
assembled = Image.fromarray(np.dstack([asm, a_asm]).astype(np.uint8), "RGBA")
assembled.save(LAYERS / "assembled.webp", quality=82, method=6)
(LAYERS / "layers.json").write_text(json.dumps(meta, indent=2))
print("layers:", meta)

# ------------------------------------------------------------------ OG image (assembled set)
scene = assembled
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
