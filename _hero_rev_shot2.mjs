export default async function run(page, ui) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8099/index.html', { waitUntil: 'domcontentloaded' });
  // tunggu sampai ada foto hero yang benar-benar terlihat (opacity ~1)
  await page.waitForFunction(() => {
    const els = [...document.querySelectorAll('.hero-cut-img')];
    return els.some(el => el.offsetWidth > 0 && parseFloat(getComputedStyle(el).opacity) > 0.9);
  }, null, { timeout: 60000 });
  await page.waitForTimeout(8000); // biarkan ketiga band sempat fade-in
  const m = await page.evaluate(() => {
    const gp = s => { const el = document.querySelector(s); if (!el) return null; const r = el.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right) }; };
    const vis = [...document.querySelectorAll('.hero-cut-img.cut-on')].filter(el => el.offsetWidth > 0).map(el => {
      const r = el.getBoundingClientRect();
      return { size: el.dataset.size, slot: el.dataset.slot || '', l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), h: Math.round(r.height), src: decodeURIComponent(el.src.split('/').pop()) };
    }).sort((a, b) => a.l - b.l);
    const act = gp('.hero-actions'), inf = gp('.hero-info');
    const hit = (v, box) => box && v.b > box.t + 2 && v.t < box.b;
    return {
      vw: innerWidth, visible: vis,
      overlapCTA: vis.some(v => hit(v, act)), overlapInfo: vis.some(v => hit(v, inf)),
      overlapEach: (() => { for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) { const a = vis[i], b = vis[j]; if (a.l < b.r - 4 && b.l < a.r - 4 && a.t < b.b - 4 && b.t < a.b - 4) return [a.src, b.src]; } return false; })(),
      overflowX: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  await page.screenshot({ path: '_hero_rev_desktop.png' });
  return m;
}
