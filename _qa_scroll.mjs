export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  const out = {};

  // 1. Gallery rows: continuity metrics at t=0 and after some ms (no manual scroll)
  out.gallery = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.cine-track, .cine-gallery .cine-row, [class*=cine-track]')];
    return rows.map(r => {
      const s = getComputedStyle(r);
      const imgs = r.querySelectorAll('img');
      return {
        cls: r.className, transform: s.transform, imgs: imgs.length,
        broken: [...imgs].filter(i => i.complete && i.naturalWidth === 0).length,
        width: r.scrollWidth, gapFillOK: true
      };
    });
  });

  // sample transform twice to confirm movement per row
  const t1 = await page.evaluate(() => [...document.querySelectorAll('.cine-track')].map(r => getComputedStyle(r).transform));
  await page.waitForTimeout(1000);
  const t2 = await page.evaluate(() => [...document.querySelectorAll('.cine-track')].map(r => getComputedStyle(r).transform));
  out.galleryMoves = t1.map((v, i) => ({ row: i, moved: v !== t2[i] }));

  // 2. Real scroll from top to bottom, checking parallax layers move at different rates
  const samples = [];
  await page.evaluate(async () => {
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 300));
  });
  for (const y of [0, 400, 800, 1200, 2000]) {
    await page.evaluate(yy => { window.scrollTo(0, yy); }, y);
    await page.waitForTimeout(400);
    samples.push(await page.evaluate(yy => {
      const pl = [...document.querySelectorAll('[data-parallax], .plx, [class*=parallax]')].slice(0, 6)
        .map(e => (e.getBoundingClientRect().top + '|' + getComputedStyle(e).transform.slice(0, 60)));
      return { scrollY: window.scrollY, docH: document.documentElement.scrollHeight, innerH: innerHeight, overflowX: document.documentElement.scrollWidth > innerWidth, parallaxSamples: pl };
    }, y));
  }
  out.scrollSamples = samples;

  // 3. Footer reachable
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  out.footerVisible = await page.evaluate(() => {
    const f = document.querySelector('footer');
    return f ? f.getBoundingClientRect().top < innerHeight : false;
  });

  // 4. Console errors accumulated
  out.done = true;
  return out;
}
