export default async function (page) {
  await page.evaluate(() => { try { sessionStorage.clear() } catch (e) { } });
  await page.goto('http://localhost:8137/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2800);
  await page.screenshot({ path: '_intro_stage_copy.png' });
  const m = await page.evaluate(() => {
    const f = document.querySelector('.obi-figure');
    const c = document.querySelector('.obi-copy');
    if (!f || !c) return { gone: true };
    const rf = f.getBoundingClientRect(), rc = c.getBoundingClientRect();
    return { figBottom: Math.round(rf.bottom), copyTop: Math.round(rc.top), gap: Math.round(rc.top - rf.bottom), overlap: rc.top < rf.bottom };
  });
  return m;
}
