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
await new Promise(r => server.listen(8945, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERR: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8945/gallery.html', { waitUntil: 'domcontentloaded' });

const out = {};
// mock photos with delay to simulate slow API — check loading state then render
await page.evaluate(() => {
  setTimeout(() => {
    window.tobaGalleryCallback({ success: true, photos: ['Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies'].map((c, i) => ({ photoId: 'M' + i, community: c, title: 'F' + i, caption: 'Momen ' + i, photographer: 'Pro ' + (i % 3), displayOrder: i + 1, archiveFileId: 'F' + i })) });
  }, 800);
});
await new Promise(r => setTimeout(r, 200));
out.loadingState = await page.evaluate(() => !!document.querySelector('.gallery-state') && document.querySelector('.gallery-state').textContent.includes('Loading') || document.querySelector('.gallery-state')?.textContent.includes('Memuat'));
await page.waitForFunction(() => document.querySelectorAll('.gallery-item').length > 0, { timeout: 10000 });
out.cardsRendered = await page.evaluate(() => document.querySelectorAll('.gallery-item').length);
// reveal: cards in viewport must have .in (no invisible photos)
out.revealed = await page.evaluate(() => [...document.querySelectorAll('.gallery-item')].filter(el => el.getBoundingClientRect().top < window.innerHeight).every(el => el.classList.contains('in')));

// Prompt 1: headline typography + interaction
out.headline = await page.evaluate(() => {
  const h = document.getElementById('galleryHeroTitle');
  const cs = getComputedStyle(h);
  return { text: h.textContent, uppercase: cs.textTransform, color: cs.color, fontSize: cs.fontSize };
});
// click headline -> orange
await page.click('#galleryHeroTitle');
await new Promise(r => setTimeout(r, 600));
out.headlineOrange = await page.evaluate(() => getComputedStyle(document.getElementById('galleryHeroTitle')).color);
// click again -> back
await page.click('#galleryHeroTitle');
await new Promise(r => setTimeout(r, 600));
out.headlineBack = await page.evaluate(() => getComputedStyle(document.getElementById('galleryHeroTitle')).color);

// language switcher -> EN
await page.click('.lang-btn[data-lang="en"]');
await new Promise(r => setTimeout(r, 800));
out.langEN = await page.evaluate(() => ({
  eyebrow: document.querySelector('.gallery-hero-copy .eyebrow')?.textContent,
  h1: document.getElementById('galleryHeroTitle')?.textContent,
  info: document.querySelector('.info-editorial .ie-lead h2')?.textContent,
  photogLabel: document.querySelector('.pp-label')?.textContent,
  cards: document.querySelectorAll('.gallery-item').length /* photos survive lang switch */
}));
// back to ID
await page.click('.lang-btn[data-lang="id"]');
await new Promise(r => setTimeout(r, 800));
out.langID = await page.evaluate(() => ({
  eyebrow: document.querySelector('.gallery-hero-copy .eyebrow')?.textContent,
  h1: document.getElementById('galleryHeroTitle')?.textContent,
  info: document.querySelector('.info-editorial .ie-lead h2')?.textContent,
  photog: document.querySelector('.pp-label')?.textContent
}));

// Prompt 4: info-editorial structure
out.infoStructure = await page.evaluate(() => ({
  facts: document.querySelectorAll('.info-editorial .ie-fact').length,
  noDdValue: [...document.querySelectorAll('.info-editorial .ie-fact dd')].length,
  accentDash: !!document.querySelector('.info-editorial .ie-lead h2'),
  gridCols: getComputedStyle(document.querySelector('.info-editorial')).gridTemplateColumns.split(' ').length
}));

// Prompt 5: photo partner
out.partner = await page.evaluate(() => {
  const pp = document.querySelector('.photo-partner');
  if (!pp) return null;
  const a = pp.querySelector('a.pp-inner');
  return {
    exists: true,
    hasDummyLogo: !!pp.querySelector('.pp-dummy-logo'),
    hasLink: !!a,
    href: a ? a.getAttribute('href') : null,
    target: a ? a.getAttribute('target') : null,
    label: pp.querySelector('.pp-label')?.textContent,
    cta: pp.querySelector('.pp-cta')?.textContent
  };
});

// mobile check
await page.setViewport({ width: 390, height: 844, hasTouch: true });
await new Promise(r => setTimeout(r, 500));
out.mobile = await page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth > window.innerWidth,
  infoOneCol: getComputedStyle(document.querySelector('.info-editorial')).gridTemplateColumns.split(' ').length === 1,
  partnerVisible: !!document.querySelector('.photo-partner') && document.querySelector('.photo-partner').getBoundingClientRect().width > 0
}));
// tap photo on mobile -> headline orange sync (hl-panel: tunggu hero render; mock 1 API photo => fallback lokal dipakai)
await page.waitForFunction(() => document.querySelectorAll('.hl-panel').length === 5, { timeout: 10000 });
await page.tap('.hl-panel[data-idx="2"]');
await new Promise(r => setTimeout(r, 600));
out.mobileTapSync = await page.evaluate(() => getComputedStyle(document.getElementById('galleryHeroTitle')).color);

out.errors = errs;
console.log(JSON.stringify(out, null, 2));
await browser.close();
server.close();
