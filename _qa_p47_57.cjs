/* QA Prompt 47-57 â€” TOBA Community */
const puppeteer = require('puppeteer');
const path = require('path');
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const base = 'http://localhost:8099/';
  const out = {};

  // ---- Titles (7 pages) ----
  const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html'];
  out.titles = {};
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle2', timeout: 30000 });
    out.titles[p] = await page.title();
    pc: ;
  }

  // ---- Footer screenshots (7 pages, 1280px) ----
  await page.setViewport({ width: 1280, height: 900 });
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(600);
    await page.evaluate(() => { const f = document.querySelector('.site-footer'); if (f) f.scrollIntoView({ block: 'end' }); });
    await sleep(400);
    const f = await page.$('.site-footer');
    if (f) await f.screenshot({ path: `_qa57_footer_${p.replace('.html', '')}.png` });
    // measure social gaps + porto icon
    out[p] = await page.evaluate(() => {
      const r = {};
      const soc = document.querySelector('.footer-social');
      if (soc) { const cs = getComputedStyle(soc); r.socialGap = cs.rowGap || cs.gap; }
      const wa = document.querySelector('.footer-wa');
      r.waLabel = wa ? wa.textContent.trim() : null;
      r.waHref = wa ? wa.href : null;
      const ig = document.querySelector('.pw-ig-link svg.pw-ig');
      if (ig) { const b = ig.getBoundingClientRect(); r.pwIg = { w: b.width, h: b.height, visible: b.width > 0 && b.height > 0 }; }
      const link = document.querySelector('.pw-ig-link');
      r.pwIgHref = link ? link.href : null;
      const slinks = [...document.querySelectorAll('.footer-slink')];
      r.slinkHeights = slinks.map(s => Math.round(s.getBoundingClientRect().height));
      return r;
    });
    ec: ;
  }

  // ---- Homepage mobile 390: hero bottom, cutout slideshow, marquee, partnership ----
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(base + 'index.html', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1200);
  out.hero390 = await page.evaluate(() => {
    const hero = document.querySelector('.hero-home');
    const r = {};
    if (hero) {
      const b = hero.getBoundingClientRect();
      r.heroBottom = Math.round(b.bottom + window.scrollY);
      r.heroPadBottom = getComputedStyle(hero).paddingBottom;
      const cs = getComputedStyle(hero);
      r.heroBg = cs.backgroundImage.slice(0, 60);
    }
    const box = document.getElementById('heroCutShow');
    r.cutImgs = box ? box.querySelectorAll('.hero-cut-img').length : 0;
    r.cutBall = box ? box.querySelectorAll('.cut-ball').length : 0;
    if (box) { const m = box.querySelector('.cut-main'); if (m) r.mainW = Math.round(m.getBoundingClientRect().width); const b2 = box.querySelector('.cut-ball'); if (b2) r.ballW = Math.round(b2.getBoundingClientRect().width); }
    // white strip check: what's just below hero?
    const next = hero ? hero.nextElementSibling : null;
    r.nextSection = next ? next.className : null;
    return r;
  });
  // screenshot hero bottom
  await page.evaluate(() => { const h = document.querySelector('.hero-home'); if (h) h.scrollIntoView({ block: 'end' }); });
  await sleep(400);
  await page.screenshot({ path: '_qa57_hero390_bottom.png' });

  // marquee colors
  await page.evaluate(() => { const m = document.querySelector('.cine-marquee'); if (m) m.scrollIntoView({ block: 'center' }); });
  await sleep(700);
  out.marquee = await page.evaluate(() => {
    const t = document.querySelector('.cm-toba'); const a = document.querySelector('.cm-apparel');
    return { toba: t ? getComputedStyle(t).color : null, apparel: a ? getComputedStyle(a).color : null };
  });
  const mq = await page.$('.cine-marquee');
  if (mq) await mq.screenshot({ path: '_qa57_marquee.png' });

  // partnership card
  await page.evaluate(() => { const c = document.querySelector('.contact-card'); if (c) c.scrollIntoView({ block: 'center' }); });
  await sleep(400);
  out.contactCard = await page.evaluate(() => {
    const c = document.querySelector('.contact-card');
    if (!c) return null;
    const cs = getComputedStyle(c);
    const prev = c.closest('section').previousElementSibling;
    const mb = c.getBoundingClientRect();
    return { pad: cs.padding, marginTop: cs.marginTop, h: Math.round(mb.height), cta: c.querySelector('.contact-cta') ? c.querySelector('.contact-cta').getAttribute('href') : null };
  });
  const cc = await page.$('.contact-card');
  if (cc) await cc.screenshot({ path: '_qa57_partcard390.png' });

  // cutout rotation: sample compositions over ~20s
  const seen = [];
  for (let i = 0; i < 8; i++) {
    await sleep(2600);
    const s = await page.evaluate(() => {
      const box = document.getElementById('heroCutShow');
      if (!box) return null;
      const m = box.querySelector('.cut-main');
      return m ? m.src.split('/').pop() : null;
    });
    seen.push(s);
  }
  out.rotationSequence = seen;

  // ---- Gallery page desktop 1366: rows filled ----
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(base + 'gallery.html', { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => { });
  await sleep(1500);
  out.galleryDesktop = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.cine-g-row')];
    return rows.map(r => {
      const tr = r.querySelector('.cine-g-track');
      const seqs = tr.querySelectorAll('.cine-g-seq');
      const seqW = seqs[0] ? Math.round(seqs[0].getBoundingClientRect().width) : 0;
      const total = tr.scrollWidth;
      return { cards: seqs.length ? seqs[0].children.length : 0, seqs: seqs.length, seqW, totalW: total, fillsViewport: total >= window.innerWidth * 2 };
    });
  });
  const gal = await page.$('.cine-gallery');
  if (gal) { await gal.scrollIntoView(); await sleep(2500); await gal.screenshot({ path: '_qa57_gallery_desktop.png' }); }
  // second cycle screenshot
  await sleep(3000);
  if (gal) await gal.screenshot({ path: '_qa57_gallery_desktop_c2.png' });

  // gallery mobile 390
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto(base + 'gallery.html', { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => { });
  await sleep(1200);
  out.galleryMobile = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.cine-g-row')];
    return rows.map(r => {
      const tr = r.querySelector('.cine-g-track');
      const seqs = tr.querySelectorAll('.cine-g-seq');
      const seqW = seqs[0] ? Math.round(seqs[0].getBoundingClientRect().width) : 0;
      return { cards: seqs.length ? seqs[0].children.length : 0, seqW, totalW: tr.scrollWidth, fills: tr.scrollWidth >= window.innerWidth * 2 };
    });
  });
  const docW = await page.evaluate(() => document.documentElement.scrollWidth);
  out.mobileNoHOverflow = docW <= 390;
  const gal2 = await page.$('.cine-gallery');
  if (gal2) { await gal2.scrollIntoView(); await sleep(2500); await gal2.screenshot({ path: '_qa57_gallery_390.png' }); }

  // ---- Intro alignment desktop + 390 ----
  for (const [w, h, name] of [[1280, 800, 'desktop'], [390, 844, '390']]) {
    await page.setViewport({ width: w, height: h, isMobile: w < 800 });
    await page.evaluate(() => sessionStorage.clear());
    await page.goto(base + 'index.html', { waitUntil: 'domcontentloaded' });
    await sleep(2200);
    out['intro_' + name] = await page.evaluate(() => {
      const fig = document.querySelector('.obi-figure'); const copy = document.querySelector('.obi-copy'); const wm = document.querySelector('.obi-wordmark');
      if (!fig || !wm) return { present: false };
      const fb = fig.getBoundingClientRect(), wb = wm.getBoundingClientRect();
      const fc = fb.left + fb.width / 2, wc = wb.left + wb.width / 2;
      return { present: true, figCenterX: Math.round(fc), wmCenterX: Math.round(wc), delta: Math.round(Math.abs(fc - wc)) };
    });
    await page.screenshot({ path: `_qa57_intro_${name}.png` });
  }

  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})().catch(e => { console.error('QA FAIL', e); process.exit(1); });
