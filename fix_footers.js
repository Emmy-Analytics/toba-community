/* MASTER PROMPT 37-38: fix mojibake "Â©" -> "©" and add PortoWeb credit to every page footer.
   Runs in-place on the 8 HTML pages. Idempotent. */
const fs = require('fs');
const files = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html', 'game.html'];

const IG_SVG = '<svg class="pw-ig ig-brand" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="igGradPWA" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FFD600"/><stop offset=".35" stop-color="#FF7A00"/><stop offset=".6" stop-color="#FF0069"/><stop offset=".85" stop-color="#D300C5"/><stop offset="1" stop-color="#7638FA"/></linearGradient></defs><rect x="2.5" y="2.5" width="19" height="19" rx="5.4" fill="url(#igGradPWA)"/><rect x="5.4" y="5.4" width="13.2" height="13.2" rx="3.6" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="16" cy="8" r=".9" fill="#fff"/></svg>';

const CREDIT_HTML =
  '  <div class="footer-credit"><span class="pw-credit"><span class="pw-crafted" data-i18n="footer.pw.crafted">Crafted by</span> ' +
  '<a class="pw-wa" href="https://wa.me/6282195670441?text=Halo%20PortoWeb%20ID!%20Saya%20tertarik%20dengan%20layanan%20pembuatan%20website.%20Boleh%20saya%20mendapatkan%20informasi%20mengenai%20layanan%2C%20paket%2C%20dan%20harga%20yang%20tersedia%3F" target="_blank" rel="noopener noreferrer" data-i18n-attr="footer.pw.aria|aria-label" aria-label="WhatsApp PortoWeb ID"><b>PortoWeb ID</b></a>' +
  '<a class="pw-ig-link" href="https://www.instagram.com/portoweb.id/" target="_blank" rel="noopener noreferrer" aria-label="Instagram PortoWeb ID">' + IG_SVG + '</a></span></div>\n';

const CREDIT_OLD = '  <div class="footer-credit">';

for (const f of files) {
  if (!fs.existsSync(f)) { console.log('SKIP (missing)', f); continue; }
  let html = fs.readFileSync(f, 'utf8');

  // 1. fix mojibake in UTF-8 files: the sequence "Â©" (C3 82 + C2 A9 raw) appears as U+00C3 U+0082 U+00A9 or "Â©" literal.
  html = html.replace(/\u00C2?\u00A9/g, '\u00A9');

  // 2. find the closing </footer> and inject credit before it if not present
  if (!html.includes('footer-credit')) {
    // footers on all pages: insert credit inside footer, after footer-bottom (or footer-main)
    const idx = html.indexOf('</footer>');
    if (idx === -1) { console.log('NO FOOTER', f); continue; }
    html = html.slice(0, idx) + CREDIT_HTML + html.slice(idx);
  }

  fs.writeFileSync(f, html, 'utf8');
  console.log('OK', f);
}
// verify
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  const bad = /[\u00C3\u0082]\u00A9/.test(s);
  console.log(f, '| mojibake:', bad, '| credit:', s.includes('footer-credit'), '| footerclose:', s.includes('</footer>'));
}
