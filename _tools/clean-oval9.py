"""Definitive: remove the baked oval by silhouette masking.
1) character mask = vivid pixels (sat>=.35) OR dark pixels (mx<150), dilated 9px
2) any pale pixel (light>.5, sat<.5) OUTSIDE the mask -> transparent
The cream belly and all character detail lie inside the silhouette, so
they survive; the oval (pale sage/cream rim + dark-green rim edge) dies."""
from PIL import Image, ImageFilter

SRC = "assets/crocodile-head-trans.png"
BAK = "assets/crocodile-head-trans.oval-backup.png"

img = Image.open(BAK).convert("RGBA")
w, h = img.size
print("size", w, h)
px = img.load()

# --- 1) character mask ---
mask = Image.new("L", (w, h), 0)
mp = mask.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a < 20:
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / mx if mx else 0
        if sat >= 0.35 or mx < 150:
            mp[x, y] = 255
mask = mask.filter(ImageFilter.MaxFilter(19))  # dilate ~9px

mp = mask.load()
removed = kept = 0
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        if mp[x, y] > 0:
            kept += 1
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / mx if mx else 0
        light = mx / 255
        if light > 0.5 and sat < 0.5:
            px[x, y] = (255, 255, 255, 0)
            removed += 1
        else:
            kept += 1

print("removed:", removed, f"({removed/(w*h)*100:.1f}%)")
img.save(SRC, optimize=True)

thumb = img.copy(); thumb.thumbnail((560, 560))
bg = Image.new("RGB", (640, 640), (247, 246, 240))
bg.paste(thumb, (40, 40), thumb)
bg.save("_tools/verify7.png")
print("verify7 written")
