export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'domcontentloaded' });
  try { const s = page.locator('#introSkip, .invite-skip'); if (await s.count()) await s.first().click({ timeout: 3000 }); } catch { }
  await page.waitForTimeout(4000);
  // bola: posisi sekarang vs 3 detik lagi (idle drift/bounce harus menggerakkan)
  const bpos = () => page.evaluate(() => { const b = document.querySelector('.hero-cut-img.cut-ball'); if (!b) return null; const t = b.style.transform || ''; return { bx: b.style.getPropertyValue('--bx'), by: b.style.getPropertyValue('--by'), br: b.style.getPropertyValue('--br'), tr: t.slice(0, 60) }; });
  const b0 = await bpos();
  await page.waitForTimeout(3000);
  const b1 = await bpos();
  await page.waitForTimeout(12000); // 1 siklus penuh rotasi
  const cycleCount = await page.evaluate(() => document.querySelectorAll('.hero-cut-img.cut-on').length);
  for (const w of [320, 375, 430]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: '_project_archive/shots/fin_' + w + '.png' });
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  return { ball_moved: JSON.stringify(b0) !== JSON.stringify(b1), b0, b1, activeAfterCycle: cycleCount, overflow };
}
