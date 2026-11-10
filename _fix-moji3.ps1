# Final mojibake repair: any non-ASCII run that CONTAINS exactly one real
# glyph (© — – ’ ‘ “ ” · …) collapses to that glyph. Everything else is left.
$files = @('tobadeli.html', 'tobaladies.html', 'events.html', 'gallery.html', 'merchandise.html', 'game.html')
$glyphs = @{ [char]0xA9 = '©'; [char]0x2014 = '—'; [char]0x2013 = '–'; [char]0x2019 = '’'; [char]0x2018='‘'; [char]0x201C = '“'; [char]0x201D = '”'; [char]0xB7 = '·'; [char]0x2026 = '…' }
foreach ($f in $files) {
  $text = [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)
  $orig = $text
  $text = [regex]::Replace($text, '[\u0080-\u00FF]{2,}', {
      param($m)
      $s = $m.Value
      $hits = @()
      foreach ($k in $glyphs.Keys) { if ($s.IndexOf($k) -ge 0) { $hits += [string]$glyphs[$k] } }
      if ($hits.Count -eq 1) { return $hits[0] }
      return $s
    })
  if ($text -ne $orig) {
    [IO.File]::WriteAllText($f, $text, (New-Object Text.UTF8Encoding $false))
    Write-Output "$f FIXED"
  }
  else { Write-Output "$f clean" }
}
