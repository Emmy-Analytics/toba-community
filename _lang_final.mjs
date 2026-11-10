import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
const out = [];
for (const w of [320, 375, 390, 414, 768, 1440]) {
  await page.setViewport({ width: w, height: w < 700 ? 800 : 900 });
  await page.goto('http://127.0.0.1:8471/index.html', { waitUntil: 'networkidle2' }).catch(() => { });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => { document.querySelectorAll('.obi-skip,.tld-skip,.tdl-skip').forEach(b => b && b.click && b.click()); });
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => { document.querySelector('.lang-btn[data-lang="id"]')?.click(); });
  await new Promise(r => setTimeout(r, 1000));
  const d = await page.evaluate(() => {
    const de = document.documentElement;
    const h1 = document.querySelector('.hero h1');
    const op = h1 ? getComputedStyle(h1.parentElement.closest('.hero-home') || h1).opacity : '?';
    const h1Op = h1 ? getComputedStyle(h1).opacity : '?';
    return {
      overflowX: Math.max(de.scrollWidth, document.body.scrollWidth) - window.innerWidth,
      h1Visible: h1 ? h1.getBoundingClientRect().top < innerHeight : false,
      h1Opacity: h1Op, heroOpacity: op,
      gameLinks: [...document.querySelectorAll('a[href="game.html"]')].length
    };
  });
  out.push(`ID ${w}px: overflowX=${d.overflowX} h1vis=${d.h1Visible} h1opacity=${d.h1Opacity} gameLinks=${d.gameLinks}`);
  await page.screenshot({ path: `_fin-id-${w}.png`, clip: { x: 0, y: 0, width: w, height: w < 700 ? 800 : 900 } });
}
console.log(out.join('\n'));
await browser.close();
console.log('FINAL-LANG-DONE');
