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
await new Promise(r => server.listen(8967, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--host-resolver-rules=MAP script.google.com 127.0.0.1'] });
const page = await browser.newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERR: ' + e.message));
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8967/gallery.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  window.tobaGalleryCallback({ success: true, photos: ['Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies'].map((c, i) => ({ photoId: 'M' + i, community: c, title: 'F' + i, caption: 'Momen ' + i, photographer: 'Pro', displayOrder: i + 1, archiveFileId: 'F' + i })) });
});
await page.waitForFunction(() => document.querySelectorAll('.hl-panel').length === 5, { timeout: 15000 });
await new Promise(r => setTimeout(r, 600));
const out = {};
const imgFilters = () => page.evaluate(() => [...document.querySelectorAll('.hl-panel img')].map(i => getComputedStyle(i).filter));
const isColor = f => f.includes('grayscale(0)') || f === 'none';
const accentColor = () => page.evaluate(() => {
  const h = document.getElementById('galleryHeroTitle');
  const span = h.querySelector('.gh-accent');
  return getComputedStyle(span).color;
});
const firstHalfColor = () => page.evaluate(() => {
  const h = document.getElementById('galleryHeroTitle');
  const tn = [...h.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
  const range = document.createRange(); range.selectNode(tn);
  return getComputedStyle(h).color; /* h1 color governs first half */
});

// default: all grayscale, span charcoal
out.default = { allGray: (await imgFilters()).every(f => !isColor(f)), spanColor: await accentColor(), h1Color: await firstHalfColor() };

// hover panel 0 -> only it colored + accent orange
await page.hover('.hl-panel[data-idx="0"]');
await new Promise(r => setTimeout(r, 700));
let f = await imgFilters();
out.hover0 = { only0: isColor(f[0]) && f.slice(1).every(x => !isColor(x)), accent: await accentColor() };

// move hover to panel 1 -> panel 0 back to gray, accent dark green
await page.hover('.hl-panel[data-idx="1"]');
await new Promise(r => setTimeout(r, 700));
f = await imgFilters();
out.hover1 = { only1: isColor(f[1]) && f.filter((x, i) => i !== 1).every(x => !isColor(x)), accent: await accentColor() };

// move hover to panel 3 -> dark green again
await page.hover('.hl-panel[data-idx="3"]');
await new Promise(r => setTimeout(r, 700));
out.hover3 = { accent: await accentColor() };

// mouse leaves carousel -> all gray + charcoal
await page.mouse.move(100, 800);
await new Promise(r => setTimeout(r, 700));
out.leaveShowcase = { allGray: (await imgFilters()).every(x => !isColor(x)), accent: await accentColor() };

// hover panel 0 then CLICK panel 2 (active) -> two colored? requirement: only hover one colored; active remains
await page.hover('.hl-panel[data-idx="0"]');
await new Promise(r => setTimeout(r, 500));
await page.click('.hl-panel[data-idx="2"]');
await new Promise(r => setTimeout(r, 600));
f = await imgFilters();
out.clickWhileHover = { colored: f.map(x => isColor(x)).join(','), accent: await accentColor() };

// mouse leaves -> active photo STAYS colored (gallery existing mechanism), span keeps active accent
await page.mouse.move(100, 800);
await new Promise(r => setTimeout(r, 700));
f = await imgFilters();
out.leaveAfterClick = { colored: f.map(x => isColor(x)).join(','), accent: await accentColor() };

// mobile: tap behavior — page.reloaded state: panels hilang karena error state
// (JSONP real diblokir → error). Re-inject mock agar panels muncul kembali.
await page.setViewport({ width: 390, height: 844, hasTouch: true });
await new Promise(r => setTimeout(r, 800));
await page.evaluate(() => {
  if (!document.querySelectorAll('.hl-panel').length) {
    window.tobaGalleryCallback({ success: true, photos: ['Tobaladies','Tobadeli','Tobaladies','Tobadeli','Tobaladies','Tobadeli','Tobaladies','Tobaladies','Tobadeli','Tobaladies','Tobadeli','Tobaladies','Tobadeli','Tobaladies'].map((c,i)=>({photoId:'M'+i,community:c,title:'F'+i,caption:'Momen '+i,photographer:'Pro',displayOrder:i+1,archiveFileId:'F'+i})) });
  }
});
await page.waitForFunction(() => document.querySelectorAll('.hl-panel').length === 5, { timeout: 10000 });
console.log('MOBILE-DOM', await page.evaluate(() => ({ panels: document.querySelectorAll('.hl-panel').length, page: document.body.dataset.page, hasCarousel: !!document.getElementById('hlCarousel'), appLen: (document.getElementById('app')?.innerHTML || '').length, hasError: !!document.querySelector('.gallery-state.error') })));
out.panelsAtMobile = await page.evaluate(() => document.querySelectorAll('.hl-panel').length);
await page.tap('.hl-panel[data-idx="1"]');
await new Promise(r => setTimeout(r, 600));
f = await imgFilters();
out.tap1dbg = await page.evaluate(()=>document.querySelectorAll('.hl-panel').length + ':' + (document.getElementById('hlCarousel')?.innerHTML||'').slice(0,120));
out.tap1 = { colored: f.map(x => isColor(x)).join(','), accent: await accentColor() };
await page.evaluate(() => document.querySelectorAll('.hl-panel')[4].click());
await new Promise(r => setTimeout(r, 600));
f = await imgFilters();
out.tap4 = { colored: f.map(x => isColor(x)).join(','), accent: await accentColor() };
// tap the active one again -> toggle off (grayscale + charcoal)
await page.evaluate(() => document.querySelectorAll('.hl-panel')[4].click());
await new Promise(r => setTimeout(r, 600));
f = await imgFilters();
out.tap4Again = { colored: f.map(x => isColor(x)).join(','), accent: await accentColor() };

// EN language: span still works
await page.setViewport({ width: 1440, height: 900 });
await new Promise(r => setTimeout(r, 400));
await page.click('.lang-btn[data-lang="en"]');
await new Promise(r => setTimeout(r, 1000));
// lang re-render rebuilds shell → re-inject mock then wait for panels
await page.evaluate(() => {
  if (!document.querySelectorAll('.hl-panel').length) {
    window.tobaGalleryCallback({ success: true, photos: ['Tobaladies','Tobadeli','Tobaladies','Tobadeli','Tobaladies','Tobadeli','Tobaladies','Tobaladies','Tobadeli','Tobaladies','Tobadeli','Tobaladies','Tobadeli','Tobaladies'].map((c,i)=>({photoId:'M'+i,community:c,title:'F'+i,caption:'Momen '+i,photographer:'Pro',displayOrder:i+1,archiveFileId:'F'+i})) });
  }
});
await page.waitForFunction(() => document.querySelectorAll('.hl-panel').length === 5, { timeout: 10000 });
await new Promise(r => setTimeout(r, 400));
out.enSpan = await page.evaluate(() => {
  const h = document.getElementById('galleryHeroTitle');
  return { text: h.textContent.trim(), span: h.querySelector('.gh-accent')?.textContent.trim(), color: getComputedStyle(h.querySelector('.gh-accent')).color };
});
await page.hover('.hl-panel[data-idx="0"]');
await new Promise(r => setTimeout(r, 500));
out.enHover = { accent: await accentColor() };

out.errors = errs;
console.log(JSON.stringify(out, null, 2));
await browser.close();
server.close();
