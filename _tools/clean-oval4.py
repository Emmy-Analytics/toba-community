"""Global oval scrub for crocodile-head-trans.png.
Rule: remove any pixel that is pale & low-saturation & greenish/neutral
(the sage oval). Protect: vivid green skin (high sat), orange bow (r>>g),
dark outline (dark), cream belly (warm r>g+8), pink cheek (r>g, sat mid)."""
from PIL import Image

SRC = "assets/crocodile-head-trans.png"
img = Image.open(SRC).convert("RGBA")
px = img.load()
w, h = img.size
print("size", w, h)

removed = 0
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / mx if mx else 0
        light = mx / 255
        warm = r > g + 8
        dark = mx < 130
        vivid = sat >= 0.35
        if warm or dark or vivid:
            continue
        # pale sage / neutral oval: greenish or grey, light, low-mid sat
        if g >= r - 4 and light > 0.62 and sat < 0.30:
            px[x, y] = (255, 255, 255, 0)
            removed += 1

print("removed:", removed, f"({removed/(w*h)*100:.1f}%)")
img.save(SRC, optimize=True)

# verification composite on ivory
thumb = img.copy(); thumb.thumbnail((560, 560))
bg = Image.new("RGB", (640, 640), (247, 246, 240))
bg.paste(thumb, (40, 40), thumb)
bg.save("_tools/verify2.png")
print("verify written")
