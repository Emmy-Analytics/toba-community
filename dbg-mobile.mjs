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
await new Promise(r => server.listen(8969, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--host-resolver-rules=MAP script.google.com 127.0.0.1'] });
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERR:', e.message));
page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE-ERR:', m.text()); });
await page.setViewport({ width: 390, height: 844, hasTouch: true });
await page.goto('http://localhost:8969/gallery.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  window.tobaGalleryCallback({ success: true, photos: ['Tobaladies', 'Tobadeli'].concat(Array.from({ length: 12 }, (_, i) => 'Tobaladies')).map((c, i) => ({ photoId: 'M' + i, community: c, title: 'F' + i, caption: 'Momen ' + i, photographer: 'Pro', displayOrder: i + 1, archiveFileId: 'F' + i })) });
});
await new Promise(r => setTimeout(r, 2000));
const dbg = await page.evaluate(() => ({
  page: document.body.dataset.page,
  carousel: !!document.getElementById('hlCarousel'),
  carouselHTML: (document.getElementById('hlCarousel')?.innerHTML || '(empty)').slice(0, 150),
  errorState: (document.querySelector('.gallery-state')?.textContent || '').slice(0, 120),
  galleryState: window.galleryState,
  jsonpSrc: document.getElementById('tobaGalleryJsonp')?.src?.slice(-60) || 'none'
}));
console.log(JSON.stringify(dbg, null, 2));
await browser.close();
server.close();
