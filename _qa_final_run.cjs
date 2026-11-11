// QA AKHIR — verifikasi sisa PROMPT 19-22
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  const BASE = 'http://localhost:8099/';
  const out = { errs };

  // --- PROMPT 19: foto komunitas di homepage (desktop + mobile)
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE, { waitUntil: 'networkidle2' });
  await p.evaluate(() => { sessionStorage.setItem('toba-intro-seen', '1'); localStorage.setItem('toba-lang', 'id'); });
  await p.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  out.photoGrid = await p.evaluate(() => {
    const g = document.querySelector('.community-photo-grid');
    const r = g.getBoundingClientRect();
    return { present: !!g, rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }, imgsLoaded: [...g.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth > 0).length };
  });
  await p.evaluate(() => window.scrollTo(0, document.querySelector('.community-photo-grid').offsetTop - 100));
  await new Promise(r => setTimeout(r, 600));
  await p.screenshot({ path: '_p19_grid2.png' });

  // --- PROMPT 12/14: CTA check pada kartu Tobaladies & Tobadeli
  out.ctaCards = await p.evaluate(() => [...document.querySelectorAll('.comm-link')].map(e => e.textContent.trim()));

  // --- PROMPT 9: jarak section terakhir ke footer (semua halaman)
  const gapPages = ['index', 'tobadeli', 'tobaladies', 'events', 'merchandise', 'gallery', 'partnership'];
  out.gapToFooter = {};
  for (const f of gapPages) {
    await p.goto(BASE + f + '.html', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 400));
    out.gapToFooter[f] = await p.evaluate(() => {
      const secs = document.querySelectorAll('main section, main > section, main > div[class*=section]');
      const last = secs[secs.length - 1];
      const foot = document.querySelector('footer');
      if (!last || !foot) return 'missing';
      return Math.round(foot.getBoundingClientRect().top - last.getBoundingClientRect().bottom);
    });
  }

  // --- PROMPT 4/17/22: mobile QA tobadeli + tobaladies
  await p.setViewport({ width: 390, height: 844 });
  for (const f of ['tobadeli', 'tobaladies']) {
    await p.goto(BASE + f + '.html', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 500));
    const m = await p.evaluate(() => ({
      hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      watermark: (() => { const w = document.querySelector('.watermark, .court-watermark, [class*=watermark]'); if (!w) return 'none'; const s = getComputedStyle(w); const r = w.getBoundingClientRect(); return { op: s.opacity, disp: s.display, z: s.zIndex, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } })()
    }));
    out['mobile_' + f] = m;
    await p.screenshot({ path: '_p22_' + f + '_mob.png' });
  }

  // --- PROMPT 5/15: language switch sanity di tobadeli
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + 'tobadeli.html', { waitUntil: 'networkidle2' });
  const langBtn = await p.$('.lang-btn[data-lang=en]');
  if (langBtn) { await langBtn.click(); await new Promise(r => setTimeout(r, 400)); }
  out.deli_en_texts = await p.evaluate(() => ({ cta1: (document.querySelector('[data-i18n="deli.cta1"]') || {}).textContent, sched: (document.querySelector('[data-i18n="events.weekly"], .sched-label') || {}).textContent || 'n/a' }));
  if (await p.$('.lang-btn[data-lang=id]')) { await p.click('.lang-btn[data-lang=id]'); await new Promise(r => setTimeout(r, 400)); }
  out.deli_id_texts = await p.evaluate(() => ({ cta1: (document.querySelector('[data-i18n="deli.cta1"]') || {}).textContent }));

  console.log(JSON.stringify(out, null, 1));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1) });
