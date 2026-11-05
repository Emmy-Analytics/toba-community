from PIL import Image
img = Image.open("assets/crocodile-head-trans.png").convert("RGBA")
px = img.load()
w, h = img.size
out = open("_tools/rim.txt", "w")
# horizontal transect through the oval at several heights, left edge region
for y in (900, 1100, 1300, 1500):
    out.write(f"--- y={y} x=0..900 step 20 ---\n")
    for x in range(0, 900, 20):
        r, g, b, a = px[x, y]
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / mx if mx else 0
        out.write(f"x{x}:({r},{g},{b},a{a},s{sat:.2f}) ")
    out.write("\n")
out.close()
print("done")
