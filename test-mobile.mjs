export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  // NOTE: touch emulation tidak tersedia via script API; swipe diuji dengan
  // synthetic TouchEvent (didukung Chromium headless), pointer:fine masih true
  // sehingga bindHlSwipe belum aktif — hasilnya hanya untuk struktur visual.
  await page.goto('file:///g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/gallery.html');
  await page.waitForTimeout(8000);
  const res = {};
  res.count = await page.evaluate(() => document.getElementById('galleryCount').textContent);
  res.imgOK = await page.evaluate(() => Array.from(document.querySelectorAll('.gallery-item img')).every(i => i.complete && i.naturalWidth > 0));
  // visible mobile panels
  res.panels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.hl-panel')).filter(p => p.getBoundingClientRect().width > 0).map(p => ({
      idx: p.dataset.idx, order: getComputedStyle(p).order,
      w: Math.round(p.getBoundingClientRect().width),
      accent: getComputedStyle(p).getPropertyValue('--panel-accent').trim()
    }));
  });
  // tap panel (deli idx1)
  await page.locator('.hl-panel[data-idx="1"]').dispatchEvent('click');
  await page.waitForTimeout(400);
  res.afterTap = await page.evaluate(() => ({
    activeIdx: document.querySelector('.hl-panel.active')?.dataset.idx,
    nActive: document.querySelectorAll('.hl-panel.active').length,
    accent: getComputedStyle(document.querySelector('.gallery-hero-title .gh-accent')).color,
    liquid: document.querySelector('.gh-accent')?.classList.contains('liquid-flow')
  }));
  // swipe left on track: from center of hlCarousel to the left 120px
  const box = await page.locator('#hlCarousel').boundingBox();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const swipeOK = await page.evaluate(() => {
    /* simulate swipe detection logic directly with synthetic TouchEvent */
    const c = document.getElementById('hlCarousel');
    const r = c.getBoundingClientRect();
    const y = r.top + r.height / 2, x0 = r.left + r.width / 2;
    const t = (x) => new Touch({ identifier: 1, target: c, clientX: x, clientY: y, radiusX: 2, radiusY: 2, rotationAngle: 0, force: 1 });
    c.dispatchEvent(new TouchEvent('touchstart', { touches: [t(x0)], bubbles: true, cancelable: true }));
    for (let i = 1; i <= 8; i++) c.dispatchEvent(new TouchEvent('touchmove', { touches: [t(x0 - i * 15)], bubbles: true, cancelable: true }));
    c.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [t(x0 - 120)], bubbles: true, cancelable: true }));
    return true;
  });
  await page.waitForTimeout(500);
  res.afterSwipe = await page.evaluate(() => ({
    activeIdx: document.querySelector('.hl-panel.active')?.dataset.idx,
    nActive: document.querySelectorAll('.hl-panel.active').length,
    trackTransform: getComputedStyle(document.querySelector('.hl-track')).transform
  }));
  // vertical scroll works?
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
  res.scrollY = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY 2023-2026 - CASHIER GENERAL AFFAIR/EMMY/BDA/PROJECT 6/test-mobile.png' });
  // bottom: CTA + logo
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY 2023-2026 - CASHIER GENERAL AFFAIR/EMMY/BDA/PROJECT 6/test-mobile-bottom.png' });
  return res;
}
