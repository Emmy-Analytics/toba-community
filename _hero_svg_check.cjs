const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const results = {};
  for (const vp of [{ width: 1440, height: 900, tag: 'desktop' }, { width: 390, height: 844, tag: 'mobile' }]) {
    await page.setViewport(vp);
    await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'), { waitUntil: 'networkidle2', timeout: 60000 });
    await page.evaluate(() => { const b = document.querySelector('#introSkip, .intro-skip, [data-intro-skip]'); if (b) b.click(); });
    await new Promise(r => setTimeout(r, 25000)); // wait API + slow fades (big lane delay 400 + fade 2400)
    results[vp.tag] = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('.hero-cut-img')];
      const box = document.querySelector('#heroCutShow').getBoundingClientRect();
      return {
        count: imgs.length,
        on: imgs.filter(i => i.classList.contains('cut-on')).length,
        imgs: imgs.map(i => {
          const r = i.getBoundingClientRect();
          return { natural: i.naturalWidth + 'x' + i.naturalHeight, src: (i.currentSrc||'').slice(8, 60), w: Math.round(r.width), h: Math.round(r.height), visible: i.classList.contains('cut-on'), overlappingText: false };
        }),
        boxH: Math.round(box.height)
      };
    });
    await page.screenshot({ path: '_hero_' + vp.tag + '.png' });
  }
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
})();
