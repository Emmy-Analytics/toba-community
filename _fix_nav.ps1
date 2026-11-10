# TOBA nav repair: rebuild drawer markup in every page so each page's
# mega markup matches the canonical index.html version + add drawer-footer.
$ErrorActionPreference = 'Stop'
Set-Location "c:\Users\hopec\Documents\EMMY BDA\BASKET\WEBSITE"

$canonical = Get-Content index.html -Raw
$m = [regex]::Match($canonical, '<div class="mega" id="megaMenu".*?</div><a class="drawer-cta"[^<]*</a></nav>')
if (-not $m.Success) { throw 'canonical mega block not found in index.html' }
$megaBlock = $m.Value

$newDrawerHead = '<div class="drawer-head"><span class="drawer-brand"><span class="brand-mark"><img src="assets/crocodile-head.png" alt=""></span><span class="drawer-name">TOBA <small>COMMUNITY</small></span></span><button class="drawer-close" type="button" aria-label="Close">&#10005;</button></div>'

$drawerIntro = '<div class="drawer-intro"><p class="drawer-intro-title" data-i18n="drawer.intro.title">TOBA itu Tongkrongan Basket.</p><p class="drawer-intro-sub" data-i18n="drawer.intro.sub">Tempat ketemu teman, latihan, dan main basket bareng.</p></div>'

$newDrawerFooter = '</div><div class="drawer-footer"><a class="drawer-cta" href="partnership.html" data-i18n="cta.join">Join Community</a></div></nav>'

$pages = Get-ChildItem *.html | Where-Object { $_.Name -ne 'index.html' }
foreach ($f in $pages) {
    $c = Get-Content $f.FullName -Raw
    # 1. replace drawer-head + everything up to </nav> with head + intro + canonical mega + footer
    $rx = [regex]'(<button class="nav-explore"[^>]*>Explore</button>)<nav class="main-nav"[^>]*>.*?</nav>'
    if (-not $rx.IsMatch($c)) { Write-Output "$($f.Name): NAV BLOCK NOT FOUND"; continue }
    $replacement = '$1<nav class="main-nav" id="mainNav" aria-label="Navigasi utama">' + $newDrawerHead + $drawerIntro + $megaBlock + $newDrawerFooter
    $c = $rx.Replace($c, $replacement, 1)
    Set-Content $f.FullName $c -NoNewline -Encoding UTF8
    Write-Output "$($f.Name): rewritten"
}
