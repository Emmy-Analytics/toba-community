# Repair double-encoded UTF-8 (mojibake) sequences in the static HTML shells.
# Common chains: Ã¢â¬Â¦, Ã¢â¬â, ÃƒÂ¢â¬" etc. Rebuild via recursive single-byte decode.
$files = @('tobadeli.html', 'tobaladies.html', 'events.html', 'gallery.html', 'merchandise.html', 'partnership.html', 'game.html', 'index.html')
foreach ($f in $files) {
  $text = [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)
  $orig = $text
  # decode any run of chars in U+0080..U+00FF that forms a valid UTF-8 byte sequence
  $text = [regex]::Replace($text, '[\u00C2-\u00C3][\u0080-\u00BF]+(\u00E2\u0080[\u0093\u0094\u00A6])?', {
      param($m)
      $bytes = [Text.Encoding]::GetEncoding('ISO-8859-1').GetBytes($m.Value)
      try {
        $decoded = [Text.Encoding]::UTF8.GetString($bytes)
        # if decode produced replacement chars, keep original
        if ($decoded.Contains([char]0xFFFD)) { return $m.Value }
        return $decoded
      }
      catch { return $m.Value }
    })
  if ($text -ne $orig) {
    [IO.File]::WriteAllText($f, $text, (New-Object Text.UTF8Encoding $false))
    Write-Output "$f FIXED"
  }
  else {
    Write-Output "$f clean"
  }
}
