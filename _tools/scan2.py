import sys
from PIL import Image
img = Image.open("assets/crocodile-head-trans.png").convert("RGBA")
px = img.load()
w, h = img.size
out = open("_tools/scan-result.txt", "w")
out.write(f"size {w} {h}\n")
# dense scan across the whole image: report every distinct pale band
for y in range(100, 2000, 150):
    row = []
    for x in range(50, 2000, 120):
        r, g, b, a = px[x, y]
        row.append(f"({r},{g},{b},{a})")
    out.write(f"y={y}: " + " ".join(row) + "\n")
out.close()
print("written")
