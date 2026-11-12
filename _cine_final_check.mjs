// Final targeted check: reach bottom + rows move while in view
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function run(page) {
  const out = {};

  // Scroll smoothly through the whole page (no scroll hijack check too)
  const reached = await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    let y = 0;
    const t0 = performance.now();
    while (y < h && performance.now() - t0 < 9000) {
      y += 600;
      window.scrollTo({ top: y, left: 0, behavior: 'instant' });
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
      await new Promise((r) => setTimeout(r, 12));
    }
    return {
      reached: window.scrollY >= h - 40,
      scrollY: window.scrollY,
      h,
      overflowX: document.documentElement.scrollWidth - innerWidth,
      domNodes: document.querySelectorAll('*').length,
    };
  });
  out.reach = reached;

  // Now scroll back to the gallery and measure row movement while visible
  await page.evaluate(() => {
    const g = document.querySelector('.cine-gallery');
    if (g) g.scrollIntoView({ block: 'center' });
  });
  await sleep(700);
  const x1 = await page.evaluate(() =>
    [...document.querySelectorAll('.cine-g-track')].map(
      (e) => e.getBoundingClientRect().x
    )
  );
  await sleep(1600);
  const x2 = await page.evaluate(() =>
    [...document.querySelectorAll('.cine-g-track')].map(
      (e) => e.getBoundingClientRect().x
    )
  );
  out.rowsDx = x1.map((v, i) => +(x2[i] - v).toFixed(1));
  out.rowDirs = await page.evaluate(() =>
    [...document.querySelectorAll('.cine-g-track')].map((e) => e.dataset.dir)
  );

  // No repeated scroll after settle — page stays put (no scroll forcing)
  const sy1 = await page.evaluate(() => window.scrollY);
  await sleep(1200);
  const sy2 = await page.evaluate(() => window.scrollY);
  out.scrollDrift = +(sy2 - sy1).toFixed(1);

  return out;
}
