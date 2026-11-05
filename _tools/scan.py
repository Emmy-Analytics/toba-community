from PIL import Image
img = Image.open("assets/crocodile-head-trans.png").convert("RGBA")
px = img.load()
w, h = img.size
print("size", w, h)
# scan a horizontal line through the oval (y=1000, left side)
for y in (700, 850, 1000, 1150, 1300):
    out = []
    for x in range(0, 800, 80):
        r, g, b, a = px[x, y]
        out.append(f"x{x}:({r},{g},{b},{a})")
    print("y", y, " ".join(out))
# vertical line at x=400
for x in (200, 400, 600):
    out = []
    for y in range(400, 1700, 150):
        r, g, b, a = px[x, y]
        out.append(f"y{y}:({r},{g},{b},{a})")
    print("x", x, " ".join(out))
