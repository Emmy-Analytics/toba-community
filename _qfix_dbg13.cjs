/* Debug 13 — default width rule yang match: dump semua selector dari sheet yang match img.cut-p1 */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  /* pakai serverless: navigate ke file langsung css */
  await page.setRequestInterception(false);
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  const matches = await page.evaluate(() => {
    const img = document.querySelector('.hero-cut-img.cut-p1');
    /* Webkit-only API: window.getMatchedCSSRules sudah dihapus. Fallback:
       gunakan CSS.highlights? Tidak. Gunakan devtools protocol via console? Bukan.
       Alternatif: iterate document.styleSheets dengan try — beberapa file:// diblokir.
       Gunakan pendekatan: fetch css text via XHR (same-origin file:// biasanya ditolak).
       Terakhir: buat elemen tes dengan selector rules yang dicurigai. */
    const probes = {};
    const probes2 = [
      ['.hero-cut-slideshow .hero-cut-img.slot-b', 'p1'],
      ['.hero-cut-slideshow .hero-cut-img.cut-p1', 'p2'],
      ['.hero-cut-desktop .hero-cut-img.slot-b', 'p3'],
      ['.hero-cut-img.cut-p1', 'p4']
    ];
    probes2.forEach(([sel, key]) => {
      try { probes[key] = window.matchMedia('(width:393px)').matches ? sel : sel; } catch (e) { }
    });
    return probes;
  });
  console.log(matches);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
