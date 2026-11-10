import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
const out = [];
for (const w of [320, 390, 414, 768, 1440]) {
  await page.setViewport({ width: w, height: 900 });
  await page.goto('http://127.0.0.1:8471/index.html', { waitUntil: 'networkidle2' }).catch(() => { });
  await new Promise(r => setTimeout(r, 600));
  // skip intro overlay FIRST (it sits above the page)
  await page.evaluate(() => { document.querySelectorAll('.obi-skip,.tld-skip,.tdl-skip').forEach(b => b && b.click && b.click()); });
  await new Promise(r => setTimeout(r, 400));
  // then switch to ID
  await page.evaluate(() => { document.querySelector('.lang-btn[data-lang="id"]')?.click(); });
  await new Promise(r => setTimeout(r, 1100));
  const d = await page.evaluate(() => {
    const de = document.documentElement;
    const intro = document.querySelector('.obi, .tld, .tdl, [class*="intro-overlay"]');
    return {
      hero: document.querySelector('.hero h1')?.textContent.trim().slice(0, 46),
      overflowX: Math.max(de.scrollWidth, document.body.scrollWidth) - window.innerWidth,
      introVisible: intro ? getComputedStyle(intro).display !== 'none' && intro.getBoundingClientRect().height > 50 : false,
      announce: document.querySelector('.announcement span[data-i18n]')?.textContent.trim().slice(0, 40)
    };
  });
  out.push(`ID ${w}px: overflowX=${d.overflowX} introVisible=${d.introVisible} hero="${d.hero}"`);
  await page.screenshot({ path: `_id3-${w}.png`, clip: { x: 0, y: 0, width: w, height: Math.min(820, w < 700 ? 800 : 900) } });
}
console.log(out.join('\n'));
await browser.close();
console.log('DONE');
