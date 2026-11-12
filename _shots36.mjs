/* screenshots for Prompt 21–36 QA */
import fs from 'fs';
const shots = [
  { url: 'http://localhost:8377/index.html', w: 1440, h: 900, out: '_qa_home_desktop.png', scrollTo: 0 },
  { url: 'http://localhost:8377/index.html', w: 1440, h: 900, out: '_qa_gallery.png', scrollTo: '.cine-gallery' },
  { url: 'http://localhost:8377/index.html', w: 1440, h: 900, out: '_qa_apparel_merch.png', scrollTo: '#cineApparel' },
  { url: 'http://localhost:8377/tobadeli.html', w: 375, h: 812, out: '_qa_deli_mobile.png', scrollTo: 0 },
  { url: 'http://localhost:8377/tobadeli.html', w: 1440, h: 900, out: '_qa_deli_desktop.png', scrollTo: 0 },
  { url: 'http://localhost:8377/index.html', w: 375, h: 812, out: '_qa_home_mobile.png', scrollTo: 0 },
  { url: 'http://localhost:8377/index.html', w: 375, h: 812, out: '_qa_footer_mobile.png', scrollTo: 'footer' },
];
const browser = await import('puppeteer').catch(() => null);
if (!browser) { console.log(JSON.stringify({ error: 'no puppeteer here' })); process.exit(1); }
const B = await browser.launch({ headless: 'new' });
for (const s of shots) {
  const pg = await B.newPage();
  await pg.setViewport({ width: s.w, height: s.h });
  await pg.evaluateOnNewDocument(() => { for (const k of ['toba-intro-seen','tobaladies-intro-seen','tobadeli-intro-seen']) sessionStorage.setItem(k, '1'); });
  await pg.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => { });
  await new Promise(r => setTimeout(r, 3500));
  if (typeof s.scrollTo === 'number') await pg.evaluate(y => window.scrollTo(0, y), s.scrollTo);
  else await pg.evaluate(sel => document.querySelector(sel)?.scrollIntoView(), s.scrollTo);
  await new Promise(r => setTimeout(r, 1200));
  await pg.screenshot({ path: s.out });
  await pg.close();
}
await B.close();
console.log('done');
