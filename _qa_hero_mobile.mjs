/* QA hero mobile: viewport di-set SEBELUM navigasi */
export default async function run(page, ui) {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(7000);
  return await page.evaluate(() => {
    const h = document.querySelector('.hero-home');
    const b = h.querySelector('.hero-cut-slideshow');
    const bs = getComputedStyle(b);
    const imgs = [...b.querySelectorAll('img')];
    const rects = imgs.map(im => { const r = im.getBoundingClientRect(); return { cls: im.className.split(' ').slice(-2).join(' '), on: im.classList.contains('cut-on'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; });
    return { area: bs.gridArea, pos: bs.position, box: { x: Math.round(b.getBoundingClientRect().x), y: Math.round(b.getBoundingClientRect().y), w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height) }, vw: innerWidth, rects };
  });
}
