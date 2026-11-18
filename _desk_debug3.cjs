const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', m => { const t = m.text(); if (!t.includes('attribute d')) console.log('[pg]', t.slice(0, 250)); });
  page.on('pageerror', e => console.log('[PAGEERR]', e.message.slice(0, 400)));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { sessionStorage.clear(); });
  // capture responses to drive.usercontent
  const hits = [];
  page.on('response', async r => { const u = r.url(); if (u.includes('usercontent') || u.includes('thumbnail')) { let ct = ''; try { ct = r.headers()['content-type'] || ''; } catch (e) { } hits.push(r.status() + ' ' + ct.slice(0, 30) + ' ' + decodeURIComponent(u).slice(30, 110)); } });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { sessionStorage.clear(); });
  await new Promise(r => setTimeout(r, 25000));
  console.log('HITS:\n' + hits.join('\n'));
  await page.screenshot({ path: '_hero_desktop.png' });
  const n = await page.evaluate(() => document.getElementById('heroCutShow').children.length);
  console.log('imgs:', n);
  await browser.close();
})();
