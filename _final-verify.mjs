/* Final verification: language switch, court visuals, all pages. */
import puppeteer from 'puppeteer';
const base = 'file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/';
const browser = await puppeteer.launch({ headless: 'new' });

/* --- 1. language switch on every page --- */
const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'game.html', 'partnership.html'];
for (const p of pages) {
  const pg = await browser.newPage();
  await pg.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await pg.goto(base + p, { waitUntil: 'load' });
  await pg.evaluate(() => document.querySelector('.obi-skip,.tld-skip,.tdl-skip')?.click());
  await new Promise(r => setTimeout(r, 700));
  // open drawer and click ID inside the drawer's own lang tools? — language tools are in the header, not the drawer
  const res = await pg.evaluate(async () => {
    const btn = document.querySelector('.lang-btn[data-lang="id"]');
    if (!btn) return 'noBtn';
    btn.click();
    await new Promise(r => setTimeout(r, 300));
    const label = document.querySelector('[data-i18n="nav.explore"]')?.textContent
      || document.querySelector('[data-i18n="cta.join"]')?.textContent;
    return label;
  });
  const shots = await pg.screenshot({ path: `_fin-${p.replace('.html', '')}-390.png` });
  console.log(p.replace('.html', ''), 'ID switch →', res);
  await pg.close();
}

/* --- 2. EN/ID on desktop with mega menu --- */
const d = await browser.newPage();
await d.setViewport({ width: 1440, height: 900 });
await d.goto(base + 'index.html', { waitUntil: 'load' });
await d.evaluate(() => document.querySelector('.obi-skip')?.click());
await new Promise(r => setTimeout(r, 700));
await d.click('#navExplore');
await new Promise(r => setTimeout(r, 500));
await d.screenshot({ path: '_fin-desktop-mega-EN.png' });
await d.evaluate(() => document.querySelector('.lang-btn[data-lang="id"]').click());
await new Promise(r => setTimeout(r, 500));
await d.screenshot({ path: '_fin-desktop-mega-ID.png' });
console.log('desktop lang switched mega stays open:', await d.evaluate(() => document.getElementById('megaMenu').classList.contains('open')));
await d.close();

/* --- 3. court geometry close-ups --- */
const c = await browser.newPage();
await c.setViewport({ width: 1440, height: 900 });
await c.goto(base + 'tobaladies.html', { waitUntil: 'load' });
await c.evaluate(() => document.querySelector('.tld-skip')?.click());
await new Promise(r => setTimeout(r, 2600)); // let draw animation finish
await c.screenshot({ path: '_fin-court-ladies-1440.png' });
await c.close();
const c2 = await browser.newPage();
await c2.setViewport({ width: 390, height: 844, isMobile: true });
await c2.goto(base + 'tobadeli.html', { waitUntil: 'load' });
await c2.evaluate(() => document.querySelector('.tdl-skip')?.click());
await new Promise(r => setTimeout(r, 2400));
await c2.screenshot({ path: '_fin-court-deli-390.png' });
await c2.close();

/* --- 4. drawer open visual at 390 --- */
const dr = await browser.newPage();
await dr.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await dr.goto(base + 'partnership.html', { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 700));
await dr.click('#menuToggle');
await new Promise(r => setTimeout(r, 500));
await dr.evaluate(() => document.querySelector('.mega-label')?.click());
await new Promise(r => setTimeout(r, 400));
await dr.screenshot({ path: '_fin-drawer-390.png' });
await dr.close();

await browser.close();
console.log('FINAL VERIFY DONE');
