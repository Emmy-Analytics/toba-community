import puppeteer from 'puppeteer';
const BASE = 'http://127.0.0.1:8471';
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push('JS: ' + e.message));
const shots = [
  ['id', 320, 'index.html'], ['id', 320, 'tobaladies.html'], ['id', 320, 'tobadeli.html'],
  ['id', 390, 'index.html'], ['id', 414, 'index.html'], ['id', 768, 'index.html'], ['id', 1440, 'index.html'],
  ['en', 320, 'index.html'], ['en', 390, 'index.html'], ['en', 1440, 'index.html'],
  ['id', 390, 'events.html'], ['id', 390, 'gallery.html'], ['id', 390, 'merchandise.html'], ['id', 390, 'partnership.html']
];
for (const [lang, w, p] of shots) {
  const h = w < 700 ? 800 : 1000;
  await page.setViewport({ width: w, height: h });
  await page.goto(`${BASE}/${p}?lang=${lang}`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => { });
  await new Promise(r => setTimeout(r, 1100));
  await page.evaluate(() => { document.querySelectorAll('.obi-skip,.tld-skip,.tdl-skip').forEach(b => b && b.click && b.click()); });
  await new Promise(r => setTimeout(r, 500));
  const c = await page.evaluate(() => {
    const de = document.documentElement;
    const gameLinks = [...document.querySelectorAll('a[href="game.html"]')].length;
    const heroMascot = document.querySelector('.hero-mascot');
    const mascotW = heroMascot ? Math.round(heroMascot.getBoundingClientRect().width) : 0;
    return { overflowX: Math.max(de.scrollWidth, document.body.scrollWidth) - window.innerWidth, gameLinks, mascotW };
  });
  console.log(`${lang} ${w} ${p}: overflowX=${c.overflowX} gameLinks=${c.gameLinks} mascot=${c.mascotW}px`);
  await page.screenshot({ path: `_court2-${lang}-${w}-${p.replace('.html', '')}.png`, clip: { x: 0, y: 0, width: w, height: Math.min(h, 860) } });
}
// drawer + mega menu explicit check at two sizes
for (const [lang, w] of [['id', 320], ['en', 1440]]) {
  await page.setViewport({ width: w, height: 900 });
  await page.goto(`${BASE}/index.html?lang=${lang}`, { waitUntil: 'networkidle2' }).catch(() => { });
  await new Promise(r => setTimeout(r, 900));
  if (w >= 1000) {
    await page.click('#navExplore').catch(() => { });
    await new Promise(r => setTimeout(r, 700));
  } else {
    await page.click('#menuToggle').catch(() => { });
    await new Promise(r => setTimeout(r, 700));
    await page.evaluate(() => document.querySelectorAll('.mega-label').forEach(b => b.click()));
    await new Promise(r => setTimeout(r, 600));
  }
  const n = await page.evaluate(() => document.querySelectorAll('#mainNav a[href="game.html"]').length);
  console.log(`${lang} ${w} nav open: game links in nav = ${n}`);
  await page.screenshot({ path: `_court2-${lang}-${w}-nav.png` });
}
console.log(errors.length ? 'ERRORS:\n' + errors.slice(0, 8).join('\n') : 'NO JS ERRORS');
await browser.close();
console.log('QA2-DONE');
