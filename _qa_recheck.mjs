export default async function run(page) {
  const out = {};
  // 1) modal via joinCtaBtn
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  await page.evaluate(() => document.getElementById('joinCtaBtn')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(300);
  await page.evaluate(() => document.getElementById('joinCtaBtn')?.click());
  await page.waitForTimeout(400);
  out.modalOpen = await page.evaluate(() => !document.getElementById('joinModal').hidden && getComputedStyle(document.getElementById('joinModal')).display !== 'none');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  out.modalClose = await page.evaluate(() => document.getElementById('joinModal').hidden);
  // 2) hidden-sections check — scroll the full page and record any section never becoming visible
  out.sections = await page.evaluate(async () => {
    const secs = [...document.querySelectorAll('section, .section-wrap, .cine-section, footer')];
    const res = [];
    for (let y = 0; y <= document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    for (const s of secs) {
      const r = s.getBoundingClientRect();
      const vis = r.height > 0 && getComputedStyle(s).visibility !== 'hidden';
      if (!vis || r.height < 10) res.push({ sel: (s.id || s.className || s.tagName).toString().slice(0, 40), h: Math.round(r.height) });
    }
    return res;
  });
  return out;
}
