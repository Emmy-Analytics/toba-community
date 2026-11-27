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
await new Promise(r => server.listen(8955, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERR:', e.message));
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8955/gallery.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  window.tobaGalleryCallback({ success: true, photos: ['Tobaladies', 'Tobadeli'].concat(Array.from({ length: 12 }, (_, i) => 'Tobaladies')).map((c, i) => ({ photoId: 'M' + i, community: c, title: 'F' + i, caption: 'Momen ' + i, photographer: 'Pro', displayOrder: i + 1, archiveFileId: 'F' + i })) });
});
await page.waitForFunction(() => document.querySelectorAll('.gallery-item').length > 5, { timeout: 10000 });
await page.click('.lang-btn[data-lang="en"]');
await new Promise(r => setTimeout(r, 1200));
const dbg = await page.evaluate(() => ({
  activeFilter: [...document.querySelectorAll('#galleryFilters [data-filter]')].filter(b => b.classList.contains('active')).map(b => b.textContent.trim()),
  cards: document.querySelectorAll('.gallery-item').length,
  countText: document.getElementById('galleryCount')?.textContent,
  perPageVal: document.getElementById('galleryPerPage')?.value,
  pagerHTML: document.getElementById('galleryPager')?.hidden,
  pageInfo: document.getElementById('galleryPageInfo')?.textContent,
  searchVal: document.getElementById('gallerySearch')?.value,
  phVal: document.getElementById('galleryPhotographer')?.value
}));
console.log(JSON.stringify(dbg, null, 2));
await browser.close();
server.close();
