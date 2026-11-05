export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => { sessionStorage.clear(); localStorage.setItem('toba-lang', 'id'); });
  await page.goto(page.url() + '?final=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const sk = page.locator('.obi-skip');
  if (await sk.count() && await sk.isVisible()) await sk.click();
  await page.waitForTimeout(2400);
  await page.screenshot({ path: '_qa-hero-proof.png' });
  return 'ok';
}
