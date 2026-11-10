export default async function run(page, ui) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8099/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 160)); } });
  await page.waitForTimeout(2500);
  const gallery = await page.evaluate(() => {
    const frames = [...document.querySelectorAll('.dark-section .photo-frame img')];
    return frames.map(i => ({ src: i.src.split('/').pop(), ok: i.complete && i.naturalWidth > 0, cs: getComputedStyle(i).opacity, w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height), frameOp: getComputedStyle(i.parentElement).opacity }));
  });
  return gallery;
}
