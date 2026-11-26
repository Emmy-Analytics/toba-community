Add-Type -AssemblyName System.Drawing
$src = 'desktop-hero2.png'
$dst = 'desktop-hero2-crop.png'
$img = [System.Drawing.Image]::FromFile($src)
$h = [int]($img.Height * 0.55)
$rect = New-Object System.Drawing.Rectangle(0, $h, $img.Width, ($img.Height - $h))
$crop = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
$g = [System.Drawing.Graphics]::FromImage($crop)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $rect.Width, $rect.Height)
$g.DrawImage($img, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$crop.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
$g.Dispose()
$crop.Dispose()
Write-Output "done $dst"
