/* Debug 18 — dump CSS box PADA MOBILE viewport (393): semua properti grid layout yang berbeda */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const d = await page.evaluate(() => {
    const box = document.querySelector('.hero-cut-slideshow');
    const cs = getComputedStyle(box);
    const keys = ['display', 'gridTemplateColumns', 'gridAutoColumns', 'gridTemplateRows', 'gridAutoRows', 'gridTemplateAreas', 'width', 'maxWidth', 'minWidth', 'gridColumnGap', 'columnGap', 'padding', 'margin', 'grid', 'gridArea', 'gridRow', 'gridColumn', 'placeItems', 'justifyContent', 'alignContent'];
    const o = {};
    keys.forEach(k => o[k] = cs[k]);
    return o;
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
