import puppeteer from 'puppeteer';
const BASE = 'http://localhost:8090';
let fails = 0;
const log = (name, ok, extra = '') => { console.log((ok ? 'PASS' : 'FAIL') + ' ' + name + (extra ? ' — ' + extra : '')); if (!ok) fails++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: 'new' });
try {
  const p = await browser.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  // home, EN default
  await p.goto(BASE + '/index.html', { waitUntil: 'networkidle2' }); await sleep(900);
  const greenStory = await p.evaluate(() => document.body.innerText.includes('Momen yang bikin kami terus main'));
  log('P69 green story section removed (home)', !greenStory);
  const drawerTxt = await p.evaluate(() => document.querySelector('.mega')?.innerText || '');
  log('P67 no "Kenalan sama TOBA" anywhere', !drawerTxt.includes('Kenalan sama TOBA'));
  // switch to ID
  await p.evaluate(() => { const b = [...document.querySelectorAll('.lang-btn')].find(x => x.dataset.lang === 'id'); if (b) b.click(); });
  await sleep(500);
  const evHead = await p.evaluate(() => document.querySelector('.agenda-section h2')?.textContent || '');
  log('P64 agenda "Mau cari game Jakarta Timur?" persists (i18n)', evHead.includes('Mau cari game di Jakarta Timur?'), evHead);
  // P45 on tobadeli
  await p.goto(BASE + '/tobadeli.html', { waitUntil: 'networkidle2' }); await sleep(1200);
  const delCta = await p.evaluate(() => {
    const els = [...document.querySelectorAll('a,button')].map(e => e.textContent.trim());
    return els.find(x => x === 'Join the Squad' || x === 'Gabung Squad') || null;
  });
  log('P45/P61 Tobadeli Join the Squad / Gabung Squad', !!delCta, delCta || '');
  await p.reload({ waitUntil: 'networkidle2' }); await sleep(900);
  await p.evaluate(() => { const b = [...document.querySelectorAll('.lang-btn')].find(x => x.dataset.lang === 'id'); if (b) b.click(); });
  await sleep(500);
  const delCtaId = await p.evaluate(() => {
    const els = [...document.querySelectorAll('a,button')].map(e => e.textContent.trim());
    return els.find(x => x === 'Gabung Squad') || null;
  });
  log('P45/P61 Tobadeli ID = Gabung Squad', !!delCtaId, delCtaId || '');
  // P62 intro Tobaladies
  const p2 = await browser.newPage();
  await p2.setViewport({ width: 1440, height: 900 });
  await p2.goto(BASE + '/tobaladies.html', { waitUntil: 'networkidle2' }); await sleep(1400);
  const tldCta = await p2.evaluate(() => document.querySelector('.tld-cta')?.textContent.trim() || null);
  log('P61/P62 intro Tobaladies CTA', tldCta === 'Join the Squad', tldCta || '');
  log('P62 intro Tobaladies no "Ini lapanganmu." / no Jakarta Timur', !(await p2.evaluate(() => document.querySelector('.tld-intro')?.innerText.includes('Ini lapanganmu'))));
  const deliT = await p2.evaluate(() => document.querySelector('.tld-intro')?.innerText.includes('Jakarta Timur'));
  log('P62 intro no Jakarta Timur label', !deliT);
  // P51 form label
  const cityLabel = await p2.evaluate(() => document.querySelector('[data-i18n="join.f.city"]')?.textContent.trim() || null);
  log('P51 join.f.city label default', cityLabel === 'Current City', cityLabel || '');
} finally { await browser.close(); }
console.log(fails ? ('FAILED: ' + fails) : 'ALL PASS');
process.exit(fails ? 1 : 0);
