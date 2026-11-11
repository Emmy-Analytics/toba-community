export default async function (page) {
  await page.evaluate(() => { try { sessionStorage.clear() } catch (e) { } });
  await page.reload();
  await page.waitForTimeout(3600);
  await page.screenshot({ path: '_step_intro_copy.png' });
  const copy = await page.evaluate(() => {
    const c = document.querySelector('.obi-copy');
    const f = document.querySelector('.obi-figure');
    const w = document.querySelector('.obi-wordmark');
    if (!c) return null;
    const rc = c.getBoundingClientRect(), rf = f.getBoundingClientRect(), rw = w.getBoundingClientRect();
    return { copyBottom: Math.round(rc.bottom), copyH: Math.round(rc.height), figBottom: Math.round(rf.bottom), wordmarkSize: getComputedStyle(w).fontSize, gapFigCopy: Math.round(rc.top - rf.bottom) };
  });
  return copy;
}
