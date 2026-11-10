import puppeteer from 'puppeteer';
const B = 'http://127.0.0.1:8321/';
const b = await puppeteer.launch({ headless: 'new' });
// events: check horizontal scroll exists at 390px
const p = await b.newPage();
await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await p.goto(B + 'events.html', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1500));
const sc = await p.evaluate(() => {
  const g = document.querySelector('.event-grid');
  return { hasScroll: g.scrollWidth > g.clientWidth, scrollW: g.scrollWidth, clientW: g.clientWidth, display: getComputedStyle(g).display };
});
console.log('EVENTS SCROLL:', JSON.stringify(sc));
// scroll gallery to bottom: verify info-editorial block renders
const g = await b.newPage();
await g.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await g.goto(B + 'gallery.html', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1200));
await g.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise(r => setTimeout(r, 1200));
await g.screenshot({ path: '_chk-gallery-bottom-390.png' });
const ie = await g.evaluate(() => {
  const el = document.querySelector('.info-editorial');
  if (!el) return 'MISSING';
  const r = el.getBoundingClientRect();
  return { h: Math.round(r.height), facts: el.querySelectorAll('.ie-fact').length, visible: r.height > 100 };
});
console.log('INFO EDITORIAL:', JSON.stringify(ie));
// gallery shell background color
const bg = await g.evaluate(() => getComputedStyle(document.querySelector('.gallery-shell')).backgroundImage.slice(0, 80));
console.log('SHELL BG:', bg);
await b.close();
