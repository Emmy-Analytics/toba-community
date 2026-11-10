# Fix mojibake (UTF-8 double-encoded) in title/description meta tags.
# Strategy: read raw bytes, decode as UTF-8 (replacement chars kept for already-corrupted runs),
# repair known mojibake sequences byte-wise instead of relying on console literals.
$files = @('events.html', 'gallery.html', 'merchandise.html', 'game.html', 'tobaladies.html', 'tobadeli.html')
foreach ($f in $files) {
  $bytes = [IO.File]::ReadAllBytes($f)
  $sb = New-Object System.Text.StringBuilder
  $i = 0
  while ($i -lt $bytes.Length) {
    $b = $bytes[$i]
    # Detect the classic mojibake prefix for em/en dash: C3 A2 C2 80 C2 94 (—) / C2 93 (") / C2 9C (") / C2 9C etc
    if ($b -eq 0xC3 -and $i + 5 -lt $bytes.Length -and $bytes[$i + 1] -eq 0xC2 -and $bytes[$i + 2] -eq 0xE2 -and $bytes[$i + 3] -eq 0x80) {
      $tail = $bytes[$i + 4]
      if ($tail -eq 0x94) { [void]$sb.Append([char]0x2014); $i += 6; continue } # —
      if ($tail -eq 0x93 -or $tail -eq 0x9C) { [void]$sb.Append('"'); $i += 6; continue } # “ ”
      if ($tail -eq 0x93) { [void]$sb.Append('-'); $i += 6; continue }
      [void]$sb.Append('-'); $i += 6; continue
    }
    # C3 A2 C2 80 C2 93 = –
    if ($b -eq 0xC3 -and $i + 5 -lt $bytes.Length -and $bytes[$i + 1] -eq 0xC2 -and $bytes[$i + 2] -eq 0xE2 -and $bytes[$i + 3] -eq 0x80 -and $bytes[$i + 4] -eq 0x93) {
      [void]$sb.Append([char]0x2013); $i += 6; continue
    }
    # C3 A2 C2 80 C2 A6 = …
    if ($b -eq 0xC3 -and $i + 5 -lt $bytes.Length -and $bytes[$i + 1] -eq 0xC2 -and $bytes[$i + 2] -eq 0xE2 -and $bytes[$i + 3] -eq 0x80 -and $bytes[$i + 4] -eq 0xA6) {
      [void]$sb.Append([char]0x2026); $i += 6; continue
    }
    # C3 82 C2 A9 = © ; C3 82 C2 B7 = ·
    if ($b -eq 0xC3 -and $i + 3 -lt $bytes.Length -and $bytes[$i + 1] -eq 0x82 -and $bytes[$i + 2] -eq 0xC2 -and $bytes[$i + 3] -eq 0xA9) { [void]$sb.Append([char]0xA9); $i += 4; continue }
    if ($b -eq 0xC3 -and $i + 3 -lt $bytes.Length -and $bytes[$i + 1] -eq 0x82 -and $bytes[$i + 2] -eq 0xC2 -and $bytes[$i + 3] -eq 0xB7) { [void]$sb.Append([char]0xB7); $i += 4; continue }
    # lone C3 82 C2 xx sequences — decode as the original Latin-1 char
    if ($b -eq 0xC3 -and $i + 3 -lt $bytes.Length -and $bytes[$i + 1] -eq 0x82 -and $bytes[$i + 2] -eq 0xC2) {
      [void]$sb.Append([char]$bytes[$i + 3]); $i += 4; continue
    }
    # lone "Â" mojibake (C3 82 followed by plain ASCII)
    if ($b -eq 0xC3 -and $i + 1 -lt $bytes.Length -and $bytes[$i + 1] -eq 0x82) {
      [void]$sb.Append([char]0xC2); $i += 2; continue
    }
    [void]$sb.Append([char]$b) # raw byte passthrough for valid utf-8 will corrupt; instead decode below
    $i++
  }
  # Simpler robust route: try byte-level regex replacements on the decoded-then-recoded string
  $text = [Text.Encoding]::GetEncoding('ISO-8859-1').GetString($bytes)
  $text = $text.Replace([Text.Encoding]::GetEncoding('ISO-8859-1').GetString([Text.Encoding]::UTF8.GetBytes([Text.Encoding]::GetEncoding('ISO-8859-1').GetString([Text.Encoding]::UTF8.GetBytes([char]0x2014)))), [string][char]0x2014)
  [IO.File]::WriteAllText($f, $text, (New-Object System.Text.UTF8Encoding $false))
}
