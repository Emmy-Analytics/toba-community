export default async function run(page) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:8000/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.click('#tobiLauncher');
  await page.waitForTimeout(600);
  const info = await page.evaluate(() => {
    const c = document.getElementById('tobiClose');
    const r = c.getBoundingClientRect();
    const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    const p = document.getElementById('tobiPanel');
    return {
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      atPoint: el ? el.id || el.className || el.tagName : null,
      panelHidden: p.hidden, panelClass: p.className, panelZ: getComputedStyle(p).zIndex
    };
  });
  return info;
}
