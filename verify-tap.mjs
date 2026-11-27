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
await new Promise(r => server.listen(8971, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--host-resolver-rules=MAP script.google.com 127.0.0.1'] });
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERR:', e.message));
await page.setViewport({ width: 390, height: 844, hasTouch: true });
await page.goto('http://localhost:8971/gallery.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  window.tobaGalleryCallback({ success: true, photos: ['Tobaladies', 'Tobadeli'].concat(Array.from({ length: 12 }, (_, i) => 'Tobaladies')).map((c, i) => ({ photoId: 'M' + i, community: c, title: 'F' + i, caption: 'Momen ' + i, photographer: 'Pro', displayOrder: i + 1, archiveFileId: 'F' + i })) });
});
await page.waitForFunction(() => document.querySelectorAll('.hl-panel').length === 5, { timeout: 15000 });
console.log('panels on mobile:', await page.evaluate(() => document.querySelectorAll('.hl-panel').length));

const imgFilters = () => page.evaluate(() => [...document.querySelectorAll('.hl-panel img')].map(i => getComputedStyle(i).filter));
const isColor = f => f.includes('grayscale(0)') || f === 'none';
const accentColor = () => page.evaluate(() => {
  const h = document.getElementById('galleryHeroTitle');
  return getComputedStyle(h.querySelector('.gh-accent')).color;
});

await page.tap('.hl-panel[data-idx="1"]');
await new Promise(r => setTimeout(r, 700));
let f = await imgFilters();
console.log('tap1 colored:', f.map(x => isColor(x)).join(','), '| accent:', await accentColor());

await page.evaluate(() => document.querySelectorAll('.hl-panel')[4].click());
await new Promise(r => setTimeout(r, 700));
f = await imgFilters();
console.log('tap4 colored:', f.map(x => isColor(x)).join(','), '| accent:', await accentColor());

await page.evaluate(() => document.querySelectorAll('.hl-panel')[4].click());
await new Promise(r => setTimeout(r, 700));
f = await imgFilters();
console.log('tap4-again colored:', f.map(x => isColor(x)).join(','), '| accent:', await accentColor());

await browser.close();
server.close();
