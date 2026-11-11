/* cari penyebab horizontal scroll di partnership.html @390px */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.evaluateOnNewDocument(() => localStorage.setItem('toba-lang', 'id'));
  await p.goto('http://localhost:8099/partnership.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  const culprits = await p.evaluate(() => {
    const out = [];
    const vw = document.documentElement.clientWidth;
    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 || r.left < -2) out.push({ tag: el.tagName, cls: String(el.className).slice(0, 50), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) });
    });
    return out.slice(0, 15);
  });
  console.log(JSON.stringify(culprits, null, 1));
  await b.close();
})();
