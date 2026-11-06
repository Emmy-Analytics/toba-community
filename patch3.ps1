$files = 'tobaladies.html', 'tobadeli.html', 'events.html', 'gallery.html', 'merchandise.html', 'game.html', 'partnership.html'
$reps = @(
  @{ o = '<p class="mega-label" data-i18n="nav.g1">COMMUNITY</p>'; n = '<p class="mega-label" data-i18n="nav.g1">COMMUNITY</p><p class="mega-title" data-i18n="nav.g1.title">Meet the TOBA crew</p><p class="mega-sub" data-i18n="nav.g1.sub">Find your basketball circle.</p>' },
  @{ o = '<p class="mega-label" data-i18n="nav.g2">WHAT&#39;S ON</p>'; n = '<p class="mega-label" data-i18n="nav.g2">WHAT&#39;S ON</p><p class="mega-title" data-i18n="nav.g2.title">What&#39;s happening at TOBA?</p><p class="mega-sub" data-i18n="nav.g2.sub">Check the schedule, see the fun, or try the game.</p>' },
  @{ o = '<p class="mega-label" data-i18n="nav.g3">LIFESTYLE</p>'; n = '<p class="mega-label" data-i18n="nav.g3">LIFESTYLE</p><p class="mega-title" data-i18n="nav.g3.title">TOBA Merch</p><p class="mega-sub" data-i18n="nav.g3.sub">Wear your TOBA colors.</p>' },
  @{ o = '<p class="mega-label" data-i18n="nav.g4">CONNECT</p>'; n = '<p class="mega-label" data-i18n="nav.g4">CONNECT</p><p class="mega-title" data-i18n="nav.g4.title">Got an idea to build with TOBA?</p><p class="mega-sub" data-i18n="nav.g4.sub">Let&#39;s make something happen.</p>' }
)
foreach ($f in $files) {
  $p = Join-Path $PSScriptRoot $f
  $c = [System.IO.File]::ReadAllText($p)
  $changed = $false
  foreach ($r in $reps) {
    if ($c.Contains($r.o)) { $c = $c.Replace($r.o, $r.n); $changed = $true }
  }
  if ($changed) { [System.IO.File]::WriteAllText($p, $c); Write-Output "OK $f" } else { Write-Output "NONE $f" }
}
