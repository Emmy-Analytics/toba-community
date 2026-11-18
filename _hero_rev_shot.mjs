export default async function run(page, ui) {
  const out = {};
  const measure = () => {
    const gp = (s) => { const el = document.querySelector(s); if (!el) return null; const r = el.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right) }; };
    const vis = [...document.querySelectorAll('.hero-cut-img.cut-on')].filter(el => el.offsetWidth > 0).map(el => {
      const r = el.getBoundingClientRect();
      return { size: el.dataset.size, slot: el.dataset.slot || '', l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width), src: decodeURIComponent(el.src.split('/').pop()) };
    });
    vis.sort((a, b) => a.l - b.l);
    const act = gp('.hero-actions'), inf = gp('.hero-info');
    const hit = (v, box) => box && v.b > box.t + 2 && v.t < box.b;
    return { vw: innerWidth, visible: vis,
      overlapCTA: vis.some(v => hit(v, act)), overlapInfo: vis.some(v => hit(v, inf)),
      overlapEach: (() => { for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) { const a = vis[i], b = vis[j]; if (a.l < b.r - 4 && b.l < a.r - 4 && a.t < b.b - 4 && b.t < a.b - 4) return [a.src, b.src]; } return false; })(),
      overflowX: document.documentElement.scrollWidth > window.innerWidth };
  };
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8099/index.html');
  await page.waitForSelector('.hero-home.in', { timeout: 30000 });
  await page.waitForTimeout(9500);
  await page.screenshot({ path: '_hero_rev_desktop.png' });
  out.desktop = await page.evaluate(measure);
  // MOBILE 390
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:8099/index.html');
  await page.waitForSelector('.hero-home.in', { timeout: 30000 });
  await page.waitForTimeout(9500);
  await page.screenshot({ path: '_hero_rev_mobile.png' });
  out.mobile = await page.evaluate(measure);
  return out;
}
