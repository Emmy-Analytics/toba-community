const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const ids = ['12GguSs1qx9r1GruzeBfRcDCsusW9HxGt', '16bcF_sCuCr3KnOeM8F30KseNKQkzDyk_', '1wllX_VIZhFBdfQzc4UWVrsD8gIqfB186'];
  for (const id of ids) {
    for (const base of ['https://drive.usercontent.google.com/download?id=', 'https://drive.google.com/thumbnail?id=']) {
      const url = base + id + (base.includes('usercontent') ? '&export=view' : '&sz=w1600');
      const r = await page.evaluate(u => new Promise(res => {
        const im = new Image();
        im.onload = () => res('OK ' + im.naturalWidth + 'x' + im.naturalHeight);
        im.onerror = () => res('ERR');
        im.src = u;
        setTimeout(() => res('TIMEOUT'), 15000);
      }), url).catch(e => 'EXC ' + e.message);
      console.log(id.slice(0, 8), base.includes('usercontent') ? 'original ' : 'thumbnail', '->', r);
    }
  }
  await browser.close();
})();
