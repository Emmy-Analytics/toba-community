/* Debug 3: dumping computed rules dari CSSOM via getMatchedCSSRules workaround */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));
  const data = await page.evaluate(() => {
    const el = document.querySelector('.hero-cut-slideshow .hero-cut-img.slot-b') ||
      document.querySelector('.hero-cut-slideshow img');
    if (!el) return { err: 'no el' };
    const cs = getComputedStyle(el);
    return {
      cls: el.className,
      width: cs.width, maxWidth: cs.maxWidth, maxHeight: cs.maxHeight,
      gridColumn: cs.gridColumn, gridRow: cs.gridRow, gridColStart: cs.gridColumnStart,
      height: cs.height, opacity: cs.opacity
    };
  });
  console.log(JSON.stringify(data, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
