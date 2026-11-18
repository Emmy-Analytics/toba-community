/* Debug 10 — temukan rule dengan width:100% yang match slot-b tapi yang di-apply 0px.
   Gunakan getMatchedCSSRules tak tersedia → brute-force: coba set inline width dan lihat. */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  const data = await page.evaluate(() => {
    const img = document.querySelector('.hero-cut-img.cut-p1');
    const before = img.getBoundingClientRect().width;
    img.style.width = '100%';                      /* coba paksa */
    const after = img.getBoundingClientRect().width;
    const box = img.parentElement.getBoundingClientRect();
    img.style.width = '';
    return { before, after, boxW: box.width, boxLeft: box.x };
  });
  console.log(JSON.stringify(data, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
