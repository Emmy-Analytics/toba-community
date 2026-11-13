const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, isMobile: true });
  const errors = [];
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  p.on('pageerror', e => errors.push('PAGEERROR: ' + e.message.slice(0, 200)));
  await p.goto('http://localhost:8099/index.html', { waitUntil: 'networkidle2' });
  await sleep(1000);
  const state = await p.evaluate(() => {
    const box = document.getElementById('heroCutShow');
    const tr = window.__probe || {};
    return { bound: box ? box.dataset.cutBound : null, imgs: box ? box.children.length : -1, reduce: matchMedia('(prefers-reduced-motion: reduce)').matches };
  });
  // hook into advance via monkeypatching not possible; instead observe over 30s
  const seq = [];
  let last = null; const t0 = Date.now();
  while (Date.now() - t0 < 32000) {
    await sleep(300);
    const s = await p.evaluate(() => {
      const m = document.querySelector('#heroCutShow .cut-main');
      return m ? m.src.split('/').pop() : null;
    });
    if (s !== last) { seq.push({ main: s, at: ((Date.now() - t0) / 1000).toFixed(1) + 's' }); last = s; }
  }
  console.log(JSON.stringify({ state, seq, errors }, null, 1));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
