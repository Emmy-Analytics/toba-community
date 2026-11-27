// Verifikasi final interaksi: hover -> klik -> pindah -> tap, dengan mouse dipindah setelah setiap aksi
import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/gallery.html';
  const file = path.join(ROOT, p);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('nf'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise(r => server.listen(8939, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8939/gallery.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  window.tobaGalleryCallback({ success: true, photos: ['Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies'].map((c, i) => ({ photoId: 'M' + i, community: c, title: 'F' + i, caption: 'Momen ' + i, photographer: 'Pro', displayOrder: i + 1, archiveFileId: 'F' + i })) });
});
await page.waitForFunction(() => document.querySelectorAll('.hl-panel').length === 5, { timeout: 10000 });
await new Promise(r => setTimeout(r, 500));
const filters = () => page.evaluate(() => [...document.querySelectorAll('.hl-panel img')].map(i => getComputedStyle(i).filter));
const isColor = f => f.includes('grayscale(0)') || f === 'none';

await page.click('.hl-panel[data-idx="1"]');
await new Promise(r => setTimeout(r, 400));
await page.mouse.move(30, 500); /* mouse keluar showcase */
await new Promise(r => setTimeout(r, 700));
let f = await filters();
console.log('afterClick1:', f.map(x => isColor(x) ? 'COLOR' : 'GRAY').join(','), '| ok:', isColor(f[1]) && f.filter((x, i) => i !== 1).every(x => !isColor(x)));

await page.click('.hl-panel[data-idx="4"]');
await new Promise(r => setTimeout(r, 400));
await page.mouse.move(30, 500);
await new Promise(r => setTimeout(r, 700));
f = await filters();
console.log('afterClick2:', f.map(x => isColor(x) ? 'COLOR' : 'GRAY').join(','), '| ok:', isColor(f[4]) && f.filter((x, i) => i !== 4).every(x => !isColor(x)));

// posisi panel tidak berubah
const pos = await page.evaluate(() => [...document.querySelectorAll('.hl-panel')].map(el => { const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.width), Math.round(r.height)]; }));
console.log('positions:', JSON.stringify(pos));

await browser.close();
server.close();
