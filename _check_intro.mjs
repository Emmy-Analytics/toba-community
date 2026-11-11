export default async function (page, ui) {
  await page.evaluate(() => { try { sessionStorage.clear() } catch (e) { } });
  await page.reload();
  await page.waitForTimeout(400);
  const hasIntro = await page.evaluate(() => !!document.querySelector('#tobaIntro'));
  const kocak = await page.evaluate(() => {
    const k = document.querySelector('.obi-kocak');
    if (!k) return null;
    const c = getComputedStyle(k);
    return { bg: c.backgroundImage.slice(0, 90), op: c.opacity, disp: c.display, w: c.width, h: c.height, z: c.zIndex };
  });
  const court = await page.evaluate(() => {
    const c = document.querySelector('.obi-court');
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), strokes: c.querySelectorAll('*').length };
  });
  const fig = await page.evaluate(() => {
    const f = document.querySelector('.obi-figure img');
    if (!f) return null;
    const r = f.getBoundingClientRect();
    return { src: f.src.split('/').pop(), ok: f.complete && f.naturalWidth > 0, w: Math.round(r.width) };
  });
  await page.screenshot({ path: '_step_intro_during.png' });
  await page.waitForTimeout(5500);
  const after = await page.evaluate(() => ({ introGone: !document.querySelector('#tobaIntro') }));
  return { hasIntro, kocak, court, fig, after };
}
