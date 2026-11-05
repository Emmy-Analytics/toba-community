"""Seed-based oval scrub: seed from EVERY pale pixel (no edge needed),
then flood only within pale regions. Barriers keep the croc intact.
After the flood, pale pixels NOT connected to the main character region
are removed. Simpler robust variant: remove all pale pixels whose local
neighborhood (15px) is mostly pale — the oval is a large flat region,
the character is detailed with dark outlines everywhere."""
from PIL import Image
from collections import deque

SRC = "assets/crocodile-head-trans.png"
img = Image.open(SRC).convert("RGBA")
px = img.load()
w, h = img.size
print("size", w, h)

def pale(x, y):
    r, g, b, a = px[x, y]
    if a < 20:
        return False
    mx, mn = max(r, g, b), min(r, g, b)
    sat = (mx - mn) / mx if mx else 0
    return mx >= 140 and sat < 0.35 and mx / 255 > 0.55

# label connected pale regions
label = [[0] * w for _ in range(h)]
regions = {}
next_id = 1
for sy in range(0, h, 4):
    for sx in range(0, w, 4):
        if pale(sx, sy) and label[sy][sx] == 0:
            q = deque([(sx, sy)])
            label[sy][sx] = next_id
            size = 0
            xs = ys = 0
            while q:
                x, y = q.popleft()
                size += 1; xs += x; ys += y
                for dx, dy in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(-1,-1),(1,-1),(-1,1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and not label[ny][nx] and pale(nx, ny):
                        label[ny][nx] = next_id
                        q.append((nx, ny))
            regions[next_id] = (size, xs / size, ys / size)
            next_id += 1

# big pale regions = the oval (the character's pale parts are small/enclosed)
out = open("_tools/regions.txt", "w")
for rid, (size, cx, cy) in sorted(regions.items(), key=lambda kv: -kv[1][0])[:10]:
    out.write(f"region {rid}: size={size} center=({int(cx)},{int(cy)})\n")
out.close()

# remove the largest pale regions (oval is by far the biggest)
big = [rid for rid, (size, cx, cy) in regions.items() if size > 5000 and cy > h * 0.15]
removed = 0
for y in range(h):
    for x in range(w):
        rid = label[y][x]
        if rid in big and px[x, y][3] != 0:
            px[x, y] = (255, 255, 255, 0)
            removed += 1
print("removed:", removed, f"({removed/(w*h)*100:.1f}%)")
img.save(SRC, optimize=True)

thumb = img.copy(); thumb.thumbnail((560, 560))
bg = Image.new("RGB", (640, 640), (247, 246, 240))
bg.paste(thumb, (40, 40), thumb)
bg.save("_tools/verify4.png")
print("verify4 written")
