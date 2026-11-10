import puppeteer from 'puppeteer';
const B = 'http://127.0.0.1:8321/';
const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'gallery.html', 'merchandise.html', 'partnership.html'];
const browser = await puppeteer.launch({ headless: 'new' });
for (const p of pages) {
  const pg = await browser.newPage();
  await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await pg.goto(B + p, { waitUntil: 'networkidle2', timeout: 45000 });
  await pg.evaluate(() => { sessionStorage.setItem('toba-intro-seen', '1'); sessionStorage.setItem('tobaladies-intro-seen', '1'); sessionStorage.setItem('tobadeli-intro-seen', '1'); document.getElementById('tobaIntro')?.remove(); document.querySelector('.tld-intro')?.remove(); document.getElementById('tdlIntro')?.remove(); });
  await new Promise(r => setTimeout(r, 2500));
  await pg.screenshot({ path: '_ref-' + p.replace('.html', '') + '-390.png' });
  const overflow = await pg.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(p, 'overflow-x:', overflow);
  await pg.close();
}
await browser.close();
