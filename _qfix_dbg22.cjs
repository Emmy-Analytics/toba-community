/* Debug 22 — fetch pakai URL absolut file:// dan baca text style.css dari halaman */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  const d = await page.evaluate(async () => {
    const url = document.querySelector('link[href*="style.css"]').href;
    const r = await fetch(url);
    const txt = await r.text();
    let i = -1; const idxs = [];
    while ((i = txt.indexOf('hero-cut-slideshow', i + 1)) >= 0) idxs.push(i);
    return { url, len: txt.length, occurrences: idxs.length };
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
