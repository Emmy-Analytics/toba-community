export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'domcontentloaded' });
  // skip intro jika ada
  try { const s = page.locator('#introSkip, .invite-skip'); if (await s.count()) await s.first().click({ timeout: 3000 }); } catch { }
  await page.waitForTimeout(4000);
  const res = {};
  res.overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  res.stageH = await page.evaluate(() => { const b = document.querySelector('.hero-cut-slideshow'); return b ? b.getBoundingClientRect().height : 0; });
  res.imgs = await page.evaluate(() => Array.from(document.querySelectorAll('.hero-cut-img')).filter(e => e.style.display !== 'none').map(e => ({ slot: e.dataset.slot, w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height), on: e.classList.contains('cut-on') })));
  res.cta = await page.evaluate(() => Array.from(document.querySelectorAll('.hero-actions .pill')).map(p => { const r = p.getBoundingClientRect(); return { t: p.textContent.trim().slice(0, 20), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x) }; }));
  res.musicOverlap = await page.evaluate(() => { const fab = document.querySelector('#tobaMusicRoot'); const info = document.querySelector('.hero-info'); if (!fab || !info) return null; const a = fab.getBoundingClientRect(), b = info.getBoundingClientRect(); return a.top < b.bottom && a.right > b.left; });
  await page.screenshot({ path: 'C:/Users/Public/hero_390.png' });
  for (const w of [320, 375, 430]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.waitForTimeout(1500);
    res['ov_' + w] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: 'C:/Users/Public/hero_' + w + '.png' });
  }
  return res;
}
