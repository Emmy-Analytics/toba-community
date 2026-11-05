from PIL import Image
img = Image.open("assets/crocodile-head-trans.png").convert("RGBA")
# crop left half (outside the croc, where the oval edge should be if baked in)
img.crop((0, 600, 700, 1400)).save("_tools/crop-left.png")
img.crop((1300, 600, 2000, 1400)).save("_tools/crop-right.png")
# also crop top area
img.crop((400, 0, 1600, 500)).save("_tools/crop-top.png")
print("crops saved")
