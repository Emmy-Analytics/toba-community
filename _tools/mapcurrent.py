from PIL import Image
img = Image.open("assets/crocodile-head-trans.png").convert("RGBA")
px = img.load()
w, h = img.size
print("size", w, h)
for fy in range(0, 20):
    row = ""
    for fx in range(0, 60):
        x, y = int(w * fx / 60), int(h * fy / 20)
        r, g, b, a = px[x, y]
        if a < 30:
            row += "."
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / mx if mx else 0
        if sat < 0.18:
            row += "o"
        elif g >= r:
            row += "G"
        else:
            row += "W"
    print(f"{fy:02d}", row)
# sample the oval color directly
for (fx, fy) in [(0.2, 0.3), (0.3, 0.15), (0.85, 0.2), (0.15, 0.8), (0.5, 0.92)]:
    x, y = int(w * fx), int(h * fy)
    print((fx, fy), px[x, y])
