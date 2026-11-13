const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const out = {};

  // 1. Tobaladies: skip intro, click gabung CTA -> modal opens, team=Tobaladies preselected, pink theme
  let pg = await browser.newPage();
  await pg.setViewport({ width: 390, height: 844 });
  await pg.goto('http://localhost:8099/tobaladies.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 500));
  await pg.evaluate(() => { const s = document.querySelector('.tld-skip,.tdl-skip'); if (s) s.click(); });
  await new Promise(r => setTimeout(r, 900));
  await pg.waitForSelector('.callout a.pill');
  await pg.evaluate(() => { document.querySelector('.callout a.pill').scrollIntoView(); });
  await pg.click('.callout a.pill');
  await new Promise(r => setTimeout(r, 500));
  out.tl = await pg.evaluate(() => {
    const m = document.getElementById('joinModal');
    return { open: m && !m.hidden, team: document.querySelector('#joinModal input[name="team"]:checked')?.value, theme: !!document.querySelector('.theme-join-pink'), bodyLocked: document.body.style.overflow === 'hidden' };
  });
  // escape closes
  await pg.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 300));
  out.tlEscape = await pg.evaluate(() => document.getElementById('joinModal').hidden);
  // submit empty -> validation error, no navigation
  await pg.click('.callout a.pill');
  await new Promise(r => setTimeout(r, 300));
  await pg.evaluate(() => document.querySelector('#joinModal .join-submit').click());
  await new Promise(r => setTimeout(r, 300));
  out.tlValidation = await pg.evaluate(() => ({ errShown: !document.getElementById('joinErr').hidden, err: document.getElementById('joinErr').textContent.slice(0, 60), stillOpen: !document.getElementById('joinModal').hidden }));
  // fill form -> window.open called with wa.me
  await pg.evaluate(() => { window.__wa = null; window.open = (u) => { window.__wa = u; return null; }; });
  await pg.type('#joinModal input[name="nama"]', 'Test QA');
  await pg.type('#joinModal input[name="phone"]', '081234567890');
  await pg.type('#joinModal input[name="ig"]', '@testqa');
  await pg.type('#joinModal input[name="domisili"]', 'Jakarta Timur');
  await pg.evaluate(() => document.querySelector('#joinModal .join-submit').click());
  await new Promise(r => setTimeout(r, 300));
  out.tlSubmit = await pg.evaluate(() => ({ wa: (window.__wa || '').slice(0, 60), containsTobaladies: (window.__wa || '').includes('Tobaladies'), closed: document.getElementById('joinModal').hidden }));
  await pg.screenshot({ path: '_qa2_modal_tl.png' });
  await pg.close();

  // 2. Tobadeli: auto-select Tobadeli, orange theme
  pg = await browser.newPage();
  await pg.setViewport({ width: 390, height: 844 });
  await pg.goto('http://localhost:8099/tobadeli.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 500));
  await pg.evaluate(() => { const s = document.querySelector('.tld-skip,.tdl-skip'); if (s) s.click(); });
  await new Promise(r => setTimeout(r, 900));
  await pg.waitForSelector('.callout a.pill');
  await pg.click('.callout a.pill');
  await new Promise(r => setTimeout(r, 400));
  out.td = await pg.evaluate(() => ({ team: document.querySelector('#joinModal input[name="team"]:checked')?.value, theme: !!document.querySelector('.theme-join-deli') }));
  await pg.close();

  // 3. Burger drawer: open -> one X, burger hidden; Escape closes
  pg = await browser.newPage();
  await pg.setViewport({ width: 390, height: 844 });
  await pg.goto('http://localhost:8099/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await pg.click('#menuToggle');
  await new Promise(r => setTimeout(r, 500));
  out.drawer = await pg.evaluate(() => {
    const nav = document.getElementById('mainNav');
    const mt = document.getElementById('menuToggle');
    const mtStyle = getComputedStyle(mt);
    const closes = [...document.querySelectorAll('.drawer-close')].filter(c => { const s = getComputedStyle(c); return s.display !== 'none' && s.visibility !== 'hidden'; });
    return { navOpen: nav.classList.contains('open'), burgerHidden: mtStyle.visibility === 'hidden', visibleCloseCount: closes.length, bodyLocked: document.body.style.overflow === 'hidden' };
  });
  await pg.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));
  out.drawerEscape = await pg.evaluate(() => ({ closed: !document.getElementById('mainNav').classList.contains('open'), unlocked: document.body.style.overflow === '' }));
  await pg.screenshot({ path: '_qa2_drawer_closed.png' });
  await pg.close();

  // 4. Footer credit position mobile (390px) — should be right-aligned on subpage
  pg = await browser.newPage();
  await pg.setViewport({ width: 390, height: 844 });
  await pg.goto('http://localhost:8099/events.html', { waitUntil: 'networkidle2' });
  out.credit = await pg.evaluate(() => {
    const el = document.querySelector('.footer-credit');
    el.scrollIntoView();
    const s = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return { justifyContent: s.justifyContent, rightGap: Math.round(window.innerWidth - rect.right) };
  });
  await pg.screenshot({ path: '_qa2_credit.png' });
  await pg.close();

  // 5. Partnership grid 9 cards
  pg = await browser.newPage();
  await pg.setViewport({ width: 1366, height: 900 });
  await pg.goto('http://localhost:8099/partnership.html', { waitUntil: 'networkidle2' });
  out.partnership = await pg.evaluate(() => ({ cards: document.querySelectorAll('.part-grid .info-card').length, first: document.querySelector('.part-grid .info-card h3')?.textContent }));
  await pg.screenshot({ path: '_qa2_partnership.png' });
  await pg.close();

  // 6. Storytelling Tobaladies + Tobadeli content present
  for (const [key, url] of [['storyTl', 'tobaladies.html'], ['storyTd', 'tobadeli.html']]) {
    pg = await browser.newPage();
    await pg.setViewport({ width: 1366, height: 900 });
    await pg.goto('http://localhost:8099/' + url, { waitUntil: 'networkidle2' });
    out[key] = await pg.evaluate(() => {
      const sec = document.querySelector('.comm-story');
      return { exists: !!sec, eyebrow: sec?.querySelector('.eyebrow')?.textContent, heading: sec?.querySelector('h2')?.textContent, paras: sec ? sec.querySelectorAll('p:not(.eyebrow)').length : 0, imgOk: sec ? sec.querySelector('img')?.naturalWidth > 0 : false };
    });
    await pg.close();
  }

  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
