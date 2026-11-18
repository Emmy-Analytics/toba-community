/* Debug 24 — box-sizing/global hack: coba set box width 100% + display override; ukur kolom via box.getBoundingClientRect per cell probe */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const d = await page.evaluate(() => {
    const box = document.querySelector('.hero-cut-slideshow');
    const probe1 = document.createElement('div');
    probe1.style.gridColumn = '1'; probe1.style.gridRow = '1';
    const probe3 = document.createElement('div');
    probe3.style.gridColumn = '3'; probe3.style.gridRow = '1';
    box.appendChild(probe1); box.appendChild(probe3);
    const r1 = probe1.getBoundingClientRect();
    const r3 = probe3.getBoundingClientRect();
    probe1.remove(); probe3.remove();
    const img = document.querySelector('.hero-cut-img.cut-p1');
    return {
      p1: { x: Math.round(r1.x), w: Math.round(r1.width) },
      p3: { x: Math.round(r3.x), w: Math.round(r3.width) },
      imgGridColumn: getComputedStyle(img).gridColumn,
      imgGridRow: getComputedStyle(img).gridRow,
      imgGridArea: getComputedStyle(img).gridArea
    };
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
