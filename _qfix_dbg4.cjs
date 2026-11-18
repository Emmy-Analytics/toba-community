/* Debug 4: periksa kolom grid aktual + lebar item */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));
  const data = await page.evaluate(() => {
    const img = document.querySelector('.hero-cut-img.cut-p1');
    const box = document.querySelector('.hero-cut-slideshow');
    const cs = getComputedStyle(img);
    return {
      imgSpecifiedWidth: cs.width, imgSpecifiedMaxW: cs.maxWidth,
      imgMaxHeight: cs.maxHeight, imgAspectRatio: cs.aspectRatio,
      gridColStart: cs.gridColumnStart, gridColEnd: cs.gridColumnEnd,
      gridRowStart: cs.gridRowStart,
      justifySelf: cs.justifySelf, alignSelf: cs.alignSelf,
      overflowVisible: getComputedStyle(box).overflow
    };
  });
  console.log(JSON.stringify(data, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
