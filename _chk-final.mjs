import puppeteer from 'puppeteer';
const B = 'http://127.0.0.1:8321/';
const b = await puppeteer.launch({ headless: 'new' });
// 1. language switch works (EN->ID) on home
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto(B + 'index.html', { waitUntil: 'networkidle2' });
await p.evaluate(() => { document.getElementById('tobaIntro')?.remove() });
await p.click('.lang-btn[data-lang="id"]');
await new Promise(r => setTimeout(r, 1200));
const idTxt = await p.evaluate(() => document.querySelector('p.eyebrow')?.textContent || document.querySelector('.hero-head .eyebrow')?.textContent || document.querySelector('.eyebrow')?.textContent);
console.log('ID eyebrow:', idTxt);
// nav drawer mobile open/close
const m = await b.newPage();
await m.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await m.goto(B + 'index.html', { waitUntil: 'networkidle2' });
await m.evaluate(() => { document.getElementById('tobaIntro')?.remove() });
await m.click('#menuToggle');
await new Promise(r => setTimeout(r, 600));
const navOpen = await m.evaluate(() => document.getElementById('mainNav').classList.contains('open'));
await m.click('.drawer-close');
await new Promise(r => setTimeout(r, 600));
const navClosed = await m.evaluate(() => !document.getElementById('mainNav').classList.contains('open'));
console.log('NAV open/close:', navOpen, navClosed);
// explore mega on desktop
const ex = await b.newPage();
await ex.setViewport({ width: 1440, height: 900 });
await ex.goto(B + 'index.html', { waitUntil: 'networkidle2' });
await ex.click('#navExplore');
await new Promise(r => setTimeout(r, 500));
const megaOpen = await ex.evaluate(() => document.getElementById('megaMenu').classList.contains('open'));
const clipped = await ex.evaluate(() => { const r = document.getElementById('megaMenu').getBoundingClientRect(); return r.width > 500 });
console.log('MEGA open/wide:', megaOpen, clipped);
// console errors across pages
const errs = [];
const c = await b.newPage();
c.on('pageerror', e => errs.push(e.message));
c.on('console', msg => { if (msg.type() === 'error') errs.push(msg.text()) });
for (const pg of ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'gallery.html', 'merchandise.html', 'partnership.html']) {
  await c.goto(B + pg, { waitUntil: 'networkidle2' }).catch(() => { });
}
console.log('CONSOLE/PAGE ERRORS:', JSON.stringify(errs.slice(0, 8)));
await b.close();
