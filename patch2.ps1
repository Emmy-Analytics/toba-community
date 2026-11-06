$files = 'tobaladies.html', 'tobadeli.html', 'events.html', 'gallery.html', 'merchandise.html', 'game.html', 'partnership.html'
$old = '<nav class="main-nav" id="mainNav" aria-label="Navigasi utama"><button class="drawer-close" type="button" aria-label="Close">'
$new = '<nav class="main-nav" id="mainNav" aria-label="Navigasi utama"><div class="drawer-head"><span class="drawer-brand"><span class="brand-mark"><img src="assets/crocodile-head.png" alt=""></span><span class="drawer-name">TOBA <small>COMMUNITY</small></span></span><button class="drawer-close" type="button" aria-label="Close">'
foreach ($f in $files) {
  $p = Join-Path $PSScriptRoot $f
  $c = [System.IO.File]::ReadAllText($p)
  if ($c.Contains($old)) { $c = $c.Replace($old, $new); [System.IO.File]::WriteAllText($p, $c); Write-Output "OK $f" } else { Write-Output "SKIP $f" }
}
