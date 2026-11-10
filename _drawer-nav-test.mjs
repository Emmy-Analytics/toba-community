export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:8099/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await page.locator('#menuToggle').click();
  await page.waitForTimeout(500);
  // expand WHAT'S ON accordion
  await page.locator('.mega-label', { hasText: "WHAT'S ON" }).click();
  await page.waitForTimeout(400);
  const accordOpen = await page.locator('.mega-group.open .nav-link[data-nav="events"]').isVisible();
  await page.screenshot({ path: '_qa17-accordion.png' });
  // click Events link
  await page.locator('.mega-group.open .nav-link[data-nav="events"]').click();
  await page.waitForURL('**/events.html', { timeout: 5000 }).catch(() => { });
  await page.waitForTimeout(1200);
  const url = page.url();
  const navOpenOnNewPage = await page.evaluate(() => document.getElementById('mainNav')?.classList.contains('open'));
  const drawerWidth = await page.evaluate(() => { const n = document.getElementById('mainNav'); return n ? getComputedStyle(n).width : null; });
  return { accordOpen, landedOn: url, navClosedOnNewPage: !navOpenOnNewPage, drawerWidthOnNewPage: drawerWidth };
}
