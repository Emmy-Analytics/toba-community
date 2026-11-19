/* Uji submission asli sekali via form (data uji ditandai QA). */
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const url = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.click('#reviewOpenBtn');
  await new Promise(r => setTimeout(r, 300));
  await page.type('#revName', 'QA Verify 19Nov');
  await page.select('#revGroup', 'Event TOBA');
  await page.click('.rev-star[data-v="5"]');
  await page.type('#revText', 'Tes verifikasi browser otomatis 19 Nov 2026 - mohon dihapus admin.');
  await page.click('#revConsent');
  await page.click('#revSubmit');
  await new Promise(r => setTimeout(r, 12000));
  const res = await page.evaluate(() => ({
    msg: document.getElementById('revMsg').textContent,
    ok: document.getElementById('revMsg').classList.contains('rev-ok'),
    btnDisabled: document.getElementById('revSubmit').disabled,
    hidden: document.getElementById('reviewModalWrap').hidden
  }));
  console.log('submit result:', JSON.stringify(res));
  console.log('JS errors:', errors.length ? errors : 'none');
  await browser.close();
})();
