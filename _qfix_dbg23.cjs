/* Debug 23 — layout detail kolom: cari yang 9-track. Coba hapus semua anak yang bukan slot/ball lalu ukur lagi. */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const d = await page.evaluate(() => {
    const box = document.querySelector('.hero-cut-slideshow');
    /* explicit grid-column dgn nama line tidak relevan. Coba analisis:
       kolom 9 = mungkin dari shorthand "grid" atau "grid-template". Log juga
       pseudo rule: .hero-cut-slideshow memiliki style gridTemplate? */
    const cs = getComputedStyle(box);
    const res = {
      gridTemplate: cs.gridTemplate,
      gridTemplateColumnsSpecified: cs.getPropertyValue('grid-template-columns')
    };
    /* mencoba meng-override dengan !important via stylesheet dinamis */
    const st = document.createElement('style');
    st.textContent = '.hero-cut-slideshow { grid-template-columns: 1fr 1.15fr 1fr !important; }';
    document.head.appendChild(st);
    res.afterOverride = getComputedStyle(box).gridTemplateColumns;
    res.imgWAfterOverride = Math.round(document.querySelector('.hero-cut-img.cut-p1').getBoundingClientRect().width);
    return res;
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
