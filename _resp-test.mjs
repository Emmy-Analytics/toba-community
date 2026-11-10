export default async function run(page, ui) {
  const results = {};
  for (const w of [355, 375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width: w, height: 844 });
    await page.goto('http://localhost:8099/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => {
      const b = document.body;
      const overflowX = b.scrollWidth > window.innerWidth + 2;
      const mascot = document.querySelector('.hero-mascot');
      const court = document.querySelector('.hero-court');
      return {
        overflowX,
        mascotVisible: mascot ? mascot.getBoundingClientRect().width > 0 : false,
        courtVisible: court ? getComputedStyle(court).opacity !== '0' : false,
        h1Size: getComputedStyle(document.querySelector('.hero-home h1')).fontSize
      };
    });
    results['w' + w] = r;
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:8099/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: '_qa-hero-390.png' });
  await page.goto('http://localhost:8099/gallery.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '_qa-gallery-390.png', fullPage: false });
  const g = await page.evaluate(() => {
    const blur = document.querySelector('.gallery-hero-blur');
    return {
      blurBg: blur ? getComputedStyle(blur, '::before').backgroundImage.slice(0, 60) : 'none',
      gridItems: document.querySelectorAll('.gallery-item').length
    };
  });
  results.gallery = g;
  return results;
}
