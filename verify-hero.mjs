export default async function run(page, ui) {
  await page.setViewportSize({ width: 1440, height: 900 });
  // skip intro if present
  const skip = page.getByText('Lewati Intro').first();
  if (await skip.isVisible().catch(() => false)) {
    await skip.click();
    await page.waitForTimeout(1000);
  }
  await page.waitForSelector('.hero-group-slideshow', { timeout: 15000 });
  // measure hero layout
  const m = await page.evaluate(() => {
    const g = (s) => document.querySelector(s);
    const r = (el) => el ? el.getBoundingClientRect() : null;
    const hero = g('.hero-home'), head = g('.hero-home .hero-head'), body = g('.hero-home .hero-body'), grp = g('.hero-group-slideshow');
    const heroR = hero && r(hero), grpR = grp && r(grp);
    return {
      lang: document.documentElement.lang,
      hero: heroR && { top: heroR.top, bottom: heroR.bottom, height: heroR.height },
      group: grpR && { top: grpR.top, bottom: grpR.bottom, height: grpR.height, width: grpR.width, position: getComputedStyle(grp).position },
      bodyBottom: body && r(body).bottom,
      overlap: heroR && grpR && (grpR.bottom > heroR.bottom),
      docWidth: document.documentElement.scrollWidth,
      winWidth: window.innerWidth,
      hasHScroll: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  await page.screenshot({ path: 'desktop-hero2.png', fullPage: true });
  return m;
}
