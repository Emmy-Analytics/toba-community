/* Debug 26 — PASTI: apakah img punya overflow atau attribute width=0? */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const d = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('.hero-cut-img')].slice(0, 4);
    return imgs.map(im => ({
      cls: im.className.replace('hero-cut-img', '').trim(),
      attrs: [...im.attributes].map(a => a.name + '=' + a.value).join(' '),
      src: decodeURIComponent((im.src || '').split('/').pop()),
      complete: im.complete, nw: im.naturalWidth
    }));
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
