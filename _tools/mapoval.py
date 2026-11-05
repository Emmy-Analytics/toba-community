from PIL import Image
img = Image.open("assets/crocodile-head-trans.oval-backup.png").convert("RGBA")
px = img.load()
w, h = img.size
print("size", w, h)
# coarse map: for each cell, average of opaque pixels
for fy in range(0, 20):
    row = ""
    for fx in range(0, 40):
        x, y = int(w * fx / 40), int(h * fy / 20)
        r, g, b, a = px[x, y]
        if a < 30:
            row += "."
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / mx if mx else 0
        if sat < 0.15:
            row += "o"   # low-sat (oval candidate)
        elif g >= r:
            row += "G"   # green-ish
        else:
            row += "W"   # warm (orange/cream)
    print(row)
