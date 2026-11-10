import puppeteer from 'puppeteer';
const BASE = 'http://127.0.0.1:8471';
const cases = [
  ['id', 320, 'index.html'], ['id', 320, 'tobaladies.html'], ['id', 320, 'tobadeli.html'],
  ['id', 375, 'index.html'], ['id', 390, 'index.html'], ['id', 414, 'index.html'],
  ['id', 768, 'index.html'], ['id', 1440, 'index.html'],
  ['en', 320, 'index.html'], ['en', 390, 'index.html'], ['en', 1440, 'index.html'],
  ['id', 390, 'events.html'], ['id', 390, 'gallery.html'], ['id', 390, 'merchandise.html'], ['id', 390, 'partnership.html'], ['id', 390, 'game.html'],
  ['en', 1440, 'events.html'], ['en', 1440, 'partnership.html']
];
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
for (const [lang, w, p] of cases) {
  const h = w < 700 ? 800 : 1000;
  await page.setViewport({ width: w, height: h });
  await page.goto(`${BASE}/${p}?lang=${lang}`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => { });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => { document.querySelectorAll('.obi-skip,.tld-skip,.tdl-skip').forEach(b => b && b.click && b.click()); });
  await new Promise(r => setTimeout(r, 500));
  const check = await page.evaluate(() => {
    const de = document.documentElement;
    const overflowX = Math.max(de.scrollWidth, document.body.scrollWidth) - window.innerWidth;
    const clipped = [];
    document.querySelectorAll('.script-accent').forEach(el => {
      const parent = el.closest('h1,h2,h3,p');
      if (parent && parent.scrollHeight > parent.clientHeight + 4) clipped.push(el.textContent.trim().slice(0, 18));
    });
    const misuse = !!document.querySelector('nav .script-accent, form .script-accent, button .script-accent');
    return { overflowX, clipped, misuse, fonts: document.fonts.status };
  });
  console.log(`${lang} ${w} ${p}: overflowX=${check.overflowX} fonts=${check.fonts}` +
    (check.clipped.length ? ' CLIPPED:' + check.clipped.join('|') : '') + (check.misuse ? ' SCRIPT-MISUSE' : ''));
  await page.screenshot({ path: `_typo-${lang}-${w}-${p.replace('.html', '')}.png`, clip: { x: 0, y: 0, width: w, height: Math.min(h, 860) } });
}
await browser.close();
console.log('QA-DONE');
