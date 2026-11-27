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
await new Promise(r => server.listen(8951, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERR:', e.message));
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8951/gallery.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  setTimeout(() => window.tobaGalleryCallback({ success: true, photos: ['Tobaladies', 'Tobadeli'].concat(Array.from({ length: 12 }, (_, i) => 'Tobaladies')).map((c, i) => ({ photoId: 'M' + i, community: c, title: 'F' + i, caption: 'Momen ' + i, photographer: 'Pro', displayOrder: i + 1, archiveFileId: 'F' + i })) }), 500);
});
await page.waitForFunction(() => document.querySelectorAll('.gallery-item').length > 5, { timeout: 10000 });
console.log('cards before:', await page.evaluate(() => document.querySelectorAll('.gallery-item').length));
// simulate exactly the lang switch path, but inspect every step
await page.click('.lang-btn[data-lang="en"]');
for (const ms of [100, 300, 600, 1000]) {
  await new Promise(r => setTimeout(r, ms === 100 ? 100 : ms - [100, 300, 600, 1000][[100, 300, 600, 1000].indexOf(ms) - 1] || 0));
  console.log('t+' + ms, 'cards:', await page.evaluate(() => document.querySelectorAll('.gallery-item').length),
    '| state:', await page.evaluate(() => (window.galleryState === undefined ? 'not-exposed' : window.galleryState)),
    '| statusText:', (await page.evaluate(() => document.getElementById('galleryStatus')?.textContent || '')).slice(0, 60));
}
await browser.close();
server.close();
