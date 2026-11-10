# Remove stale duplicate drawer-cta + double </nav> left from a previous patch.
$ErrorActionPreference = 'Stop'
Set-Location "c:\Users\hopec\Documents\EMMY BDA\BASKET\WEBSITE"
$pages = Get-ChildItem *.html | Where-Object { $_.Name -ne 'index.html' }
foreach ($f in $pages) {
    $c = Get-Content $f.FullName -Raw
    $rx = [regex]'</div><a class="drawer-cta" href="partnership.html" data-i18n="cta\.join">Join Community</a></nav></div><div class="drawer-footer">'
    $count = $rx.Matches($c).Count
    if ($count -gt 0) {
        $c = $rx.Replace($c, '</div><div class="drawer-footer">', 1)
        Set-Content $f.FullName $c -NoNewline -Encoding UTF8
        Write-Output "$($f.Name): removed $count stale drawer-cta"
    } else {
        Write-Output "$($f.Name): clean"
    }
}
