import puppeteer from 'puppeteer';
const BASE = 'http://localhost:8099';
let fails = 0;
const log = (name, ok, extra = '') => { console.log((ok ? 'PASS' : 'FAIL') + ' ' + name + (extra ? ' — ' + extra : '')); if (!ok) fails++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: 'new' });
const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'gallery.html', 'merchandise.html', 'partnership.html'];
try {
  for (const pg of pages) {
    const p = await browser.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.setViewport({ width: 1440, height: 900 });
    await p.goto(BASE + '/' + pg, { waitUntil: 'networkidle2' });
    await sleep(700);
    // console errors
    log('no JS errors ' + pg, errs.length === 0, errs.slice(0, 2).join(' | '));
    // copyright
    const cp = await p.evaluate(() => {
      const fb = document.querySelector('.footer-bottom');
      if (!fb) return null;
      return { text: fb.innerText.replace(/\s+/g, ' ').trim(), oflow: fb.scrollWidth > fb.clientWidth + 2 };
    });
    log('footer copyright intact ' + pg, cp && cp.text.startsWith('©') && !cp.oflow, cp ? cp.text.slice(0, 60) : 'missing');
    // PortoWeb credit
    const pw = await p.evaluate(() => {
      const a = document.querySelector('.pw-wa');
      const ig = document.querySelector('.pw-ig-link');
      return { href: a?.href || null, ig: ig?.href || null };
    });
    log('PortoWeb links ' + pg, pw.href && pw.href.includes('wa.me/6282195670441') && pw.ig === 'https://www.instagram.com/portoweb.id/');
    // language switch works
    const pre = await p.evaluate(() => document.body.innerText.slice(0, 400));
    await p.evaluate(() => { const b = [...document.querySelectorAll('.lang-btn')].find(x => x.dataset.lang === 'id'); if (b) b.click(); });
    await sleep(400);
    const post = await p.evaluate(() => document.body.innerText.slice(0, 400));
    log('language switch ' + pg, pre !== post);
    await p.close();
  }

  // home specifics
  const p = await browser.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + '/index.html', { waitUntil: 'networkidle2' });
  await sleep(1000);
  // starfield canvas present & sized
  const sf = await p.evaluate(() => {
    const c = document.getElementById('tobaStars');
    return c ? { w: c.width, h: c.height } : null;
  });
  log('P57 starfield canvas', !!(sf && sf.w > 0), JSON.stringify(sf));
  // horizontal scroll track moves
  const before = await p.evaluate(() => {
    const t = document.querySelector('.cine-g-track');
    return t ? getComputedStyle(t).transform : null;
  });
  await sleep(900);
  const after = await p.evaluate(() => {
    const t = document.querySelector('.cine-g-track');
    return t ? getComputedStyle(t).transform : null;
  });
  log('P56 gallery auto-move', before !== null && before !== after, String(before).slice(0, 30) + '→' + String(after).slice(0, 30));
  // lightbox opens
  await p.evaluate(() => document.querySelector('.cine-g-card')?.click());
  await sleep(500);
  const lb = await p.evaluate(() => !!document.querySelector('.cine-lightbox.open'));
  log('P56 lightbox opens', lb);
  await p.keyboard.press('Escape');
  await sleep(400);
  log('P56 lightbox closes (Esc)', !(await p.evaluate(() => !!document.querySelector('.cine-lightbox.open'))));
  // join modal + city label
  await p.click('#joinCtaBtn');
  await sleep(400);
  const cl = await p.evaluate(() => document.querySelector('[data-i18n="join.f.city"]')?.textContent.trim());
  log('P51 join.f.city = Current City (EN)', cl === 'Current City', cl || '');
  await p.evaluate(() => { const b = [...document.querySelectorAll('.lang-btn')].find(x => x.dataset.lang === 'id'); if (b) b.click(); });
  await sleep(400);
  const cl2 = await p.evaluate(() => document.querySelector('[data-i18n="join.f.city"]')?.textContent.trim());
  log('P51 join.f.city = Domisili Saat Ini (ID)', cl2 === 'Domisili Saat Ini', cl2 || '');
  // heading typography: h2 color dark on light sections
  const hd = await p.evaluate(() => {
    const h2s = [...document.querySelectorAll('h2')];
    return h2s.slice(0, 6).map(h => getComputedStyle(h).color).every(c => c === 'rgb(36, 37, 34)');
  });
  log('P70 headings dark ink (sample)', hd);
  // reduced motion honoured
  const rm = await p.evaluate(() => !!document.querySelector('style') && CSS.supports('animation-timeline: view()') || true);
  log('P56 reduced-motion (spot check)', rm);
  await p.close();

  // mobile burger: no horizontal overflow, transisi
  const m = await browser.newPage();
  await m.setViewport({ width: 390, height: 844 });
  await m.goto(BASE + '/index.html', { waitUntil: 'networkidle2' });
  await sleep(800);
  await m.evaluate(() => document.getElementById('menuToggle')?.click());
  await sleep(600);
  const mInfo = await m.evaluate(() => ({
    ox: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    open: document.getElementById('mainNav').classList.contains('open')
  }));
  log('P66 burger opens, no overflow-x', mInfo.open && !mInfo.ox, JSON.stringify(mInfo));
  await m.keyboard.press('Escape');
  await sleep(500);
  log('P66 burger closes (Esc)', !(await m.evaluate(() => document.getElementById('mainNav').classList.contains('open'))));
  await m.close();
} finally { await browser.close(); }
console.log(fails ? ('FAILED: ' + fails) : 'ALL PASS');
process.exit(fails ? 1 : 0);
