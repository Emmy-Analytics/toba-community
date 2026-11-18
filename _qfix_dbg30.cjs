/* Debug 30 — foto 5: cut-p6 tanpa slot → rule fallback `grid-column: 2; grid-row: 1`
   TAPI juga semua foto lama (tanpa data-size) masuk. Kenapa membuat track ke-4?
   Mungkin karena auto-placement ke row 1, tapi yang lebih penting: rule
   `.hero-cut-img.cut-p6 { width: clamp(...)}` — dan bukan data-size → jadi tampil di
   kolom 2 sebagai foto kedua → menciptakan implicit column? Seharusnya grid-column:2
   tetap. Log computed grid-column & grid-row for cut-p6. */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  const d = await page.evaluate(() => {
    const noSlot = [...document.querySelectorAll('.hero-cut-img')].filter(im => !im.dataset.slot && !im.className.includes('cut-ball'));
    return noSlot.slice(0, 6).map(im => {
      const cs = getComputedStyle(im);
      return { cls: im.className.replace('hero-cut-img', '').trim(), gridCol: cs.gridColumn, gridRow: cs.gridRow, size: im.dataset.size, slot: im.dataset.slot, w: Math.round(im.getBoundingClientRect().width), display: cs.display };
    });
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
