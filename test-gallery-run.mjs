import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
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
await new Promise(r => server.listen(8931, r));

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('PAGEERROR: ' + e.message));

await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8931/gallery.html', { waitUntil: 'domcontentloaded' });
// skip intro overlay if present
try { await page.waitForSelector('.intro-overlay, #intro', { timeout: 2000 }); await page.keyboard.press('Escape'); await page.evaluate(() => { localStorage.setItem('toba_intro_seen', '1'); }); } catch { }
await page.waitForFunction(() => document.querySelectorAll('#galleryFilters [data-filter]').length > 0, { timeout: 30000 });
let loaded = false;
for (let i = 0; i < 55; i++) {
  await new Promise(r => setTimeout(r, 1000));
  loaded = await page.evaluate(() => (window.galleryPhotos || []).length > 0);
  if (loaded) break;
  if (i === 0) { await page.evaluate(() => { window.tobaGalleryCallback({ success: true, photos: [{ photoId: 'SIM-1', community: 'Tobaladies', title: 'Sim', caption: 'Friendly Match sim', photographer: 'Sim', displayOrder: 1, archiveFileId: 'SIMFILE1' }] }); }); loaded = true; break; }
}
if (!loaded) { console.log(JSON.stringify({ fatal: 'API never loaded', state: await page.evaluate(() => window.galleryState), masterNow: await page.evaluate(() => (window.galleryPhotos || []).length), cards: await page.evaluate(() => document.querySelectorAll('.gallery-item').length), hasStatus: await page.evaluate(() => (document.getElementById('galleryStatus') || {}).textContent || ''), hasLoadGallery: await page.evaluate(() => typeof window.loadGallery), bodyPage: await page.evaluate(() => document.body.dataset.page), inner: await page.evaluate(() => document.getElementById('app').innerHTML.slice(0, 300)), jsonp: await page.evaluate(() => { const s = document.getElementById('tobaGalleryJsonp'); return s ? s.src : 'none'; }), errors: consoleErrors })); await browser.close(); server.close(); process.exit(0); }
await page.waitForFunction(() => document.querySelectorAll('.gallery-item').length > 0, { timeout: 30000 });
await new Promise(r => setTimeout(r, 800));

const out = {};
out.initial = await page.evaluate(() => ({
  cards: document.querySelectorAll('.gallery-item').length,
  heroShots: document.querySelectorAll('.gh-strip .gh-shot').length,
  featuredShots: document.querySelectorAll('.gf-shot').length,
  featuredVisible: document.getElementById('galleryFeatured') && !document.getElementById('galleryFeatured').hidden,
  master: (window.galleryPhotos || []).length,
  filtered: (window.galleryFiltered || []).length
}));

// filter sequence: Semua -> Tobaladies -> Tobadeli -> Semua, repeat
const seq = [];
async function clickFilter(name) {
  const labels = ['Semua', 'Tobaladies', 'Tobadeli'];
  const idx = Math.max(0, labels.indexOf(name));
  await page.evaluate(i => { const b = document.querySelectorAll('#galleryFilters [data-filter]')[i]; if (b) b.click(); }, idx);
  await new Promise(r => setTimeout(r, 350));
  seq.push(await page.evaluate(() => ({ text: [...document.querySelectorAll('#galleryFilters [data-filter]')].filter(b => b.classList.contains('active')).map(b => b.textContent.trim())[0], cards: document.querySelectorAll('.gallery-item').length, filtered: (window.galleryFiltered || []).length, communities: [...new Set((window.galleryFiltered || []).map(p => p.community))] })));
}
await clickFilter('Tobaladies'); await clickFilter('Tobadeli'); await clickFilter('Semua');
await clickFilter('Tobaladies'); await clickFilter('Tobadeli'); await clickFilter('Semua');
out.filterSequence = seq;

// search
await page.type('#gallerySearch', 'zzz-no-match-zzz');
await new Promise(r => setTimeout(r, 600));
out.searchEmpty = await page.evaluate(() => ({ state: (document.querySelector('.gallery-state') || {}).textContent || '', hasClear: !!document.getElementById('galleryClearSearch') }));
await page.click('#galleryClearSearch');
await new Promise(r => setTimeout(r, 400));
out.afterClear = await page.evaluate(() => document.querySelectorAll('.gallery-item').length);

// lightbox open/close
await page.evaluate(() => document.querySelector('.gallery-item').click());
await new Promise(r => setTimeout(r, 600));
out.lightbox = await page.evaluate(() => ({
  open: document.getElementById('tobaLightbox').classList.contains('open'),
  cap: document.querySelector('.lightbox-cap').textContent,
  hasDl: !!document.getElementById('lbDownload')
}));
await page.keyboard.press('ArrowRight');
await new Promise(r => setTimeout(r, 400));
await page.keyboard.press('Escape');
await new Promise(r => setTimeout(r, 300));
out.lightboxClosed = await page.evaluate(() => !document.getElementById('tobaLightbox').classList.contains('open'));

// screenshots
await page.screenshot({ path: 'gallery-desktop.png' });
await page.setViewport({ width: 390, height: 844 });
await new Promise(r => setTimeout(r, 700));
out.mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
await page.screenshot({ path: 'gallery-mobile.png' });

out.consoleErrors = consoleErrors;
console.log(JSON.stringify(out, null, 2));
await browser.close();
server.close();
