/* Debug 31 — korelasi: kenapa 12 foto semua di DOM padahal CSS menyembunyikan yang non-slot?
   Cek jumlah anak pada load pertama DAN apakah mereka menyebabkan grid 9-track.
   Perbaiki dengan: hanya foto yang sedang aktif ditampilkan. Cek track count
   ketika non-slot disembunyikan pakai display:none (bukan hanya overflow hidden). */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  const d = await page.evaluate(() => {
    const box = document.querySelector('.hero-cut-slideshow');
    /* Force display:none untuk semua foto tanpa slot & bukan bola */
    [...box.querySelectorAll('.hero-cut-img')].forEach(im => {
      if (!im.dataset.slot && !im.className.includes('cut-ball')) im.style.display = 'none';
    });
    const colsAfter = getComputedStyle(box).gridTemplateColumns;
    const img1w = Math.round(document.querySelector('.hero-cut-img.cut-p1').getBoundingClientRect().width);
    return { colsAfter, img1w };
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
