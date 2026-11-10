/* Full audit: all pages x key breakpoints — console errors, overflow, Explore,
   drawer, court geometry, empty space. */
import puppeteer from 'puppeteer';
const base = 'file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/';
const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'game.html', 'partnership.html'];
const sizes = [[1440, 900], [768, 1024], [390, 844], [360, 780]];
const browser = await puppeteer.launch({ headless: 'new' });

const SKIP = `document.querySelector('.obi-skip,.tld-skip,.tdl-skip')?.click(); sessionStorage.clear();`;

for (const [w, h] of sizes) {
  for (const p of pages) {
    const page = await browser.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push('JS:' + e.message.slice(0, 120)));
    page.on('console', m => { if (m.type() === 'error') errs.push('CON:' + m.text().slice(0, 120)); });
    await page.setViewport({ width: w, height: h, isMobile: w < 800, hasTouch: w < 800 });
    await page.goto(base + p, { waitUntil: 'load', timeout: 30000 });
    await page.evaluate(SKIP);
    await new Promise(r => setTimeout(r, p === 'game.html' ? 1500 : 900));
    const rep = await page.evaluate(() => {
      const d = document.documentElement, b = document.body;
      const out = { ovX: d.scrollWidth > d.clientWidth + 1, ovY: false, errs: [] };
      // horizontal overflow source
      if (out.ovX) {
        const wide = [...document.querySelectorAll('*')].filter(el => {
          const r = el.getBoundingClientRect();
          return r.right > d.clientWidth + 2 && r.width > 8;
        }).slice(0, 4).map(el => el.tagName + '.' + (el.className.baseVal !== undefined ? el.className.baseVal : el.className).toString().split(' ')[0] + '@' + Math.round(el.getBoundingClientRect().right));
        out.src = wide;
      }
      // court svg check
      const svg = document.querySelector('.hero-court,.obi-court,.tld-court,.tdl-court');
      if (svg) { const r = svg.getBoundingClientRect(); out.court = { w: Math.round(r.width), h: Math.round(r.height), op: getComputedStyle(svg).opacity }; }
      // hero height on mobile
      const hero = document.querySelector('.hero,.hero-home');
      if (hero) { const hr = hero.getBoundingClientRect(); out.heroH = Math.round(hr.height); }
      // mascot visible?
      const masc = document.querySelector('.hero-mascot,.hero-croc img');
      if (masc) { const mr = masc.getBoundingClientRect(); out.masc = Math.round(mr.width) + 'x' + Math.round(mr.height); }
      // body scroll height vs viewport (blank space check)
      out.docH = document.body.scrollHeight;
      return out;
    });
    // Explore test
    let explore = 'n/a';
    if (w >= 1001) {
      await page.click('#navExplore').catch(() => { });
      await new Promise(r => setTimeout(r, 400));
      explore = await page.evaluate(() => {
        const m = document.getElementById('megaMenu');
        return m ? (m.classList.contains('open') ? 'open' : 'fail') : 'noEl';
      });
      await page.keyboard.press('Escape');
    } else if (w <= 768) {
      await page.click('#menuToggle').catch(() => { });
      await new Promise(r => setTimeout(r, 450));
      explore = await page.evaluate(() => {
        const n = document.getElementById('mainNav');
        if (!n) return 'noEl';
        const open = n.classList.contains('open');
        if (!open) return 'drawerFail';
        // open accordion, check links visible
        const lbl = n.querySelector('.mega-label'); lbl?.click();
        return new Promise(res => setTimeout(() => {
          const link = n.querySelector('.mega-group.open .nav-link');
          const vis = link ? link.getBoundingClientRect().width > 0 : false;
          const cta = n.querySelector('.drawer-cta');
          const ctaVis = cta ? getComputedStyle(cta).display !== 'none' : false;
          // body scroll locked?
          const locked = getComputedStyle(document.body).overflow === 'hidden';
          res(`drawer=open links=${vis} cta=${ctaVis} lock=${locked}`);
        }, 350));
      });
      // close and check scroll restored
      await page.evaluate(() => document.querySelector('.drawer-close')?.click());
      await new Promise(r => setTimeout(r, 500));
      const restored = await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden');
      explore += ` restore=${restored}`;
    }
    console.log(`[${w}] ${p.replace('.html', '')}: ${JSON.stringify(rep)} explore=${explore} errs=${errs.length ? errs.join(' | ') : 'none'}`);
    if ((w === 390 || w === 1440) && (p === 'index.html' || p === 'tobaladies.html' || p === 'tobadeli.html' || p === 'events.html')) {
      await page.screenshot({ path: `_aud-${p.replace('.html', '')}-${w}.png`, fullPage: false });
    }
    await page.close();
  }
}
await browser.close();
console.log('AUDIT DONE');
