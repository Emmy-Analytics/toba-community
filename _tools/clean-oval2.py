"""Remove the baked-in warm-cream oval from crocodile-head-trans.png.
Flood-fills the cream ellipse from its outer edge; the crocodile's dark
outline blocks the flood, so the character's cream belly is untouched."""
from PIL import Image
from collections import deque

SRC = "assets/crocodile-head-trans.png"
BAK = "assets/crocodile-head-trans.oval-backup.png"

img = Image.open(BAK).convert("RGBA")
px = img.load()
w, h = img.size

def creamish(x, y):
    r, g, b, a = px[x, y]
    if a < 40:
        return False
    return (r > 165 and g > 145 and b > 105 and r >= g >= b
            and (r - b) > 22 and not (g > r))  # warm cream, not green

def is_outline(x, y):
    r, g, b, a = px[x, y]
    return a > 40 and (max(r, g, b) < 110 or (g > r and g - b > 40))

seen = [[False] * w for _ in range(h)]
q = deque()
# seeds: cream pixels in outer bands (oval rim reaches near the canvas edges)
band = int(h * 0.06)
for x in range(0, w, 3):
    for y in list(range(0, band)) + list(range(h - band, h)):
        if creamish(x, y) and not seen[y][x]:
            seen[y][x] = True; q.append((x, y))
for y in range(0, h, 3):
    for x in list(range(0, band)) + list(range(w - band, w)):
        if creamish(x, y) and not seen[y][x]:
            seen[y][x] = True; q.append((x, y))

removed = 0
while q:
    x, y = q.popleft()
    px[x, y] = (255, 255, 255, 0)
    removed += 1
    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx]:
            seen[ny][nx] = True
            if creamish(nx, ny) and not is_outline(nx, ny):
                q.append((nx, ny))

print("removed:", removed, f"({removed/(w*h)*100:.1f}%)")
img.save(SRC, optimize=True)
print("saved", SRC)
