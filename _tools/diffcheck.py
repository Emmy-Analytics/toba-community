from PIL import Image, ImageChops, ImageFilter

# Compare pristine backup vs current file to know what my earlier passes did
cur = Image.open("assets/crocodile-head-trans.png").convert("RGBA")
bak = Image.open("assets/crocodile-head-trans.oval-backup.png").convert("RGBA")
print("sizes", cur.size, bak.size)

# diff alpha maps
ca, ba = cur.split()[3], bak.split()[3]
diff = ImageChops.difference(ca, ba)
bbox = diff.getbbox()
print("alpha-diff bbox:", bbox)

# Downscale both onto ivory for eyeball comparison
def comp(im, name):
    t = im.copy(); t.thumbnail((420, 420))
    bg = Image.new("RGB", (460, 460), (247, 246, 240))
    bg.paste(t, (20, 20), t)
    bg.save(name)
comp(cur, "_tools/cmp-current.png")
comp(bak, "_tools/cmp-backup.png")
print("comparisons written")
