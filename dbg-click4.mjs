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
await new Promise(r => server.listen(8953, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERR:', e.message));
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8953/gallery.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  window.tobaGalleryCallback({ success: true, photos: ['Tobaladies', 'Tobadeli'].concat(Array.from({ length: 12 }, (_, i) => 'Tobaladies')).map((c, i) => ({ photoId: 'M' + i, community: c, title: 'F' + i, caption: 'Momen ' + i, photographer: 'Pro', displayOrder: i + 1, archiveFileId: 'F' + i })) });
});
await page.waitForFunction(() => document.querySelectorAll('.gallery-item').length > 5, { timeout: 10000 });
console.log('cards:', await page.evaluate(() => document.querySelectorAll('.gallery-item').length));
await page.click('#galleryHeroTitle');
await new Promise(r => setTimeout(r, 500));
console.log('after click 1:', await page.evaluate(() => document.querySelectorAll('.gallery-item').length));
await page.click('#galleryHeroTitle');
await new Promise(r => setTimeout(r, 500));
console.log('after click 2:', await page.evaluate(() => document.querySelectorAll('.gallery-item').length));
await page.click('.lang-btn[data-lang="en"]');
await new Promise(r => setTimeout(r, 1200));
console.log('after lang:', await page.evaluate(() => document.querySelectorAll('.gallery-item').length),
  '| categories:', JSON.stringify(await page.evaluate(() => [...new Set([...document.querySelectorAll('.gallery-item')].map(el => el.dataset.category))])));
await browser.close();
server.close();
