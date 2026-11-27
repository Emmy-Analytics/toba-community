export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('file:///g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/gallery.html');
  await page.waitForTimeout(8000);
  const r = await page.evaluate(() => {
    const c = document.getElementById('hlCarousel');
    const panels = Array.from(c.querySelectorAll('.hl-panel')).map(p => ({
      idx: p.dataset.idx,
      display: getComputedStyle(p).display,
      order: getComputedStyle(p).order,
      w: Math.round(p.getBoundingClientRect().width)
    }));
    return { panels };
  });
  return r;
}
