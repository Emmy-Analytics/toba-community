$files = @('i18n.js')
foreach ($f in $files) {
  $raw = [System.IO.File]::ReadAllText((Resolve-Path $f), [System.Text.Encoding]::UTF8)
  $lines = $raw -split "`n"
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '[\u2192\u279C\u2794\u21D2\u2194\u27A1\u2796\u25B6\u25B8\u2265\u2023]') {
      Write-Output ("$f L" + ($i + 1) + ": " + $lines[$i])
    }
  }
}
