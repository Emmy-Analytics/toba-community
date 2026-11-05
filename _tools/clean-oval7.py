"""Aggressive but safe oval scrub. Restore pristine backup, then flood-fill
from all canvas edges. Removable = transparent OR pale (mx>=100, sat<0.40).
Barriers = dark outline (mx<100) and vivid color (sat>=0.40). The croc's
thick dark outline fully encloses it, so the interior is unreachable."""
from PIL import Image
from collections import deque

SRC = "assets/crocodile-head-trans.png"
BAK = "assets/crocodile-head-trans.oval-backup.png"

img = Image.open(BAK).convert("RGBA")   # start from pristine original
px = img.load()
w, h = img.size
print("size", w, h)

def removable(x, y):
    r, g, b, a = px[x, y]
    if a < 20:
        return True
    mx, mn = max(r, g, b), min(r, g, b)
    if mx < 100:      # dark outline: barrier
        return False
    sat = (mx - mn) / mx if mx else 0
    if sat >= 0.40:   # vivid character color: barrier
        return False
    return True

seen = bytearray(w * h)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if not seen[y * w + x] and removable(x, y):
            seen[y * w + x] = 1; q.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if not seen[y * w + x] and removable(x, y):
            seen[y * w + x] = 1; q.append((x, y))

removed = 0
while q:
    x, y = q.popleft()
    if px[x, y][3] != 0:
        px[x, y] = (255, 255, 255, 0)
        removed += 1
    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
            seen[ny * w + nx] = 1
            if removable(nx, ny):
                q.append((nx, ny))

print("removed:", removed, f"({removed/(w*h)*100:.1f}%)")
img.save(SRC, optimize=True)

thumb = img.copy(); thumb.thumbnail((560, 560))
bg = Image.new("RGB", (640, 640), (247, 246, 240))
bg.paste(thumb, (40, 40), thumb)
bg.save("_tools/verify5.png")
print("verify5 written")
