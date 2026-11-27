export default async function run(page, ui) {
  await page.goto('file:///g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/gallery.html');
  await page.waitForTimeout(8000);
  const res = {};
  // hover panel 3 (Tobaladies, pink)
  const panel = page.locator('.hl-panel[data-idx="2"]');
  await panel.hover();
  await page.waitForTimeout(400);
  res.hoverActive = await page.evaluate(() => {
    const hl = document.querySelector('.hl-panel.active');
    return {
      activeIdx: hl ? hl.dataset.idx : null,
      countActive: document.querySelectorAll('.hl-panel.active').length,
      accentColor: getComputedStyle(document.querySelector('.gallery-hero-title .gh-accent')).color,
      filter: getComputedStyle(hl.querySelector('img')).filter
    };
  });
  // leave gallery (mouse away)
  await page.mouse.move(10, 500);
  await page.waitForTimeout(600);
  res.afterLeave = await page.evaluate(() => ({
    countActive: document.querySelectorAll('.hl-panel.active').length,
    accentColor: getComputedStyle(document.querySelector('.gallery-hero-title .gh-accent')).color
  }));
  // filter test: Tobaladies
  await page.locator('#galleryFilters [data-filter="Tobaladies"]').click();
  await page.waitForTimeout(500);
  res.filter = await page.evaluate(() => ({
    items: document.querySelectorAll('.gallery-item').length,
    count: document.getElementById('galleryCount').textContent
  }));
  // search test
  await page.locator('#galleryFilters [data-filter="All"]').click();
  await page.locator('#gallerySearch').fill('zzz-notfound');
  await page.waitForTimeout(700);
  res.searchEmpty = await page.evaluate(() => document.getElementById('galleryStatus').innerText.slice(0, 60));
  await page.locator('#gallerySearch').fill('');
  await page.waitForTimeout(700);
  // screenshot with hover on panel 0
  await page.locator('.hl-panel[data-idx="0"]').hover();
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY 2023-2026 - CASHIER GENERAL AFFAIR/EMMY/BDA/PROJECT 6/test-desktop2.png', fullPage: false });
  // scroll to bottom for CTA + partner
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY 2023-2026 - CASHIER GENERAL AFFAIR/EMMY/BDA/PROJECT 6/test-bottom.png', fullPage: false });
  return res;
}
