/* Debug 29 — tambahkan kembali anak satu per satu, cari anak yang menyebabkan 9-track */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  const d = await page.evaluate(() => {
    const box = document.querySelector('.hero-cut-slideshow');
    const kids = [...box.children];
    kids.slice(1).forEach(k => k.remove());
    const out = [];
    for (let i = 1; i < kids.length; i++) {
      const k = kids[i];
      box.appendChild(k);
      const c = getComputedStyle(box).gridTemplateColumns;
      const tracks = c.split(' ').length;
      out.push({ i, cls: k.className.replace('hero-cut-img', '').trim(), tracks, cols: c });
      if (tracks > 3) break;
    }
    return out;
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
