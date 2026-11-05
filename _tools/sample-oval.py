from PIL import Image
img = Image.open("assets/crocodile-head-trans.png").convert("RGBA")
px = img.load()
w, h = img.size
# dense sampling in the crop-left region where the oval edge was visible
from collections import Counter
c = Counter()
for y in range(600, 1400, 8):
    for x in range(0, 700, 8):
        r, g, b, a = px[x, y]
        c[(r // 12 * 12, g // 12 * 12, b // 12 * 12, a // 60 * 60)] += 1
for k, n in c.most_common(20):
    print(k, n)
