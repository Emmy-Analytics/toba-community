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
await new Promise(r => server.listen(8947, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERR:', e.message));
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8947/gallery.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  window.tobaGalleryCallback({ success: true, photos: ['Tobaladies', 'Tobadeli'].concat(Array.from({ length: 12 }, (_, i) => 'Tobaladies')).map((c, i) => ({ photoId: 'M' + i, community: c, title: 'F' + i, caption: 'Momen ' + i, photographer: 'Pro', displayOrder: i + 1, archiveFileId: 'F' + i })) });
});
await page.waitForFunction(() => document.querySelectorAll('.gallery-item').length > 5, { timeout: 10000 });
console.log('before:', await page.evaluate(() => document.querySelectorAll('.gallery-item').length), 'state:', await page.evaluate(() => window.galleryState));
await page.click('.lang-btn[data-lang="en"]');
await new Promise(r => setTimeout(r, 1000));
const dbg = await page.evaluate(() => ({
  state: window.galleryState,
  photos: (window.galleryPhotos || []).length,
  filtered: (window.galleryFiltered || []).length,
  cards: document.querySelectorAll('.gallery-item').length,
  gridHTML: (document.getElementById('galleryGrid')?.innerHTML || '').slice(0, 200),
  status: document.getElementById('galleryStatus')?.textContent?.slice(0, 100)
}));
console.log(JSON.stringify(dbg, null, 2));
// accent color values
console.log('accent:', await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent')));
await browser.close();
server.close();
