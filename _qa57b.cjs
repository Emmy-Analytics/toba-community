const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html'];
  for (const pg of pages) {
    await p.goto('http://localhost:8099/' + pg, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(500);
    await p.evaluate(() => { document.querySelector('.site-footer').scrollIntoView({ block: 'end' }); });
    await sleep(300);
    const f = await p.$('.site-footer');
    await f.screenshot({ path: `_qa57b_footer_${pg.replace('.html', '')}.png` });
  }
  // cutout rotation full cycle
  await p.setViewport({ width: 390, height: 844, isMobile: true });
  await p.goto('http://localhost:8099/index.html', { waitUntil: 'networkidle2' });
  await sleep(800);
  const seq = [];
  let last = null;
  const t0 = Date.now();
  while (Date.now() - t0 < 32000) {
    await sleep(400);
    const s = await p.evaluate(() => {
      const m = document.querySelector('#heroCutShow .cut-main');
      const ball = document.querySelector('#heroCutShow .cut-ball');
      return { main: m ? m.src.split('/').pop() : null, ball: ball ? true : false, ts: Date.now() };
    });
    if (s.main !== last) { seq.push({ main: s.main, ball: s.ball, at: ((s.ts - t0) / 1000).toFixed(1) + 's' }); last = s.main; }
  }
  console.log(JSON.stringify({ rotation: seq }, null, 1));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
