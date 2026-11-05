"""FINAL oval scrub for crocodile-head-trans.png (restore pristine first).
Barrier = outline karakter saja: hijau sangat gelap / garis hitam pekat
(sat>=0.5 & mx<120), atau blok warna karakter vivid (sat>=0.55).
Rim oval (sage->cream, sat .22-.49) boleh ditembus flood."""
from PIL import Image
from collections import deque

SRC = "assets/crocodile-head-trans.png"
BAK = "assets/crocodile-head-trans.oval-backup.png"

img = Image.open(BAK).convert("RGBA")
px = img.load()
w, h = img.size
print("size", w, h)

def barrier(x, y):
    r, g, b, a = px[x, y]
    if a < 20:
        return False
    mx, mn = max(r, g, b), min(r, g, b)
    sat = (mx - mn) / mx if mx else 0
    # character outline: very dark green/black
    if mx < 120 and g >= r:
        return True
    # vivid character colors (skin greens s~.85, bow orange s~.88)
    if sat >= 0.55 and mx > 90:
        return True
    return False

def removable(x, y):
    r, g, b, a = px[x, y]
    if a < 20:
        return True
    mx = max(r, g, b)
    return mx >= 100

seen = bytearray(w * h)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if not seen[y * w + x] and not barrier(x, y):
            seen[y * w + x] = 1; q.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if not seen[y * w + x] and not barrier(x, y):
            seen[y * w + x] = 1; q.append((x, y))

removed = 0
while q:
    x, y = q.popleft()
    if not barrier(x, y) and px[x, y][3] != 0:
        px[x, y] = (255, 255, 255, 0)
        removed += 1
    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
            seen[ny * w + nx] = 1
            if not barrier(nx, ny):
                q.append((nx, ny))

print("removed:", removed, f"({removed/(w*h)*100:.1f}%)")
img.save(SRC, optimize=True)

thumb = img.copy(); thumb.thumbnail((560, 560))
bg = Image.new("RGB", (640, 640), (247, 246, 240))
bg.paste(thumb, (40, 40), thumb)
bg.save("_tools/verify6.png")
print("verify6 written")
