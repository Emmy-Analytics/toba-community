const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:8099/index.html', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));
  const marquee = await page.evaluate(() => {
    const item = document.querySelector('.cine-m-item');
    if (!item) return { found: false };
    return { found: true, color: getComputedStyle(item).color, text: (item.textContent || '').slice(0, 40) };
  });
  console.log('MARQUEE:', JSON.stringify(marquee));
  // screenshot the marquee area for visual evidence
  const el = await page.$('.cine-marquee');
  if (el) await el.screenshot({ path: '_qa_marquee_orange.png' });
  // footer icon color
  const ig = await page.evaluate(() => {
    const s = document.querySelector('.pw-ig');
    if (!s) return { found: false };
    return { found: true, color: getComputedStyle(s).color };
  });
  console.log('PW-IG:', JSON.stringify(ig));
  const foot = await page.$('.pw-credit');
  if (foot) await foot.screenshot({ path: '_qa_pw_credit.png' });
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
