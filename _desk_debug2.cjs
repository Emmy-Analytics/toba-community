const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', m => { const t = m.text(); if (!t.includes('attribute d')) console.log('[pg]', t.slice(0, 250)); });
  page.on('pageerror', e => console.log('[PAGEERR]', e.message.slice(0, 400)));
  await page.evaluateOnNewDocument(() => {
    window.__imgs = [];
    const O = window.Image;
    window.Image = function (...a) {
      const im = new O(...a);
      let lastSrc = '';
      im.addEventListener('load', () => { window.__imgs.push({ ok: true, file: decodeURIComponent((lastSrc || '').split('/').pop()).slice(0, 60) }); });
      im.addEventListener('error', () => { window.__imgs.push({ err: true, file: decodeURIComponent((lastSrc || '').split('/').pop()).slice(0, 60) }); });
      const d = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
      Object.defineProperty(im, 'src', { set(v) { lastSrc = v; d.set.call(this, v); }, get() { return d.get.call(this); } });
      return im;
    };
  });
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { sessionStorage.clear(); const b = document.querySelector('#introSkip,.intro-skip,[data-intro-skip]'); if (b) b.click(); });
  await new Promise(r => setTimeout(r, 25000));
  const log = await page.evaluate(() => window.__imgs.slice(0, 40));
  console.log(JSON.stringify(log, null, 1));
  await browser.close();
})();
