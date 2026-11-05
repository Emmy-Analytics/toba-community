from PIL import Image
img = Image.open("assets/crocodile-head-trans.oval-backup.png").convert("RGBA")
px = img.load()
w, h = img.size
# sample grid over whole image: report dominant non-transparent colors outside center
from collections import Counter
c = Counter()
for y in range(0, h, 25):
    for x in range(0, w, 25):
        r, g, b, a = px[x, y]
        if a < 10:
            c[('transparent',)] += 1
            continue
        c[(r // 16 * 16, g // 16 * 16, b // 16 * 16)] += 1
for col, n in c.most_common(18):
    print(col, n)
