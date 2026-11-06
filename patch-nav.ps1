$old1 = '<nav class="main-nav" id="mainNav" aria-label="Navigasi utama"><button class="drawer-close" type="button" aria-label="Close">✕</button><div class="mega" id="megaMenu" hidden>'
$new1 = '<nav class="main-nav" id="mainNav" aria-label="Navigasi utama"><div class="drawer-head"><span class="drawer-brand"><span class="brand-mark"><img src="assets/crocodile-head.png" alt=""></span><span class="drawer-name">TOBA <small>COMMUNITY</small></span></span><button class="drawer-close" type="button" aria-label="Close">✕</button></div><div class="mega" id="megaMenu" hidden>'
$old2 = '</div></div></div></nav>'
$new2 = '</div></div></div><a class="drawer-cta" href="partnership.html" data-i18n="cta.join">Join Community</a></nav>'
$files = 'tobaladies.html', 'tobadeli.html', 'events.html', 'gallery.html', 'merchandise.html', 'game.html', 'partnership.html'
foreach ($f in $files) {
  $p = Join-Path $PSScriptRoot $f
  $c = Get-Content $p -Raw -Encoding UTF8
  if ($c.Contains($old1)) { $c = $c.Replace($old1, $new1) }
  if ($c.Contains($old2)) { $c = $c.Replace($old2, $new2) }
  Set-Content $p $c -Encoding UTF8 -NoNewline
  Write-Output "patched $f"
}
