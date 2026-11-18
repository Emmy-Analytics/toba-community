/* Debug 2: rect + computed opacity tiap item */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 6500));
  const data = await page.evaluate(() => {
    const b = document.querySelector('.hero-cut-slideshow');
    const bs = getComputedStyle(b);
    return {
      boxRect: (r => ({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }))(b.getBoundingClientRect()),
      cols: bs.gridTemplateColumns, display: bs.display,
      items: [...b.querySelectorAll('img')].slice(0, 6).map(im => {
        const r = im.getBoundingClientRect(); const cs = getComputedStyle(im);
        return {
          src: decodeURIComponent((im.src || '').split('/').pop()), cls: im.className.replace('hero-cut-img', '').trim(),
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          opacity: cs.opacity, display: cs.display, on: im.classList.contains('cut-on')
        };
      })
    };
  });
  console.log(JSON.stringify(data, null, 1));
  await page.screenshot({ path: '_qa_dbg2_393.png' });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
