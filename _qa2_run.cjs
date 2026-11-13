/* QA script — toba community */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html'];
  const results = [];
  for (const p of pages) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:8099/' + p, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2500));
    const r = await page.evaluate(() => {
      const out = { backTop: !!document.getElementById('backTop'), hscroll: document.documentElement.scrollWidth - document.documentElement.clientWidth, brokenImgs: 0, joinModal: !!document.getElementById('joinModal'), title: document.title.slice(0, 40) };
      document.querySelectorAll('img').forEach(i => { if (i.complete && i.naturalWidth === 0 && !i.closest('.img-broken')) out.brokenImgs++; });
      return out;
    });
    r.page = p; r.errors = errors.slice(0, 3);
    results.push(r);
    await page.screenshot({ path: '_qa2_' + p.replace('.html', '') + '_m.png', fullPage: false });
    await page.close();
  }
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
})();
