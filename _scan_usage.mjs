import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
const root = process.cwd();
// gather ALL asset paths relative to assets/
const assetFiles = [];
function walkAssets(dir, rel) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walkAssets(p, rel ? rel + '/' + f : f);
    else assetFiles.push(rel ? rel + '/' + f : f);
  }
}
walkAssets(join(root, 'assets'), '');
// gather all text corpus incl. subdirectories at root
const texts = [];
function walk(dir) {
  for (const f of readdirSync(dir)) {
    if (f === 'node_modules' || f === '.git' || f === 'assets') continue;
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|js|css|xml|txt|md|json|svg)$/i.test(f)) texts.push(p);
  }
}
walk(root);
const corpus = texts.map(p => { try { return readFileSync(p, 'utf8'); } catch { return ''; } });
const unreferenced = [];
for (const rel of assetFiles) {
  const base = rel.split('/').pop();
  const stem = base.replace(/\.[^.]+$/, '');
  const hit = corpus.some(c => c.includes(base) || (stem.length > 6 && c.includes(stem)));
  if (!hit) unreferenced.push(rel);
}
console.log('TOTAL ASSET FILES:', assetFiles.length);
console.log('UNREFERENCED (' + unreferenced.length + '):');
unreferenced.forEach(u => console.log('  assets/' + u));
