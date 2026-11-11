/* QA MASTER PROMPT 1-17: console errors, i18n, watermark mobile, layout widths. */
const puppeteer = require('puppeteer');
(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const report = { consoleErrors: [], pages: {} };
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text().slice(0, 200)) });
  page.on('pageerror', e => report.consoleErrors.push('PAGEERROR: ' + String(e).slice(0, 300)));

  const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html'];

  for (const lang of ['id', 'en']) {
    for (const p of pages) {
      const key = p + '@' + lang;
      report.pages[key] = {};
      await page.evaluateOnNewDocument(l => localStorage.setItem('toba-lang', l), lang);
      await page.goto('http://localhost:8099/' + p, { waitUntil: 'networkidle2', timeout: 30000 });
      await wait(900);
      // intro skip jika muncul
      await page.click('.obi-skip').catch(() => { });
      await wait(600);
      report.pages[key].title = await page.title();
      // app terisi?
      report.pages[key].appChars = await page.$eval('#app', el => el.textContent.trim().length);
      // horizontal scroll check
      report.pages[key].hScroll = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      // cek watermark croc di mobile (hanya mobile viewport)
      const vp = page.viewport();
      if (vp.width <= 430) {
        report.pages[key].crocVisible = await page.evaluate(() => {
          const el = document.querySelector('.hero-croc img');
          if (!el) return 'NO-EL';
          const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
          return { opacity: cs.opacity, w: Math.round(r.width), inViewport: r.right > 0 && r.left < innerWidth };
        });
      }
      // date badge colors
      report.pages[key].badge = await page.evaluate(() => {
        const b = document.querySelector('.date-badge'); if (!b) return null;
        return { num: getComputedStyle(b).color, sub: getComputedStyle(b.querySelector('small') || b).color };
      });
      // brand-mark transparan
      report.pages[key].brandBg = await page.evaluate(() => getComputedStyle(document.querySelector('.brand-mark')).backgroundColor);
    }
  }

  // language switch live test: index.html klik ID lalu cek teks berubah tanpa reload
  await page.setViewportSize ? null : null;
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:8099/index.html', { waitUntil: 'networkidle2' });
  await page.click('.obi-skip').catch(() => { });
  await wait(400);
  const before = await page.$eval('#app', el => el.textContent.slice(0, 400));
  await page.click('.lang-btn[data-lang="id"]').catch(e => report.consoleErrors.push('langSwitch: ' + e.message));
  await wait(700);
  const after = await page.$eval('#app', el => el.textContent.slice(0, 400));
  report.langSwitchChanged = before !== after;
  report.appStillFilled = (await page.$eval('#app', el => el.children.length)) > 3;

  // intro screenshot desktop + mobile
  await page.goto('http://localhost:8099/index.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await wait(1500);
  await page.screenshot({ path: '_qa-intro-desktop.png' });
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => { sessionStorage.clear(); localStorage.removeItem('toba-intro-seen') });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await wait(1500);
  await page.screenshot({ path: '_qa-intro-mobile.png' });

  // halaman tobadeli/tobaladies mobile screenshot
  for (const [p, name] of [['tobadeli.html', 'deli'], ['tobaladies.html', 'ladies']]) {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:8099/' + p, { waitUntil: 'networkidle2' });
    await page.click('.obi-skip').catch(() => { });
    await wait(1200);
    await page.screenshot({ path: `_qa-${name}-mobile.png` });
  }

  console.log(JSON.stringify(report, null, 1));
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1) });

