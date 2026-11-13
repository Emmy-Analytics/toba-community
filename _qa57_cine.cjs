const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  const out = {};
  const measure = () => p.evaluate(() => {
    return [...document.querySelectorAll('.cine-g-row')].map(r => {
      const tr = r.querySelector('.cine-g-track');
      const seqs = tr.querySelectorAll('.cine-g-seq');
      return {
        cards: seqs[0].children.length, seqs: seqs.length,
        seqW: Math.round(seqs[0].getBoundingClientRect().width),
        totalW: tr.scrollWidth, vw: window.innerWidth,
        fills: tr.scrollWidth >= window.innerWidth * 2
      };
    });
  });
  for (const [w, h, tag] of [[1366, 900, 'desk'], [768, 1024, 'tab'], [390, 844, 'm390']]) {
    await p.setViewport({ width: w, height: h, isMobile: w < 800 });
    await p.goto('http://localhost:8099/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
    await p.evaluate(() => { const g = document.querySelector('.cine-gallery'); g.scrollIntoView(); });
    await sleep(2000);
    out[tag] = await measure();
    const g = await p.$('.cine-gallery');
    await g.screenshot({ path: `_qa57_cine_${tag}.png` });
    await sleep(3500);
    await g.screenshot({ path: `_qa57_cine_${tag}_c2.png` });
    await sleep(3500);
    await g.screenshot({ path: `_qa57_cine_${tag}_c3.png` });
  }
  await p.setViewport({ width: 390, height: 844, isMobile: true });
  await p.goto('http://localhost:8099/index.html', { waitUntil: 'networkidle2' });
  out.noHOverflow = await p.evaluate(() => document.documentElement.scrollWidth <= 391);
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
