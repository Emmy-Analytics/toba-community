/* Debug 28 — kolom track tersembunyi 6 kolom kosong (0 0 0) → kemungkinan dari grid
   AUTO-FLOW kolom yang disebabkan items dengan grid-column bernama line. Track 9
   = items auto-placed ke kolom>3 menciptakan implicit tracks? Test: hapus semua
   anak kecuali 1, ukur kolom. */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  const d = await page.evaluate(() => {
    const box = document.querySelector('.hero-cut-slideshow');
    const before = getComputedStyle(box).gridTemplateColumns;
    /* simpan & hapus semua anak kecuali pertama */
    const kids = [...box.children];
    kids.slice(1).forEach(k => k.remove());
    const after = getComputedStyle(box).gridTemplateColumns;
    kids.slice(1).forEach(k => box.appendChild(k));
    return { before, afterOnlyFirst: after, kidsCount: kids.length };
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
