"""FINAL: flood-fill from canvas edges, barrier = croc's own ink only.
Removable/passable: transparent, or mx>90 and sat<0.55 (sage rim s~.48,
cream belly-adjacent s~.27 all pass). Barriers: skin green s~.85, bow
s~.88, dark outline mx<90, pink cheek s~.6. The croc is fully enclosed
by its dark outline, so its interior (belly cream) is unreachable."""
from PIL import Image
from collections import deque

SRC = "assets/crocodile-head-trans.png"
BAK = "assets/crocodile-head-trans.oval-backup.png"

img = Image.open(BAK).convert("RGBA")   # pristine original
px = img.load()
w, h = img.size
print("size", w, h)

def passable(x, y):
    r, g, b, a = px[x, y]
    if a < 20:
        return True
    mx, mn = max(r, g, b), min(r, g, b)
    if mx < 90:                       # dark outline ink: barrier
        return False
    sat = (mx - mn) / mx if mx else 0
    if sat >= 0.55:                   # vivid character color: barrier
        return False
    return True

seen = bytearray(w * h)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if not seen[y * w + x] and passable(x, y):
            seen[y * w + x] = 1; q.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if not seen[y * w + x] and passable(x, y):
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
            if passable(nx, ny):
                q.append((nx, ny))

print("removed:", removed, f"({removed/(w*h)*100:.1f}%)")
img.save(SRC, optimize=True)

thumb = img.copy(); thumb.thumbnail((520, 520))
bg = Image.new("RGB", (600, 600), (247, 246, 240))
bg.paste(thumb, (40, 40), thumb)
bg.save("_tools/verify9.png")
print("verify9 written")
