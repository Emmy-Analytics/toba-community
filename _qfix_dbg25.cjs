/* Debug 25 — Matikan semua stylesheet lain kecuali inline override penuh */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const d = await page.evaluate(() => {
    const box = document.querySelector('.hero-cut-slideshow');
    const img = document.querySelector('.hero-cut-img.cut-p1');
    /* disable font stylesheet saja sudah; periksa apakah rule yang match juga dari fonts? no.
       Ambil pendekatan: dump computed AFTER disabling link stylesheet dan pakai inline */
    document.querySelector('link[href*="style.css"]').disabled = true;
    box.style.cssText = 'display:grid !important; grid-template-columns:1fr 1.15fr 1fr; height:400px';
    img.style.cssText = 'grid-column:2; grid-row:1; width:100%; display:block';
    const w = Math.round(img.getBoundingClientRect().width);
    const cols = getComputedStyle(box).gridTemplateColumns;
    document.querySelector('link[href*="style.css"]').disabled = false;
    box.style.cssText = ''; img.style.cssText = '';
    return { withInlineOnly: { w, cols } };
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
