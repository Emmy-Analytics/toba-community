/* QA mobile 393: ukur hero & slot dengan viewport mobile asli */
export default async function run(page, ui) {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000);
  const data = await page.evaluate(() => {
    const h = document.querySelector('.hero-home');
    const b = h.querySelector('.hero-cut-slideshow');
    const cs = getComputedStyle(h);
    const imgs = [...b.querySelectorAll('img')];
    const on = imgs.filter(im => im.classList.contains('cut-on') && im.getBoundingClientRect().width > 4);
    const rects = on.map(im => { const r = im.getBoundingClientRect(); return { cls: im.className.split(' ').find(c => c.startsWith('slot')) || im.className.split(' ').find(c => c.includes('ball')), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; });
    let overlaps = [];
    for (let i = 0; i < on.length; i++) for (let j = i + 1; j < on.length; j++) {
      const a = on[i].getBoundingClientRect(), c = on[j].getBoundingClientRect();
      const ox = Math.min(a.right, c.right) - Math.max(a.x, c.x);
      const oy = Math.min(a.bottom, c.bottom) - Math.max(a.y, c.y);
      if (ox > 4 && oy > 4) overlaps.push(ox.toFixed(0) + 'x' + oy.toFixed(0));
    }
    const cta = h.querySelector('.hero-actions');
    return { hH: cs.height, boxH: Math.round(b.getBoundingClientRect().height), boxW: Math.round(b.getBoundingClientRect().width), vw: innerWidth, hscroll: document.documentElement.scrollWidth > innerWidth + 2, rects, overlaps, ctaTop: Math.round(cta.getBoundingClientRect().top), lowest: Math.round(Math.max(...on.map(im => im.getBoundingClientRect().bottom))) };
  });
  await page.screenshot({ path: 'G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY 2023-2026 - CASHIER GENERAL AFFAIR/EMMY/BDA/PROJECT 6/_qa_hero_393.png' });
  return data;
}
