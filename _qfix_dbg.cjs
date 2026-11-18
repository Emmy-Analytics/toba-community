/* Debug: cek state tiap item hero + console log */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const logs = [];
  page.on('console', m => logs.push(m.type() + ': ' + m.text()));
  page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 9000));
  const data = await page.evaluate(() => {
    const b = document.querySelector('.hero-cut-slideshow');
    return [...b.querySelectorAll('img')].slice(0, 6).map(im => ({
      src: (im.src || '').split('/').pop(),
      cls: im.className.split(' ').filter(c => c !== 'hero-cut-img').join(' '),
      complete: im.complete, nw: im.naturalWidth, on: im.classList.contains('cut-on'),
      size: im.dataset.size || '', slot: im.dataset.slot || ''
    }));
  });
  console.log(JSON.stringify(data, null, 1));
  console.log('--- console ---');
  logs.slice(0, 40).forEach(l => console.log(l));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
