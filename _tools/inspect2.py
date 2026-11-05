from PIL import Image
img = Image.open("assets/crocodile-head-trans.oval-backup.png").convert("RGBA")
px = img.load()
w, h = img.size
print("size", w, h)
for frac_y in (0.25, 0.35, 0.5, 0.65, 0.75):
    row = []
    for frac_x in (0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9):
        x, y = int(w * frac_x), int(h * frac_y)
        r, g, b, a = px[x, y]
        row.append(f"{frac_x:.2f}:({r},{g},{b},{a})")
    print(f"y={frac_y}", " ".join(row))
