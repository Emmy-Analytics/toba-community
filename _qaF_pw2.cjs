const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.goto('file://' + process.cwd().replace(/\\/g, '/') + '/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  const el = await page.$('.pw-credit');
  if (el) {
    await el.screenshot({ path: '_qa_pw_credit_full.png' });
    // computed style check
    const info = await page.evaluate(() => {
      const svg = document.querySelector('.pw-credit .pw-ig');
      if (!svg) return { found: false };
      const cs = getComputedStyle(svg);
      const r = svg.getBoundingClientRect();
      return { found: true, w: r.width, h: r.height, color: cs.color, display: cs.display, opacity: cs.opacity, visibility: cs.visibility, html: svg.outerHTML.slice(0, 400) };
    });
    console.log(JSON.stringify(info, null, 1));
  } else { console.log('NO .pw-credit FOUND'); }
  await browser.close();
})();
