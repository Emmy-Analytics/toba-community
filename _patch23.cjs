// PROMPT 23 — patch Header & Footer branding di semua HTML
const fs = require('fs');
const files = ['index.html', 'tobadeli.html', 'tobaladies.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html', 'game.html'];

const hdrOld = /<span class="brand-name">TOBA <small>COMMUNITY<\/small><\/span>/g;
const hdrNew = '<span class="brand-name brand-oneline" translate="no"><span class="bn-toba">TOBA</span><span class="bn-comm">COMMUNITY</span></span>';
const ftrOld = /<span class="brand-mark"><img src="assets\/crocodile-head-trans\.png" alt=""><\/span><span class="brand-name">TOBA <small>COMMUNITY<\/small><\/span>/g;
const ftrNew = '<span class="brand-name brand-oneline footer-wordmark" translate="no"><span class="bn-toba">TOBA</span><span class="bn-comm">COMMUNITY</span></span>';

for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const bh = (s.match(hdrOld) || []).length;
  const bf = (s.match(ftrOld) || []).length;
  s = s.replace(hdrOld, hdrNew);
  s = s.replace(ftrOld, ftrNew);
  fs.writeFileSync(f, s);
  console.log(f, 'header:', bh, 'footer:', bf);
}
