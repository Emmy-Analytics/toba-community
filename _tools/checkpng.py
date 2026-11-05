from PIL import Image
img = Image.open("assets/crocodile-head-trans.png")
img.thumbnail((500, 500))
# composite onto ivory to simulate the page
bg = Image.new("RGB", img.size, (247, 246, 240))
if img.mode == "RGBA":
    bg.paste(img, (0, 0), img)
else:
    bg.paste(img, (0, 0))
bg.save("_tools/checkpng-view.png")
print("ok", img.size)
