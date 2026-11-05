"""Make crocodile-head.png transparent: flood-fill the flat oval background
from the canvas edges. Stops at the croc's dark outline / saturated pixels.
The character itself (green skin, orange bow, cream belly) is untouched.
Backup first."""
from PIL import Image
from collections import deque

SRC = "assets/crocodile-head.png"
BAK = "assets/crocodile-head.oval-backup.png"

shutil_backup = Image.open(SRC)
shutil_backup.save(BAK)

img = Image.open(SRC).convert("RGBA")
px = img.load()
w, h = img.size

def flat(x, y):
    r, g, b, a = px[x, y]
    mx, mn = max(r, g, b), min(r, g, b)
    sat = (mx - mn) / mx if mx else 0
    return sat < 0.16 and mx > 150   # flat light background (white oval / halo)

seen = [[False] * w for _ in range(h)]
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if flat(x, y) and not seen[y][x]:
            seen[y][x] = True; q.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if flat(x, y) and not seen[y][x]:
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
            if flat(nx, ny):
                q.append((nx, ny))

print("removed:", removed, f"({removed/(w*h)*100:.1f}%)")
img.save(SRC, optimize=True)
print("saved", SRC)
