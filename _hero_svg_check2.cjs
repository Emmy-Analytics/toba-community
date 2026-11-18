const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERR: ' + e.message));
  page.on('console', m => { const t = m.text(); if (t.includes('TOBA Hero')) console.log('[console]', t); });

  const results = {};
  for (const vp of [{ width: 1440, height: 900, tag: 'desktop' }, { width: 390, height: 844, tag: 'mobile' }]) {
    await page.setViewport(vp);
    await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'), { waitUntil: 'networkidle2', timeout: 60000 });
    // skip intro if present
    await page.evaluate(() => { const b = document.querySelector('#introSkip, .intro-skip, [data-intro-skip]'); if (b) b.click(); });
    await new Promise(r => setTimeout(r, 9000)); // wait for API + fade-in
    await page.setRequestInterception(true);
    page.on('request', r => {
      if (r.url().includes('drive.usercontent.google.com') && r.url().includes('export=view')) {
        const id = r.url().match(/id=([^&]+)/)[1];
        r.respond({ status: 302, headers: { location: 'https://lh3.googleusercontent.com/d/' + id } }).catch(() => {});
      } else if (r.url().includes('drive.google.com/thumbnail')) {
        const id = r.url().match(/id=([^&]+)/)[1];
        r.respond({ status: 302, headers: { location: 'https://lh3.googleusercontent.com/d/' + id } }).catch(() => {});
      } else {
        r.continue().catch(() => {});
      }
    });

    results[vp.tag] = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('.hero-cut-img')];
      return imgs.map(i => {
        const r = i.getBoundingClientRect();
        return {
          src: i.currentSrc || i.src,
          natural: i.naturalWidth + 'x' + i.naturalHeight,
          rendered: Math.round(r.width) + 'x' + Math.round(r.height),
          complete: i.complete, visible: i.classList.contains('cut-on'),
          cls: i.className
        };
      });
    });
    await page.screenshot({ path: '_hero_' + vp.tag + '.png' });
  }

  console.log(JSON.stringify(results, null, 1));
  console.log('errors:', errors);
  await browser.close();
})();
