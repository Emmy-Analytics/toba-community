$files = 'style.css','script.js','i18n.js','join-community.js','index.html'
foreach ($x in $files) {
  $c = [System.IO.File]::ReadAllText((Resolve-Path $x))
  $m = [regex]::Matches($c, '[\u2190-\u21FF\u2B00-\u2BFF\u2700-\u27BF\u2600-\u26FF\uFE0F]|[\uD83C-\uD83E][\uDC00-\uDFFF]')
  Write-Output ($x + ': ' + $m.Count)
  foreach ($mm in $m) {
    $i = $mm.Index
    $line = ($c.Substring(0, $i) -split "`n").Count
    $start = [Math]::Max(0, $i - 40)
    $len = [Math]::Min(90, $c.Length - $start)
    $ctx = $c.Substring($start, $len) -replace '\s+', ' '
    Write-Output ('  L' + $line + ': ' + $ctx)
  }
}
