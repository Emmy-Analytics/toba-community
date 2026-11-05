from PIL import Image
from collections import Counter
import os

for name in os.listdir("assets"):
    if not name.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
        continue
    img = Image.open(os.path.join("assets", name)).convert("RGBA")
    px = img.load()
    w, h = img.size
    c = Counter()
    for y in range(0, h, max(1, h // 60)):
        for x in range(0, w, max(1, w // 60)):
            r, g, b, a = px[x, y]
            if a < 30:
                c[("transp",)] += 1
                continue
            mx, mn = max(r, g, b), min(r, g, b)
            sat = (mx - mn) / mx if mx else 0
            if sat < 0.18:
                c[("low-sat", r // 24 * 24, g // 24 * 24, b // 24 * 24)] += 1
    print("==", name, img.size)
    for k, n in c.most_common(6):
        print("   ", k, n)
