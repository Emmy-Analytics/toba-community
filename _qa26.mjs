export default async function run(page, ui) {
  await page.evaluate(() => { document.querySelector('.intro-overlay')?.remove(); });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: '_qa_hero_390_top.png' });
  const hero = await page.evaluate(() => {
    const secs = ['.brand-oneline', '.hero-desc', '#heroCutShow', '.hero-cta', '.hero-meta', '.hero-groups'];
    const out = {};
    for (const s of secs) {
      const e = document.querySelector(s);
      if (e) { const r = e.getBoundingClientRect(); out[s] = { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) }; }
      else out[s] = null;
    }
    return out;
  });
  await page.evaluate(() => document.querySelector('.hero-home')?.scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: '_qa_hero_390_bottom.png' });
  const vis = [];
  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(1400);
    vis.push(await page.evaluate(() => [...document.querySelectorAll('.hero-cut-img')].filter(i => getComputedStyle(i).opacity > 0.5).map(i => i.getAttribute('src'))));
  }
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: '_qa_hero_1366.png' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  return { hero, vis, overflowH: overflow };
}
