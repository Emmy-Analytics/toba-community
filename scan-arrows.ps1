$pattern = '[\u2190-\u21FF\u2B00-\u2BFF\u2600-\u27BF\uFE0F]|[\uD83C\uD83D\uD83E][\uDC00-\uDFFF]'
foreach ($f in @('script.js', 'i18n.js')) {
  $raw = [System.IO.File]::ReadAllText((Resolve-Path $f), [System.Text.Encoding]::UTF8)
  $ms = [regex]::Matches($raw, $pattern)
  Write-Output "=== $f : $($ms.Count) matches ==="
  foreach ($m in $ms) {
    $start = [Math]::Max(0, $m.Index - 40)
    $len = [Math]::Min(80, $raw.Length - $start)
    $ctx = $raw.Substring($start, $len) -replace '\s+', ' '
    Write-Output ("idx {0} U+{1:X4} ... {2} ..." -f $m.Index, [int][char]$m.Value, $ctx)
  }
}
