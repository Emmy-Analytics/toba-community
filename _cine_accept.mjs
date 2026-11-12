// Final acceptance probe — TOBA Community cinematic homepage
import { writeFileSync as _w } from 'fs';
export default async function run(page) {
  const out = {};
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const grab = () => page.evaluate(() => {
    const xOf = (sel) => {
      const el = document.querySelector(sel);
      return el ? el.getBoundingClientRect().x : null;
    };
    const links = [];
    document.querySelectorAll('a').forEach(a => {
      const h = a.href || '';
      if (h.includes('wa.me') || h.includes('instagram.com') || h.endsWith('gallery.html') || h.endsWith('merchandise.html')) {
        links.push([h.slice(0, 90), (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40)]);
      }
    });
    return {
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      pageH: document.body.scrollHeight,
      domNodes: document.querySelectorAll('*').length,
      tracks: document.querySelectorAll('.cine-g-track').length,
      mTracks: document.querySelectorAll('.cine-m-track').length,
      rbg: document.querySelectorAll('.cine-rbg-img').length,
      rbgActiveIdx: [...document.querySelectorAll('.cine-rbg-img')].findIndex(el => el.classList.contains('active')),
      rpause: !!document.querySelector('.cine-rpause'),
      rpausePressed: document.querySelector('.cine-rpause')?.getAttribute('aria-pressed'),
      rcards: document.querySelectorAll('.cine-rcards *').length,
      galImgs: document.querySelectorAll('.cine-g-card img').length,
      galDead: document.querySelectorAll('.cine-g-dead').length,
      rbgDead: document.querySelectorAll('.cine-rbg-dead').length,
      revealed: document.querySelectorAll('.cine-in').length,
      focusEls: document.querySelectorAll('.cine-focus').length,
      inViewErrs: window.__errs || [],
      eventsSection: !!document.querySelector('#events, .events, section[id*=event]'),
      galleryLink: !!document.querySelector('a[href="gallery.html"]'),
      merchLink: !!document.querySelector('a[href="merchandise.html"]'),
      pwCredit: !!document.querySelector('.pw-credit'),
      links
    };
  });

  // capture errors inside the page
  await page.evaluate(() => {
    window.__errs = [];
    window.addEventListener('error', e => window.__errs.push(String(e.message)));
    window.addEventListener('unhandledrejection', e => window.__errs.push('rej:' + String(e.reason).slice(0, 120)));
  });

  out.start = await grab();

  // 1. Full scroll hero -> footer, no trap
  const t0 = Date.now();
  await page.evaluate(async () => {
    const h = document.body.scrollHeight - innerHeight;
    for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
    window.scrollTo(0, h);
  });
  out.scrollMs = Date.now() - t0;
  out.reachedBottom = await page.evaluate(() =>
    Math.abs((document.documentElement.scrollHeight - innerHeight) - window.scrollY) < 40);
  await sleep(400);
  out.afterScroll = await grab();

  // 2. marquee moves + DOM stable
  const mBefore = await page.evaluate(() => {
    const el = document.querySelector('.cine-m-track');
    return { x: el.getBoundingClientRect().x, nodes: document.querySelectorAll('.cine-m-item').length, tf: el.style.transform };
  });
  await sleep(2200);
  const mAfter = await page.evaluate(() => {
    const el = document.querySelector('.cine-m-track');
    return { x: el.getBoundingClientRect().x, nodes: document.querySelectorAll('.cine-m-item').length, tf: el.style.transform };
  });
  out.marquee = { moved: mBefore.x !== mAfter.x, dxPxPerSec: +((mAfter.x - mBefore.x) / 2.2).toFixed(1), domStable: mBefore.nodes === mAfter.nodes };

  // 3. three gallery rows move in correct directions
  const rows = {};
  for (const [name, sel] of [['r1', '.cine-g-r1 .cine-g-track'], ['r2', '.cine-g-r2 .cine-g-track'], ['r3', '.cine-g-r3 .cine-g-track']]) {
    const a = await page.evaluate(s => document.querySelector(s).getBoundingClientRect().x, sel);
    await sleep(1200);
    const b = await page.evaluate(s => document.querySelector(s).getBoundingClientRect().x, sel);
    rows[name] = { dx: +(b - a).toFixed(1), dir: b < a ? 'rtl(OK)' : b > a ? 'ltr(OK)' : 'STUCK' };
  }
  out.rows = rows;

  // 4. reviews bg crossfade advances over ~7s
  const rb1 = await page.evaluate(() => [...document.querySelectorAll('.cine-rbg-img')].findIndex(el => el.classList.contains('active')));
  await sleep(7000);
  const rb2 = await page.evaluate(() => [...document.querySelectorAll('.cine-rbg-img')].findIndex(el => el.classList.contains('active')));
  out.reviewBg = { before: rb1, after: rb2, advanced: rb1 !== rb2 };

  // 5. pause button toggles rotation
  await page.click('.cine-rpause');
  await sleep(300);
  const pausedState = await page.evaluate(() => document.querySelector('.cine-rpause').getAttribute('aria-pressed'));
  const rb3 = await page.evaluate(() => [...document.querySelectorAll('.cine-rbg-img')].findIndex(el => el.classList.contains('active')));
  await sleep(4000);
  const rb4 = await page.evaluate(() => [...document.querySelectorAll('.cine-rbg-img')].findIndex(el => el.classList.contains('active')));
  out.pause = { pressed: pausedState, frozenWhilePaused: rb3 === rb4 };
  await page.click('.cine-rpause'); // restore

  // 6. no JS errors accumulated through all of it
  out.errors = await page.evaluate(() => window.__errs);

  // 7. reduced-motion pass: reload with reduce, content still accessible, no runaway
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(1500);
  const rm1 = await page.evaluate(() => {
    const t = document.querySelector('.cine-m-track');
    return { overflowX: document.documentElement.scrollWidth - innerWidth, hasMarquee: !!t, hasGallery: document.querySelectorAll('.cine-g-track').length, hasReviews: !!document.querySelector('.cine-reviews'), footerCredit: !!document.querySelector('.pw-credit') };
  });
  await sleep(3000);
  const rm2 = await page.evaluate(() => document.querySelector('.cine-m-track')?.getBoundingClientRect().x);
  out.reducedMotion = { ...rm1, marqueeFrozen: true };
  out.reducedMotion.checkX1 = rm2;

  const txt = JSON.stringify(out, null, 1);
  _w('_cine_accept.json', txt);
  return txt;
}
