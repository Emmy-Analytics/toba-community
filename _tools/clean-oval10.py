"""DEFINITIVE oval removal via connected-component analysis.
'ovalish' pixel: present, neutral-to-green (g>=r-2, b>=r-6), pale (light>.55),
low saturation (<.28). Cream belly (r>g by ~17) never qualifies. Vivid skin,
orange bow, dark outlines never qualify.
Find connected components of ovalish pixels; the huge one is the oval.
Remove only that component (and any other component > 30k px)."""
from PIL import Image
from collections import deque

SRC = "assets/crocodile-head-trans.png"
img = Image.open(SRC).convert("RGBA")
px = img.load()
w, h = img.size
print("size", w, h)

def ovalish(x, y):
    r, g, b, a = px[x, y]
    if a < 8:
        return False
    mx = max(r, g, b); mn = min(r, g, b)
    sat = (mx - mn) / mx if mx else 0
    light = mx / 255
    return g >= r - 2 and b >= r - 6 and light > 0.55 and sat < 0.28

seen = bytearray(w * h)
comps = []  # (size, pixels_sample_check)
step = 2
for sy in range(0, h, step):
    for sx in range(0, w, step):
        if seen[sy * w + sx] or not ovalish(sx, sy):
            continue
        cid = len(comps)
        q = deque([(sx, sy)])
        seen[sy * w + sx] = 1
        size = 0
        minx = maxx = sx; miny = maxy = sy
        while q:
            x, y = q.popleft()
            size += 1
            if x < minx: minx = x
            if x > maxx: maxx = x
            if y < miny: miny = y
            if y > maxy: maxy = y
            for dx, dy in ((2,0),(-2,0),(0,2),(0,-2),(2,2),(-2,-2),(2,-2),(-2,2)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and ovalish(nx, ny):
                    seen[ny * w + nx] = 1
                    q.append((nx, ny))
        comps.append((size, minx, miny, maxx, maxy))

comps.sort(reverse=True)
out = open("_tools/comps.txt", "w")
for c in comps[:8]:
    out.write(f"size={c[0]*4} bbox=({c[1]},{c[2]})-({c[3]},{c[4]})\n")
out.close()

# remove the big components (the oval). Character pale bits are small/enclosed.
kill = [c for c in comps if c[0] * 4 > 30000]
print("killing", len(kill), "components:", [(c[0] * 4, c[1], c[2], c[3], c[4]) for c in kill])
killset = set()
for size, minx, miny, maxx, maxy in kill:
    # re-flood precisely inside this bbox to mark pixels
    q = deque()
    for x in range(max(0, minx - 4), min(w, maxx + 5), 1):
        for y in (max(0, miny - 4), min(h - 1, maxy + 4)):
            if ovalish(x, y):
                q.append((x, y))
    for y in range(max(0, miny - 4), min(h, maxy + 5), 1):
        for x in (max(0, minx - 4), min(w - 1, maxx + 4)):
            if ovalish(x, y):
                q.append((x, y))
    local = set()
    while q:
        x, y = q.popleft()
        if (x, y) in local:
            continue
        local.add((x, y))
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x + dx, y + dy
            if minx - 6 <= nx <= maxx + 6 and miny - 6 <= ny <= maxy + 6 and (nx, ny) not in local and ovalish(nx, ny):
                q.append((nx, ny))
    killset |= local

removed = 0
for (x, y) in killset:
    if px[x, y][3] != 0:
        px[x, y] = (255, 255, 255, 0)
        removed += 1
print("removed:", removed, f"({removed/(w*h)*100:.1f}%)")
img.save(SRC, optimize=True)

thumb = img.copy(); thumb.thumbnail((560, 560))
bg = Image.new("RGB", (640, 640), (247, 246, 240))
bg.paste(thumb, (40, 40), thumb)
bg.save("_tools/verify8.png")
print("verify8 written")
