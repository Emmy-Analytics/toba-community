/* Debug 19 — resolve kolom 9-track: beri kelas test ke box dan coba override dengan attribute style yang lebih kuat */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const d = await page.evaluate(() => {
    const box = document.querySelector('.hero-cut-slideshow');
    /* temukan node yang MATCH selector 9-track: asumsinya dia punya class hero-slot-grid? log className */
    /* test: apakah rule 9-col cocok dengan elemen ini? ubah atribut untuk menghindari match */
    const cls = box.className;
    box.className = '';       /* buang semua class */
    const colsNoClass = getComputedStyle(box).gridTemplateColumns;
    box.className = cls;
    /* rebuild semua kelas satu per satu untuk tahu yang pemicu */
    const parts = cls.split(/\s+/).filter(Boolean);
    let culprit = null;
    for (const p of parts) {
      box.className = p;
      const c = getComputedStyle(box).gridTemplateColumns;
      if (c.includes('45.6875')) culprit = p;
    }
    box.className = cls;
    return { cls, colsNoClass, culprit };
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
