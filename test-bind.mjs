export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('file:///g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/gallery.html');
  await page.waitForTimeout(8000);
  const r = await page.evaluate(() => {
    const c = document.getElementById('hlCarousel');
    const bound = c.dataset.swipeBound || null;
    const listeners = typeof getEventListeners === 'function' ? Object.keys(getEventListeners(c)) : 'n/a';
    return { bound, listeners };
  });
  // manual test: call bindHlSwipe directly if not bound
  const r2 = await page.evaluate(() => {
    const c = document.getElementById('hlCarousel');
    if (!c.dataset.swipeBound && typeof bindHlSwipe === 'function') { try { bindHlSwipe(c); } catch (e) { return 'ERR ' + e.message; } }
    return { bound: c.dataset.swipeBound || null, fnExists: typeof bindHlSwipe };
  });
  return { r, r2 };
}
