"""Remove the baked-in pale-sage oval from crocodile-head-trans.png.
Flood-fill from canvas edges through low-saturation pale pixels; the croc's
dark outline is a hard barrier, so the character (vivid green skin, orange
bow, cream belly, pink cheek) is untouched. Source is restored from backup
first so we operate on the pristine image."""
from PIL import Image
from collections import deque

SRC = "assets/crocodile-head-trans.png"
BAK = "assets/crocodile-head-trans.oval-backup.png"

img = Image.open(BAK).convert("RGBA")
px = img.load()
w, h = img.size
print("size", w, h)

def removable(x, y):
    r, g, b, a = px[x, y]
    if a < 25:
        return True                      # already transparent
    mx, mn = max(r, g, b), min(r, g, b)
    if mx < 110:                         # dark outline = barrier
        return False
    sat = (mx - mn) / mx if mx else 0
    light = mx / 255
    # pale sage oval: low saturation, bright, green >= red (not warm cream)
    return sat < 0.20 and light > 0.72 and g >= r - 6

seen = [[False] * w for _ in range(h)]
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if removable(x, y) and not seen[y][x]:
            seen[y][x] = True; q.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if removable(x, y) and not seen[y][x]:
            seen[y][x] = True; q.append((x, y))

removed = 0
while q:
    x, y = q.popleft()
    if px[x, y][3] != 0:
        px[x, y] = (255, 255, 255, 0)
        removed += 1
    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx]:
            seen[ny][nx] = True
            if removable(nx, ny):
                q.append((nx, ny))

print("removed:", removed, f"({removed/(w*h)*100:.1f}%)")
img.save(SRC, optimize=True)
print("saved", SRC)
