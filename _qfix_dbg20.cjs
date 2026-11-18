/* Debug 20 — cek rule pakai CSS.highlights trick: bikin elemen baru dengan kelas sama, bandingkan computed */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const d = await page.evaluate(() => {
    /* duplikat box dan letakkan di mana styles context mungkin berbeda */
    const orig = document.querySelector('.hero-cut-slideshow');
    const clone = orig.cloneNode(false);       /* tanpa children */
    clone.id = 'cloneCutShow';
    document.body.appendChild(clone);
    const cloneCols = getComputedStyle(clone).gridTemplateColumns;
    /* cut-off: kemungkinan rule ada tapi match berbeda → inspect via devtools protocol sudah dilakukan.
       Sekarang dump MediaList dari masing2 matched rule via CSSOM yang di fetch ulang */
    return fetch(document.querySelector('link[rel=stylesheet]').href)
      .then(r => r.text())
      .then(txt => {
        clone.remove();
        /* cari semua occurrence 'hero-cut-slideshow' */
        const idxs = [];
        let i = -1;
        while ((i = txt.indexOf('hero-cut-slideshow', i + 1)) >= 0) idxs.push(i);
        return { cloneCols, count: idxs.length, total: txt.length };
      });
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
