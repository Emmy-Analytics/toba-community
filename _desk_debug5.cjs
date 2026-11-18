const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', m => { const t = m.text(); if (!t.includes('attribute d')) console.log('[pg]', t.slice(0, 250)); });
  page.on('pageerror', e => console.log('[PAGEERR]', e.message.slice(0, 400)));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { sessionStorage.clear(); const b = document.querySelector('#introSkip,.intro-skip,[data-intro-skip]'); if (b) b.click(); });
  await new Promise(r => setTimeout(r, 25000));
  // does document.body.dataset.page exist? is the IIFE's PAGE check passing?
  const probe = await page.evaluate(() => ({ page: document.body.dataset.page, box: !!document.getElementById('heroCutShow') }));
  console.log('probe:', JSON.stringify(probe));
  // manually re-run hero fetch to see what list is validated and what images fail
  const res2 = await page.evaluate(() => new Promise(done => {
    const cache = JSON.parse(sessionStorage.getItem('tobaHeroCache.v2'));
    if (!cache) { done('no cache'); return; }
    let left = cache.photos.length; const r = [];
    cache.photos.forEach(p => {
      const im = new Image();
      im.onload = () => { r.push('OK ' + (p.title || '') + ' ' + im.naturalWidth + 'x' + im.naturalHeight); if (--left === 0) done(r.join('\n')); };
      im.onerror = () => { r.push('ERR ' + (p.title || '') + ' ' + p.url.slice(8, 80)); if (--left === 0) done(r.join('\n')); };
      im.src = p.url;
    });
    setTimeout(() => done('TIMEOUT leftover=' + left + '\n' + r.join('\n')), 20000);
  }));
  console.log(res2);
  await browser.close();
})();
