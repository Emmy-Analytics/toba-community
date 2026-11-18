const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const urls = [
    'https://drive.usercontent.google.com/download?id=12GguSs1qx9r1GruzeBfRcDCsusW9HxGt&export=view',
    'https://lh3.googleusercontent.com/d/12GguSs1qx9r1GruzeBfRcDCsusW9HxGt'
  ];
  for (const u of urls) {
    const r = await page.evaluate(u => new Promise(res => {
      fetch(u, { mode: 'no-cors' }).then(r => {
        r.blob().then(b => b.arrayBuffer().then(a => {
          const bytes = new Uint8Array(a);
          let head = '';
          for (let i = 0; i < Math.min(60, bytes.length); i++) head += String.fromCharCode(bytes[i]);
          res('no-cors: bytes=' + b.size + ' head=[' + head.replace(/[^\x20-\x7E]/g, '.') + ']');
        }));
      }).catch(e => res('ERR ' + e.message));
    }), u);
    console.log(u.slice(8, 40), '->', r);
  }
  await browser.close();
})();
