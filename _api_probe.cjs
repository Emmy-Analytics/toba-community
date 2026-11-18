const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('response', async r => { const u = r.url(); if (u.includes('script.google') || u.includes('googleusercontent.com/macros') || u.includes('usercontent')) { const b = await r.text().catch(() => '<binary>'); console.log('[API]', r.status(), u.slice(8, 60), '::', String(b).slice(0, 220)); } });
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://example.com');
  await page.evaluate(() => {
    const s = document.createElement('script');
    s.src = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec?api=hero&callback=tobaHeroCallback';
    window.tobaHeroCallback = res => console.log('[CB]', JSON.stringify(res).slice(0, 400));
    document.body.appendChild(s);
  });
  await new Promise(r => setTimeout(r, 15000));
  await browser.close();
})();
