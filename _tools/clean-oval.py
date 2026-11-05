"""Remove the baked-in grey oval background from crocodile-head-trans.png.
Only near-grey, low-saturation pixels (the decorative ellipse) are made
transparent. The crocodile itself is saturated green/orange/cream, so it is
untouched. Backup written first."""
from PIL import Image
import shutil, colorsys

SRC = "assets/crocodile-head-trans.png"
BAK = "assets/crocodile-head-trans.oval-backup.png"

shutil.copyfile(SRC, BAK)

img = Image.open(SRC).convert("RGBA")
px = img.load()
w, h = img.size
print("size:", w, h)

changed = 0
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / mx if mx else 0
        light = mx / 255
        # grey oval: very low saturation, mid-to-light grey
        if sat < 0.10 and 0.72 < light < 0.98:
            px[x, y] = (r, g, b, 0)
            changed += 1

print("made transparent:", changed, f"({changed/(w*h)*100:.1f}%)")
img.save(SRC, optimize=True)
print("saved", SRC)
