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
// block the real Apps Script so mock stays authoritative
const BLOCK_HOST = 'script.google.com';
const server2 = http.createServer((req, res) => {
  const url = req.url;
  if (url.includes('script.google.com')) { res.writeHead(403); res.end(); return; }
  let p = decodeURIComponent(url.split('?')[0]);
  if (p === '/') p = '/gallery.html';
  const file = path.join(ROOT, p);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('nf'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise(r => server.listen(8965, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--host-resolver-rules=MAP script.google.com 127.0.0.1'] });
const page = await browser.newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERR: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8965/gallery.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  window.tobaGalleryCallback({ success: true, photos: ['Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies'].map((c, i) => ({ photoId: 'M' + i, community: c, title: 'F' + i, caption: 'Momen ' + i, photographer: 'Pro ' + (i % 3), displayOrder: i + 1, archiveFileId: 'F' + i })) });
});
await page.waitForFunction(() => document.querySelectorAll('.hl-panel').length === 5, { timeout: 15000 });
await new Promise(r => setTimeout(r, 600));

const out = {};
out.hlPanels = await page.evaluate(() => document.querySelectorAll('.hl-panel').length);
out.cards = await page.evaluate(() => document.querySelectorAll('.gallery-item').length);
out.revealed = await page.evaluate(() => [...document.querySelectorAll('.gallery-item')].filter(el => el.getBoundingClientRect().top < window.innerHeight).every(el => el.classList.contains('in')));

// Prompt 1
out.headline = await page.evaluate(() => {
  const h = document.getElementById('galleryHeroTitle');
  const cs = getComputedStyle(h);
  return { text: h.textContent.trim().slice(0, 40), uppercase: cs.textTransform, color: cs.color };
});
await page.click('#galleryHeroTitle');
await new Promise(r => setTimeout(r, 600));
out.headlineOrange = await page.evaluate(() => getComputedStyle(document.getElementById('galleryHeroTitle')).color);
await page.click('#galleryHeroTitle');
await new Promise(r => setTimeout(r, 600));
out.headlineBack = await page.evaluate(() => getComputedStyle(document.getElementById('galleryHeroTitle')).color);

// lang switch both ways, cards must persist
await page.click('.lang-btn[data-lang="en"]');
await new Promise(r => setTimeout(r, 1500));
out.langEN = await page.evaluate(() => ({
  eyebrow: document.querySelector('.gallery-hero-copy .eyebrow')?.textContent.trim(),
  h1: document.getElementById('galleryHeroTitle')?.textContent.trim().slice(0, 40),
  infoH: document.querySelector('.info-editorial .ie-lead h2')?.textContent.trim(),
  photogLabel: document.querySelector('.pp-label')?.textContent.trim(),
  cards: document.querySelectorAll('.gallery-item').length,
  panels: document.querySelectorAll('.hl-panel').length
}));
await page.click('.lang-btn[data-lang="id"]');
await new Promise(r => setTimeout(r, 1500));
out.langID = await page.evaluate(() => ({
  eyebrow: document.querySelector('.gallery-hero-copy .eyebrow')?.textContent.trim(),
  h1: document.getElementById('galleryHeroTitle')?.textContent.trim().slice(0, 40),
  infoH: document.querySelector('.info-editorial .ie-lead h2')?.textContent.trim(),
  photogLabel: document.querySelector('.pp-label')?.textContent.trim(),
  cards: document.querySelectorAll('.gallery-item').length
}));

// Prompt 4 structure
out.info = await page.evaluate(() => ({
  twoCols: getComputedStyle(document.querySelector('.info-editorial')).gridTemplateColumns.split(' ').length === 2,
  facts: document.querySelectorAll('.info-editorial .ie-fact').length,
  uppercaseH2: getComputedStyle(document.querySelector('.info-editorial .ie-lead h2')).textTransform
}));

// Prompt 5
out.partner = await page.evaluate(() => {
  const pp = document.querySelector('.photo-partner');
  return {
    exists: !!pp,
    dummy: !!pp?.querySelector('.pp-dummy-logo'),
    noLink: !pp?.querySelector('a.pp-inner'), /* URL kosong -> tanpa tautan */
    label: pp?.querySelector('.pp-label')?.textContent.trim()
  };
});

// mobile
await page.setViewport({ width: 390, height: 844, hasTouch: true });
await new Promise(r => setTimeout(r, 500));
out.mobile = await page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth > window.innerWidth,
  panelsAllVisible: [...document.querySelectorAll('.hl-panel')].every(el => { const r = el.getBoundingClientRect(); return r.left >= -0.5 && r.right <= window.innerWidth + 0.5; }),
  infoOneCol: getComputedStyle(document.querySelector('.info-editorial')).gridTemplateColumns.split(' ').length === 1
}));
await page.tap('.hl-panel[data-idx="2"]');
await new Promise(r => setTimeout(r, 500));
out.mobileTapHeadline = await page.evaluate(() => getComputedStyle(document.getElementById('galleryHeroTitle')).color);

out.errors = errs;
console.log(JSON.stringify(out, null, 2));

// screenshots
await page.setViewport({ width: 1440, height: 900 });
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'shot-final-desktop.png', fullPage: false });
await page.setViewport({ width: 390, height: 844 });
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'shot-final-mobile.png' });
await browser.close();
server.close();
