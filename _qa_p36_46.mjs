import puppeteer from 'puppeteer';
const B = 'http://127.0.0.1:8099/';
const browser = await puppeteer.launch({ headless: 'new' });
const skipIntro = async (pg) => { await pg.evaluate(() => { document.getElementById('tobaIntro')?.remove(); document.querySelector('.tld-intro')?.remove(); document.getElementById('tdlIntro')?.remove(); try { sessionStorage.setItem('toba-intro-seen', '1'); } catch (e) { } }); };

const shots = [];
async function shoot(pg, name) { const f = '_qa_' + name + '.png'; await pg.screenshot({ path: f }); shots.push(f); }

/* ===== Homepage mobile 390 hero ===== */
let pg = await browser.newPage();
await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
await pg.goto(B + 'index.html', { waitUntil: 'networkidle2', timeout: 60000 });
await skipIntro(pg);
await new Promise(r => setTimeout(r, 3000));
await shoot(pg, 'hero390_a');
/* cutout composition #2 after 5s */
await new Promise(r => setTimeout(r, 5200));
await shoot(pg, 'hero390_b');
/* composition #3 */
await new Promise(r => setTimeout(r, 5200));
await shoot(pg, 'hero390_c');
/* full page to confirm gradient covers whole hero + no cream strip */
await pg.evaluate(() => window.scrollTo(0, 0));
const heroInfo = await pg.evaluate(() => {
  const hero = document.querySelector('.hero-home');
  const r = hero.getBoundingClientRect();
  const imgs = [...hero.querySelectorAll('.hero-cut-img')].map(i => ({ cls: i.className, w: Math.round(i.getBoundingClientRect().width) }));
  return { heroH: Math.round(r.height), imgs, bg: getComputedStyle(hero.querySelector('.hero-gradient-shift')).position };
});
console.log('heroInfo', JSON.stringify(heroInfo));

/* ===== Marquee + merch section ===== */
await pg.evaluate(() => document.querySelector('#cineApparel').scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 800));
await shoot(pg, 'apparel_merch_390');
/* marquee color check */
const mcolor = await pg.evaluate(() => getComputedStyle(document.querySelector('.cine-m-item')).color);
console.log('marquee color', mcolor);
/* merch heading */
const mh = await pg.evaluate(() => document.querySelector('.merch-section .section-heading h2')?.textContent.trim());
console.log('merch heading:', mh);
await pg.evaluate(() => document.querySelector('.merch-section').scrollIntoView({ block: 'start' }));
await new Promise(r => setTimeout(r, 600));
await shoot(pg, 'merch_heading_390');

/* ===== Gallery rows: gap check at row starts ===== */
await pg.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
await pg.goto(B + 'index.html', { waitUntil: 'networkidle2', timeout: 60000 });
await skipIntro(pg);
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(() => document.querySelector('.cine-gallery').scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 1200));
await shoot(pg, 'gallery_desktop');
await new Promise(r => setTimeout(r, 3500));
await shoot(pg, 'gallery_desktop_c2');
/* verify seamless: track half width vs viewport */
const trk = await pg.evaluate(() => {
  return [...document.querySelectorAll('.cine-g-track, .cine-m-track')].map(t => {
    const seq = t.querySelector('.cine-g-seq, .cine-m-item');
    return { cls: t.className, seqW: Math.round(seq.getBoundingClientRect().width), vp: window.innerWidth, n: t.children.length };
  });
});
console.log('tracks', JSON.stringify(trk, null, 1));

/* ===== Footer on all 7 pages (desktop + mobile) ===== */
const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html'];
for (const p of pages) {
  await pg.goto(B + p, { waitUntil: 'networkidle2', timeout: 60000 });
  await skipIntro(pg);
  const f = await pg.evaluate(() => {
    const el = document.querySelector('.site-footer');
    el.scrollIntoView();
    const social = [...document.querySelectorAll('.footer-slink')].map(a => a.textContent.trim());
    const pw = document.querySelector('.pw-ig');
    const r = pw ? pw.getBoundingClientRect() : null;
    return { social, igW: r ? Math.round(r.width) : 0, color: pw ? getComputedStyle(pw).color : 'none', waHref: document.querySelector('.footer-wa')?.href || 'MISSING' };
  });
  console.log(p, JSON.stringify(f));
  await new Promise(r => setTimeout(r, 400));
  await pg.screenshot({ path: '_qa_footer_' + p.replace('.html', '') + '.png' });
}
await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
await pg.goto(B + 'index.html', { waitUntil: 'networkidle2', timeout: 60000 });
await skipIntro(pg);
await pg.evaluate(() => document.querySelector('.site-footer').scrollIntoView());
await new Promise(r => setTimeout(r, 500));
await pg.screenshot({ path: '_qa_footer_mobile_390.png' });

/* responsive sweep — overflow check */
for (const w of [355, 375, 390, 414, 430]) {
  await pg.setViewport({ width: w, height: 800, deviceScaleFactor: 2, isMobile: true });
  await pg.goto(B + 'index.html', { waitUntil: 'networkidle2', timeout: 60000 });
  await skipIntro(pg);
  const ov = await pg.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log('width', w, 'overflow', ov);
}
await browser.close();
console.log('SHOTS:', shots.join(','));
