export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('file:///g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/gallery.html');
  await page.waitForTimeout(8000);
  const r = await page.evaluate(() => {
    const span = document.querySelector('.gallery-hero-title .gh-accent');
    const c = document.getElementById('hlCarousel');
    c.querySelector('.hl-panel[data-idx="1"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const during = { cls: span.className, color: getComputedStyle(span).color, newVar: span.style.getPropertyValue('--liquid-new') };
    return { during, accentFns: typeof heroAccent };
  });
  return r;
}
