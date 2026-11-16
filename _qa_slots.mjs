export default async function run(page) {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.reload({ waitUntil: 'load' });
  await page.waitForSelector('.hero-cut-img', { timeout: 30000 });
  await page.waitForFunction(() => {
    const els = [...document.querySelectorAll('.hero-cut-img')];
    return els.length && els.every(e => e.complete && e.naturalWidth > 0);
  }, { timeout: 60000 });
  const snap = async (label) => await page.evaluate((label) => {
    const els = [...document.querySelectorAll('.hero-cut-img')];
    const vis = els.map(e => {
      const op = parseFloat(getComputedStyle(e).opacity);
      if (op <= 0.25) return null;
      const b = e.getBoundingClientRect();
      return {
        p: e.className.match(/cut-p\d+/)[0],
        slot: (e.dataset.slot || '-'),
        op: op.toFixed(2),
        cx: Math.round(b.left + b.width / 2),   // pusat horizontal
        w: Math.round(b.width)
      };
    }).filter(Boolean);
    return { label, vis };
  }, label);
  const out = [];
  const steps = [2000, 6000, 10000, 14000, 18000, 22000, 26000, 30000, 34000, 40000];
  let t = 0;
  for (const ms of steps) {
    await page.waitForTimeout(ms - t); t = ms;
    out.push(await snap((ms / 1000) + 's'));
    if (ms === 6000) await page.screenshot({ path: 'shot-c1.png' });
    if (ms === 18000) await page.screenshot({ path: 'shot-c2.png' });
    if (ms === 30000) await page.screenshot({ path: 'shot-c3.png' });
  }
  return out.map(o => o.label + '  ' + o.vis.map(v => `${v.p}[${v.slot}] op=${v.op} cx=${v.cx} w=${v.w}`).join(' | '));
}
