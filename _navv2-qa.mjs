/* Mega menu v2 QA: editorial panel, mobile drawer, 8 breakpoints. */
import puppeteer from 'puppeteer';
const base = 'file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/';
const browser = await puppeteer.launch({ headless: 'new' });
const errors = [];
for (const [w, h] of [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [430, 932], [390, 844], [375, 812], [360, 780]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, isMobile: w < 500, hasTouch: w < 500 });
  page.on('pageerror', e => errors.push(w + ' ' + e.message));
  page.on('requestfailed', r => errors.push('REQFAIL ' + r.url().split('/').pop()));
  await page.goto(base + 'index.html', { waitUntil: 'load' });
  await page.evaluate(l => localStorage.setItem('toba-lang', l), 'id');
  await page.reload({ waitUntil: 'load' });
  await page.evaluate(() => { const s = document.querySelector('.obi-skip'); if (s) s.click(); });
  await new Promise(r => setTimeout(r, 700));

  if (w >= 1001) {
    await page.click('#navExplore');
    await new Promise(r => setTimeout(r, 500));
    const rep = await page.evaluate(() => {
      const m = document.getElementById('megaMenu'), d = document.documentElement;
      const r = m.getBoundingClientRect();
      const vis = document.querySelector('.mega-visual');
      return `open=${m.classList.contains('open')} w=${Math.round(r.width)} overflow=${r.right > innerWidth || d.scrollWidth > d.clientWidth + 1} photo=${!!vis && vis.getBoundingClientRect().height > 100}`;
    });
    if (w === 1440 || w === 768) await page.screenshot({ path: `_navv2-mega-${w}.png` });
    console.log(`[${w}] desktop: ${rep}`);
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  } else {
    await page.click('#menuToggle');
    await new Promise(r => setTimeout(r, 500));
    // open first group, then second — first must close (single-open rule)
    await page.evaluate(() => document.querySelectorAll('.mega-label')[0].click());
    await new Promise(r => setTimeout(r, 350));
    const one = await page.evaluate(() => [...document.querySelectorAll('.mega-group.open')].length);
    await page.evaluate(() => document.querySelectorAll('.mega-label')[1].click());
    await new Promise(r => setTimeout(r, 350));
    const two = await page.evaluate(() => {
      const opens = [...document.querySelectorAll('.mega-group.open')];
      return { n: opens.length, second: opens[0]?.querySelector('.mega-label').textContent.trim() };
    });
    const d = await page.evaluate(() => {
      const nav = document.getElementById('mainNav');
      const cta = nav.querySelector('.drawer-cta');
      const close = nav.querySelector('.drawer-close');
      return `overflowX=${document.documentElement.scrollWidth > document.documentElement.clientWidth + 1} cta=${!!cta && cta.getBoundingClientRect().bottom <= innerHeight + 60} closeBtn=${!!close} scrollable=${nav.scrollHeight > nav.clientHeight ? 'yes' : 'fit'}`;
    });
    if (w === 390 || w === 360) await page.screenshot({ path: `_navv2-mobile-${w}.png` });
    console.log(`[${w}] mobile: singleOpen first=${one} second=${two.n}(${two.second}) ${d}`);
    // close via close button
    await page.evaluate(() => document.querySelector('.drawer-close').click());
    await new Promise(r => setTimeout(r, 400));
    const closed = await page.evaluate(() => !document.getElementById('mainNav').classList.contains('open'));
    console.log(`[${w}] closeBtnWorks=${closed}`);
  }
  await page.close();
}
console.log('errors:', errors.length ? errors.join(' | ') : 'none');
await browser.close();

