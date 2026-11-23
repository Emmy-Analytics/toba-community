/* scan_refs.mjs — verifikasi referensi asset di semua html/js/css */
import fs from 'fs';
import path from 'path';

const ROOT = process.argv[2] || '.';
const assetDir = path.join(ROOT, 'assets');

/* 1. list semua asset */
const assetFiles = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else assetFiles.push(full);
  }
}
if (fs.existsSync(assetDir)) walk(assetDir);

/* 2. gabungkan teks semua source */
let srcText = '';
for (const ext of ['.html', '.js', '.css', '.md', '.json', '.yml']) {
  for (const f of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!f.isFile()) continue;
    if (path.extname(f.name).toLowerCase() !== ext) continue;
    srcText += '\n/*==' + f.name + '==*/\n' + fs.readFileSync(path.join(ROOT, f.name), 'utf8');
  }
}

/* 3. cek tiap asset: nama file muncul di source? */
const used = [], unused = [];
for (const a of assetFiles) {
  const base = path.basename(a);
  (srcText.includes(base) ? used : unused).push(path.relative(ROOT, a));
}
console.log('TOTAL ASSETS:', assetFiles.length);
console.log('USED   :', used.length);
console.log('UNUSED :', unused.length);
fs.writeFileSync(path.join(ROOT, '_unused_assets.txt'), unused.sort().join('\n'));
fs.writeFileSync(path.join(ROOT, '_used_assets.txt'), used.sort().join('\n'));

/* 4. referensi yang menunjuk file yang tidak ada (broken ref) */
const refRe = /["'(]((?:[\w./\- ]+?)(?:\.png|\.jpg|\.jpeg|\.svg|\.webp|\.gif))["')]/gi;
const missing = new Set();
let m;
while ((m = refRe.exec(srcText))) {
  const r = m[1];
  if (/^(https?:|data:|#|\{\$)/.test(r)) continue;
  if (/%|\\u|\$\{/.test(r)) continue;
  /* resolve terhadap root (path relatif dari file tidak akurat, tapi cek 2 kemungkinan) */
  const cands = [r, r.replace(/^\.\//, ''), path.basename(r)];
  const ok = cands.some(c => {
    if (fs.existsSync(path.join(ROOT, c))) return true;
    if (fs.existsSync(path.join(assetDir, c))) return true;
    return false;
  });
  if (!ok) missing.add(r);
}
console.log('BROKEN REFS:', missing.size);
fs.writeFileSync(path.join(ROOT, '_broken_refs.txt'), [...missing].sort().join('\n'));
