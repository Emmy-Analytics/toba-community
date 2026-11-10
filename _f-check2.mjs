export default async function run(page, ui) {
  const out = {};
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:8099/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1500);
  out.overflowPx = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const f = await page.evaluate(() => { const i = document.querySelector('.founder-photo img'); return i ? { src: i.currentSrc.split('/').pop(), ok: i.complete && i.naturalWidth > 0 } : 'none'; });
  out.founder = f;
  out.brokenImgs = await page.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.src.startsWith('http')).map(i => i.src.split('/').pop()));
  out.hiddenImgs = await page.evaluate(() => [...document.querySelectorAll('.comm-photo-card img,.founder-photo img,.event-card img,.product-card img')].filter(i => { const cs = getComputedStyle(i); return cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0 }).length);
  return out;
}
