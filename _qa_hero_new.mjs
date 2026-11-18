/* QA hero: cek slot, overlap, dan screenshot per breakpoint */
export default async function run(page, ui) {
  const vw = Number(process.env.QA_VW || 1440);
  await page.setViewportSize({ width: vw, height: 900 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000); /* beri waktu fade-in + API */
  const data = await page.evaluate(() => {
    const box = document.getElementById('heroCutShow');
    if (!box) return { error: 'no heroCutShow' };
    const imgs = [...box.querySelectorAll('img')];
    const rects = imgs.map(im => { const r = im.getBoundingClientRect(); return { cls: im.className, on: im.classList.contains('cut-on'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; });
    /* cek overlap antar foto cut-on */
    const on = rects.filter(r => r.on && r.w > 5);
    let overlaps = [];
    for (let i = 0; i < on.length; i++) for (let j = i + 1; j < on.length; j++) {
      const a = on[i], b = on[j];
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox > 4 && oy > 4) overlaps.push({ a: a.cls, b: b.cls, ox, oy });
    }
    const hscroll = document.documentElement.scrollWidth > window.innerWidth + 2;
    const cta = document.querySelector('.hero-actions');
    const ctaTop = cta ? cta.getBoundingClientRect().top : -1;
    const lowestPhoto = on.length ? Math.max(...on.map(r => r.y + r.h)) : -1;
    return { count: imgs.length, rects, on: on.length, overlaps, hscroll, ctaTop: Math.round(ctaTop), lowestPhoto: Math.round(lowestPhoto), ctaClear: ctaTop < 0 || lowestPhoto <= ctaTop };
  });
  await page.screenshot({ path: 'G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY 2023-2026 - CASHIER GENERAL AFFAIR/EMMY/BDA/PROJECT 6/_qa_hero_' + vw + '.png' });
  return data;
}
