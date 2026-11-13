$ErrorActionPreference = 'Stop'
$ig1 = '<svg class="fs-icon ig-brand" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.4" fill="currentColor"/><rect x="5.4" y="5.4" width="13.2" height="13.2" rx="3.6" fill="none" stroke="var(--bg-warm, #EDE9DE)" stroke-width="1.6"/><circle cx="12" cy="12" r="3.1" fill="none" stroke="var(--bg-warm, #EDE9DE)" stroke-width="1.6"/><circle cx="16" cy="8" r=".9" fill="var(--bg-warm, #EDE9DE)"/></svg>'
$waSvg = '<svg class="fs-icon wa-brand" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.1 4c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.8c-.2-.5-.4-.6-.4h-.5Z"/></svg>'
$waLink = '<a class="footer-slink footer-wa" href="https://wa.me/6281285704946" target="_blank" rel="noopener noreferrer" data-i18n="footer.wa.toba" aria-label="WhatsApp TOBA Community">' + $waSvg + 'WhatsApp TOBA Community</a>'
$files = 'index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html'
foreach ($f in $files) {
  $raw = [System.IO.File]::ReadAllText((Resolve-Path $f), [System.Text.Encoding]::UTF8)
  if ($raw -match 'footer-connect') {
    # inject WhatsApp link after the Tobadeli link (last footer-slink inside footer-social)
    $raw = $raw -replace '(<a class="footer-slink footer-ig" href="https://www\.instagram\.com/tobadeli\.basketball/"[^>]*>.*?Tobadeli</a>)', ('$1' + $waLink)
    Write-Output "$f : updated existing block"
  }
  else {
    # insert the whole CONNECT block before </div> closing footer-main (before footer-bottom)
    $block = '<div class="footer-connect"><b data-i18n="footer.connect">CONNECT WITH TOBA</b>' +
    '<div class="footer-social">' +
    '<a class="footer-slink footer-ig" href="https://www.instagram.com/tobaladies.basketball/" target="_blank" rel="noopener noreferrer" data-i18n="footer.ig.ladies">' + $ig1 + 'Tobaladies</a>' +
    '<a class="footer-slink footer-ig" href="https://www.instagram.com/tobadeli.basketball/" target="_blank" rel="noopener noreferrer" data-i18n="footer.ig.deli">' + $ig1 + 'Tobadeli</a>' +
    $waLink +
    '</div></div>'
    $marker = '<div class="footer-bottom">'
    $idx = $raw.IndexOf($marker)
    if ($idx -lt 0) { Write-Output "$f : MARKER NOT FOUND"; continue }
    $raw = $raw.Insert($idx, $block)
    Write-Output "$f : block inserted"
  }
  [System.IO.File]::WriteAllText((Resolve-Path $f), $raw, (New-Object System.Text.UTF8Encoding($false)))
}
