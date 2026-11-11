/* QA akhir PROMPT 19-22 + verifikasi perbaikan */
const { execSync } = require('child_process');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));

  const BASE = 'http://localhost:8099/';
  const out = { consoleErrors: errs, pages: {} };

  // 1. Cek mojibake di <title> semua halaman (id + en)
  for (const f of ['index', 'tobaladies', 'tobadeli', 'events', 'merchandise', 'gallery', 'partnership']) {
    await page.goto(BASE + f + '.html', { waitUntil: 'networkidle2' });
    const title = await page.title();
    const bad = /[ÃÂ]|�/.test(title);
    out.pages[f] = { title, mojibake: bad };
  }

  // 2. Homepage: verifikasi grid foto komunitas (PROMPT 19)
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await page.evaluate(() => { sessionStorage.setItem('toba-intro-seen', '1'); localStorage.setItem('toba-lang', 'id') });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  const grid = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('.community-photo-grid img')];
    return { count: imgs.length, loaded: imgs.filter(i => i.complete && i.naturalWidth > 0).length };
  });
  out.homeCommunityPhotos = grid;

  // screenshot desktop home
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.community-photo-grid')?.offsetTop - 120 || 0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '_p19_grid.png' });

  // 3. Mobile QA homepage + tobadeli + tobaladies
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: '_p19_home_mobile.png' });
  for (const f of ['tobadeli', 'tobaladies']) {
    await page.goto(BASE + f + '.html', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));
    const hs = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    out.pages[f].mobileHScroll = hs;
    await page.screenshot({ path: '_p22_' + f + '_mobile.png' });
  }

  out.consoleErrors = errs;
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
