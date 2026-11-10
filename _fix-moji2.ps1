# Aggressive mojibake repair: for every run of chars >= U+0080, repeatedly try
# ISO-8859-1 re-encode -> UTF-8 decode while the result keeps improving
# (fewer 'Ã', 'Â' artifacts). Prefer the shortest sensible decode.
$files = @('tobadeli.html', 'tobaladies.html', 'events.html', 'gallery.html', 'merchandise.html', 'partnership.html', 'game.html')
$latin = [Text.Encoding]::GetEncoding('ISO-8859-1')
foreach ($f in $files) {
  $text = [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)
  $orig = $text
  $text = [regex]::Replace($text, '[\u0080-\u00FF][\u0080-\u00FF]+', {
      param($m)
      $s = $m.Value
      $best = $s
      # chain-decode up to 3 levels
      for ($i = 0; $i -lt 3; $i++) {
        $bytes = $latin.GetBytes($best)
        # require a plausible UTF-8 lead byte pattern before decoding
        if ($bytes[0] -ne 0xC2 -and $bytes[0] -ne 0xC3 -and $bytes[0] -ne 0xE2) { break }
        try { $next = [Text.Encoding]::UTF8.GetString($bytes) } catch { break }
        if ($next.Contains([char]0xFFFD)) { break }
        # stop when no more mojibake indicator chars remain
        $best = $next
        if (-not ($best -match '[\u00C2\u00C3\u00E2]')) { break }
      }
      return $best
    })
  if ($text -ne $orig) {
    [IO.File]::WriteAllText($f, $text, (New-Object Text.UTF8Encoding $false))
    Write-Output "$f FIXED"
  }
  else { Write-Output "$f clean" }
}
