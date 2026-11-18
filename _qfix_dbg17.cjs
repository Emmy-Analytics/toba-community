/* Debug 17 — computed grid-template-columns pada resolution berbeda (aktual match) */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (const vw of [355, 375, 393, 430, 761]) {
    await page.setViewport({ width: vw, height: 900 });
    await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));
    const d = await page.evaluate(() => {
      const box = document.querySelector('.hero-cut-slideshow');
      const img = document.querySelector('.hero-cut-img.cut-p1');
      return { cols: getComputedStyle(box).gridTemplateColumns, imgW: Math.round(img.getBoundingClientRect().width) };
    });
    console.log(vw, JSON.stringify(d));
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
