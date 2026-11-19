/* Verifikasi browser fitur Reviews TOBA — file sementara di _project_archive (dibersihkan setelah tes). */
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  const url = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2500));

  const check = async () => page.evaluate(() => ({
    btn: !!document.getElementById('reviewOpenBtn'),
    modal: !!document.getElementById('reviewModalWrap'),
    modalHidden: document.getElementById('reviewModalWrap')?.hidden,
    cards: document.querySelectorAll('.cine-rcard').length,
    consent: !!document.getElementById('revConsent'),
    count: document.getElementById('revCount')?.textContent,
    stars: document.querySelectorAll('.rev-star').length,
    groupOptions: [...document.querySelectorAll('#revGroup option')].map(o => o.value),
    heroIntact: !!document.querySelector('.cine-hero, .hero, #hero, .cine-rheadline')
  }));
  console.log('initial:', JSON.stringify(await check()));

  // buka modal
  await page.click('#reviewOpenBtn');
  await new Promise(r => setTimeout(r, 400));
  console.log('after open:', JSON.stringify(await page.evaluate(() => ({
    hidden: document.getElementById('reviewModalWrap').hidden,
    bodyOverflow: document.body.style.overflow,
    focused: document.activeElement?.id
  }))));

  // submit kosong → error nama
  await page.click('#revSubmit');
  await new Promise(r => setTimeout(r, 200));
  console.log('empty submit msg:', await page.evaluate(() => document.getElementById('revMsg').textContent));

  // isi form tanpa consent
  await page.type('#revName', 'QA Browser Test');
  await page.select('#revGroup', 'Weekly Fun Game');
  await page.click('.rev-star[data-v="4"]');
  await page.type('#revText', 'Tes otomatis verifikasi browser — mohon abaikan.');
  await new Promise(r => setTimeout(r, 100));
  console.log('count after type:', await page.evaluate(() => document.getElementById('revCount').textContent));
  await page.click('#revSubmit');
  await new Promise(r => setTimeout(r, 200));
  console.log('no-consent msg:', await page.evaluate(() => document.getElementById('revMsg').textContent));

  // klik di dalam modal tidak menutup
  await page.click('.rev-modal h3');
  await new Promise(r => setTimeout(r, 150));
  console.log('after inner click hidden:', await page.evaluate(() => document.getElementById('reviewModalWrap').hidden));

  // Escape menutup
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 200));
  console.log('after Escape hidden:', await page.evaluate(() => ({
    hidden: document.getElementById('reviewModalWrap').hidden,
    bodyOverflow: document.body.style.overflow
  })));

  // buka lagi untuk screenshot mobile + desktop
  await page.click('#reviewOpenBtn');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: '_project_archive/shots/rev_modal_desktop.png' });
  await page.keyboard.press('Escape');

  for (const w of [320, 375, 390, 430]) {
    await page.setViewport({ width: w, height: 800 });
    await new Promise(r => setTimeout(r, 500));
    await page.click('#reviewOpenBtn');
    await new Promise(r => setTimeout(r, 400));
    const m = await page.evaluate(() => {
      const r = document.querySelector('.rev-modal').getBoundingClientRect();
      return { inViewport: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight,
               hasHScroll: document.documentElement.scrollWidth > innerWidth };
    });
    console.log(`modal ${w}px:`, JSON.stringify(m));
    await page.screenshot({ path: `_project_archive/shots/rev_modal_${w}.png` });
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 150));
  }

  console.log('JS errors:', errors.length ? errors : 'none');
  await browser.close();
})();
