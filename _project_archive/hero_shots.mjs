export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'domcontentloaded' });
  try { const s = page.locator('#introSkip, .invite-skip'); if (await s.count()) await s.first().click({ timeout: 3000 }); } catch { }
  await page.waitForTimeout(4000);
  await page.screenshot({ path: '_project_archive/shots/hero_390.png' });
  for (const w of [320, 430]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '_project_archive/shots/hero_' + w + '.png' });
  }
  return 'ok';
}
