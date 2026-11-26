$raw = [System.IO.File]::ReadAllText((Resolve-Path 'i18n.js'), [System.Text.Encoding]::UTF8)
$lines = $raw -split "`n"
$cur = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
  $cur += $lines[$i].Length + 1
  if ($cur -gt 71102) {
    for ($j = [Math]::Max(0, $i - 2); $j -le [Math]::Min($lines.Count - 1, $i + 2); $j++) {
      Write-Output ("L" + ($j + 1) + ": " + $lines[$j])
    }
    break
  }
}
