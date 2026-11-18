/* QA hero mobile: ukur style akhir slot-a + layout stage */
export default async function run(page, ui) {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(7000);
  return await page.evaluate(() => {
    const h = document.querySelector('.hero-home');
    const b = h.querySelector('.hero-cut-slideshow');
    const a = b.querySelector('.slot-a');
    const as = getComputedStyle(a);
    const cols = getComputedStyle(b).gridTemplateColumns;
    const rect = a.getBoundingClientRect();
    return { cols, aStyle: { position: as.position, width: as.width, maxWidth: as.maxWidth, height: as.height, maxHeight: as.maxHeight, gridCol: as.gridColumn, display: as.display }, rect: { w: Math.round(rect.width), h: Math.round(rect.height) }, aCls: a.className };
  });
}
