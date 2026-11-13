export default async function run(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  // dismiss intro if present
  for (const sel of ['#introSkip', '.intro-skip', '[data-intro-skip]', 'button:has-text("Lewati")']) {
    const el = page.locator(sel).first();
    if (await el.count() && await el.isVisible().catch(() => false)) { await el.click().catch(() => { }); break; }
  }
  await page.waitForTimeout(1500);
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  // hero measurements
  const hero = await page.evaluate(() => {
    const h = document.querySelector('.hero-home') || document.querySelector('#home');
    if (!h) return { found: false };
    const r = h.getBoundingClientRect();
    const parts = {};
    const q = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; };
    parts.wordmark = q('.brand-oneline') || q('.hero-brand') || q('.hero-title');
    parts.desc = q('.hero-desc, .hero-sub, .hero p');
    parts.photo = q('#heroCutShow, .hero-cut-desktop, .hero-photo, .hero-media');
    parts.cta = q('#joinCtaBtn, .hero-cta');
    parts.schedule = q('.hero-schedule, .hero-meta, .hero-info');
    parts.heroBottom = Math.round(r.bottom + scrollY);
    parts.heroHeight = Math.round(r.height);
    parts.docWidth = document.documentElement.scrollWidth;
    parts.winWidth = innerWidth;
    return parts;
  });
  await page.screenshot({ path: '_hero_mobile_390.png' });
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: '_home_mobile_390_full.png', fullPage: true });
  return { hero, errors };
}
