const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', m => { const t = m.text(); if (!t.includes('attribute d')) console.log('[pg]', t.slice(0, 250)); });
  page.on('pageerror', e => console.log('[PAGEERR]', e.message.slice(0, 400)));
  const reqs = [];
  page.on('request', r => { const u = r.url(); if (u.includes('usercontent') || u.includes('thumbnail')) reqs.push('REQ ' + decodeURIComponent(u).slice(30, 110)); });
  page.on('requestfailed', r => { const u = r.url(); if (u.includes('usercontent') || u.includes('thumbnail')) reqs.push('FAIL ' + r.failure().errorText + ' ' + decodeURIComponent(u).slice(30, 110)); });
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { sessionStorage.clear(); });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { sessionStorage.clear(); });
  await new Promise(r => setTimeout(r, 30000));
  console.log('REQS:\n' + (reqs.join('\n') || '(none — validatePhotos never even fetched)'));
  const st = await page.evaluate(() => {
    const cache = JSON.parse(sessionStorage.getItem('tobaHeroCache.v2') || 'null');
    return { cache: cache ? cache.photos.length : 0, imgs: document.getElementById('heroCutShow').children.length };
  });
  console.log('state:', JSON.stringify(st));
  await page.screenshot({ path: '_hero_desktop.png' });
  await browser.close();
})();
