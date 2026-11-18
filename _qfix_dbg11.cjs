/* Debug 11 — cek parentElement sebenarnya dari img (mungkin box bukan langsung parent?) */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  const data = await page.evaluate(() => {
    const img = document.querySelector('.hero-cut-img.cut-p1');
    const chain = [];
    let n = img;
    while (n && n !== document.body) {
      const r = n.getBoundingClientRect();
      chain.push({ tag: n.tagName, cls: String(n.className).slice(0, 60), w: Math.round(r.width), disp: getComputedStyle(n).display, pos: getComputedStyle(n).position });
      n = n.parentElement;
    }
    return chain;
  });
  console.log(JSON.stringify(data, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
