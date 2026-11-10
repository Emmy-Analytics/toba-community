const fs = require('fs');
const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'game.html', 'partnership.html'];
let bad = 0;
pages.forEach(p => {
  const c = fs.readFileSync(p, 'utf8');
  for (const m of c.matchAll(/(?:href|src)="([^"#]+\.html|[^"]+\.(?:css|js|png|jpg|jpeg|svg|webp))"/g)) {
    const t = m[1];
    if (t.startsWith('http')) continue;
    const clean = t.split('?')[0];
    if (!fs.existsSync(clean)) { console.log('MISSING', p, '->', clean); bad++; }
  }
});
console.log(bad ? ('BROKEN LINKS: ' + bad) : 'ALL INTERNAL LINKS/ASSETS OK');
