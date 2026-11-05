"""Final oval scrub: flood-fill from canvas edges.
Removable = transparent OR pale (light>.55, sat<.34) INCLUDING warm cream.
Hard barriers = dark outline (mx<140) and vivid color (sat>=.35).
The croc's dark outline encloses the cream belly, so the flood can never
reach it; the oval fades softly to transparent at its rim, so the flood
eats the whole ellipse from outside."""
from PIL import Image
from collections import deque

SRC = "assets/crocodile-head-trans.png"
img = Image.open(SRC).convert("RGBA")
px = img.load()
w, h = img.size
print("size", w, h)

def removable(x, y):
    r, g, b, a = px[x, y]
    if a < 20:
        return True
    mx, mn = max(r, g, b), min(r, g, b)
    if mx < 140:      # dark outline: barrier
        return False
    sat = (mx - mn) / mx if mx else 0
    if sat >= 0.35:   # vivid character color: barrier
        return False
    return mx / 255 > 0.55

seen = bytearray(w * h)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if removable(x, y) and not seen[y * w + x]:
            seen[y * w + x] = 1; q.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if removable(x, y) and not seen[y * w + x]:
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
bg.save("_tools/verify3.png")
print("verify3 written")
