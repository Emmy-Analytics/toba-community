export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'domcontentloaded' });
  try { const s = page.locator('#introSkip, .invite-skip'); if (await s.count()) await s.first().click({ timeout: 3000 }); } catch { }
  await page.waitForTimeout(3500);
  const snap = () => page.evaluate(() => {
    const box = document.querySelector('.hero-cut-slideshow');
    const els = Array.from(document.querySelectorAll('.hero-cut-img')).map(e => ({
      cls: e.className.replace('hero-cut-img', '').trim().slice(0, 30),
      slot: e.dataset.slot || '',
      disp: e.style.display || '',
      vis: getComputedStyle(e).visibility,
      op: getComputedStyle(e).opacity,
      w: Math.round(e.getBoundingClientRect().width),
      h: Math.round(e.getBoundingClientRect().height),
      on: e.classList.contains('cut-on')
    }));
    return { stage: box ? { h: Math.round(box.getBoundingClientRect().height), cols: box.style.gridTemplateColumns } : null, els, srcs: els.length };
  });
  const t0 = await snap();
  await page.screenshot({ path: '_project_archive/shots/reg_390_a.png' });
  await page.waitForTimeout(9000);
  const t1 = await snap();
  await page.waitForTimeout(9000);
  const t2 = await snap();
  await page.screenshot({ path: '_project_archive/shots/reg_390_b.png' });
  return { t0, t1_on: t1.els.filter(e => e.on).length, t2: t2 };
}
