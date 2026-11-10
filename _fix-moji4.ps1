# Strip UTF-8 BOM and collapse any residual U+00C2/U+00A9 artifacts to plain ©.
$files = @('tobadeli.html', 'tobaladies.html', 'events.html', 'gallery.html', 'merchandise.html', 'game.html', 'partnership.html')
foreach ($f in $files) {
  $t = [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)
  $orig = $t
  $t = $t.Replace([string][char]0xFEFF, '')                       # BOM
  $t = [regex]::Replace($t, '[\u00C2\u00C3](?=[\u00A9\u2013\u2014\u2019\u201C\u201D\u00B7\u2026])', '')  # stray C2/C3 directly before a glyph
  if ($t -ne $orig) {
    [IO.File]::WriteAllText($f, $t, (New-Object Text.UTF8Encoding $false))
    Write-Output "$f cleaned"
  }
  else { Write-Output "$f ok" }
}
