import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
const out = [];
for (const [w, name] of [[320, '320'], [390, '390'], [1440, '1440']]) {
  await page.setViewport({ width: w, height: 900 });
  await page.goto('http://127.0.0.1:8471/index.html', { waitUntil: 'networkidle2' }).catch(() => { });
  await new Promise(r => setTimeout(r, 900));
  // force ID via the real switch (existing behavior)
  await page.evaluate(() => { const b = document.querySelector('.lang-btn[data-lang="id"]'); b && b.click(); });
  await new Promise(r => setTimeout(r, 900));
  const d = await page.evaluate(() => {
    const de = document.documentElement;
    return {
      hero: document.querySelector('.hero h1')?.textContent.trim().slice(0, 50),
      lang: document.documentElement.lang,
      overflowX: Math.max(de.scrollWidth, document.body.scrollWidth) - window.innerWidth,
      gameLinks: [...document.querySelectorAll('a[href="game.html"]')].length
    };
  });
  out.push(`ID ${name}px: lang=${d.lang} overflowX=${d.overflowX} gameLinks=${d.gameLinks} hero="${d.hero}"`);
  await page.screenshot({ path: `_id-${name}.png`, clip: { x: 0, y: 0, width: w, height: 780 } });
  // switch back to EN to verify toggle both ways
  await page.evaluate(() => { const b = document.querySelector('.lang-btn[data-lang="en"]'); b && b.click(); });
  await new Promise(r => setTimeout(r, 600));
  const e = await page.evaluate(() => document.documentElement.lang);
  out.push(`EN-back ${name}px: lang=${e}`);
}
console.log(out.join('\n'));
await browser.close();
console.log('LANG-QA-DONE');
