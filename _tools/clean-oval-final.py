"""Definitive oval removal from crocodile-head-trans.png.
Flood-fill from every canvas edge through pale/low-saturation pixels.
Barriers: dark outline (brightness<0.55) and saturated pixels (sat>=0.32).
Warm pixels (r>g+8, cream belly) are never removed. Loop-safe on soft edges."""
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
    if mx < 140:            # dark outline / hard line: barrier
        return False
    sat = (mx - mn) / mx if mx else 0
    if sat >= 0.32:         # vivid character color: barrier
        return False
    if r > g + 8:           # warm cream (belly): never remove
        return False
    light = mx / 255
    return light > 0.55     # pale sage / near-white background tones

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
# verification render: asset alone on ivory
chk = Image.new("RGBA", (900, 900), (247, 246, 240, 255))
thumb = img.copy(); thumb.thumbnail((760, 760))
chk.alpha_composite(thumb, ((900 - thumb.width)//2, (900 - thumb.height)//2))
chk.convert("RGB").save("_tools/verify-oval.png")
print("saved verify render")
