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
  await new Promise(r => setTimeout(r, 20000));
  const st = await page.evaluate(() => {
    // re-run composition manually to see what happens
    const box = document.getElementById('heroCutShow');
    const cache = JSON.parse(sessionStorage.getItem('tobaHeroCache.v2') || 'null');
    return { cachedCount: cache ? cache.photos.length : 0, urls: cache ? cache.photos.slice(0, 3).map(p => p.url.slice(8, 70)) : [] };
  });
  console.log(JSON.stringify(st, null, 1));
  await browser.close();
})();
