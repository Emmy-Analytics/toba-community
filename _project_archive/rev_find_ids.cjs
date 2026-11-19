// Uji terakhir: pola URL yang berbeda — mungkin ada deployment kedua (dev URL)
// atau /dev. Cek juga apakah ada endpoint kedua di project (misal partnership
// form). Cari semua ID Apps Script di seluruh file.
const fs = require('fs');
const path = require('path');
const ids = new Set();
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) { if (f !== 'node_modules' && !f.startsWith('_project_archive')) walk(p); continue; }
    if (!/\.(js|html|json|txt|md)$/.test(f)) continue;
    const txt = fs.readFileSync(p, 'utf8');
    const m = txt.matchAll(/AKfycb[A-Za-z0-9_-]{20,}/g);
    for (const x of m) ids.add(x[0]);
  }
}
walk(__dirname + '/..');
console.log([...ids].map(id => 'AKfycb...' + id.slice(8, 24) + '...'));
