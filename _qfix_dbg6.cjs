/* Debug 6: fetch style.css langsung, parse manual rules untuk hero-cut grid-template-columns */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const css = await page.evaluate(async () => {
    const res = await fetch('style.css');
    return await res.text();
  });
  /* cari semua occurrence grid-template-columns dalam konteks hero-cut */
  const re = /([^{}]*hero-cut[^{}]*)\{([^}]*)\}/g;
  let m; const hits = [];
  while ((m = re.exec(css))) {
    if (/grid-template-columns/.test(m[2])) hits.push({ sel: m[1].trim().slice(-120), cols: m[2].match(/grid-template-columns:[^;]+;/)[0] });
  }
  console.log(JSON.stringify(hits, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
