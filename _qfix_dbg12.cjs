/* Debug 12 — grid cols real + try re-setting via inline style pada parent */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  const data = await page.evaluate(() => {
    const box = document.querySelector('.hero-cut-slideshow');
    const img = document.querySelector('.hero-cut-img.cut-p1');
    const out = {};
    out.colsBefore = getComputedStyle(box).gridTemplateColumns;
    box.style.gridTemplateColumns = '1fr 1.15fr 1fr';
    out.colsForced = getComputedStyle(box).gridTemplateColumns;
    out.imgWAfterForceCols = Math.round(img.getBoundingClientRect().width);
    box.style.gridTemplateColumns = '';
    /* try removing the auto-placement collision: set img grid-column:2 explicitly */
    img.style.gridColumn = '2'; img.style.width = '100%';
    out.imgWAfterInline = Math.round(img.getBoundingClientRect().width);
    img.style.gridColumn = ''; img.style.width = '';
    return out;
  });
  console.log(JSON.stringify(data, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
