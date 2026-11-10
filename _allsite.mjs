export default async function run(page, ui) {
  const out = {};
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => sessionStorage.setItem('toba-intro-seen', '1'));
  const PAGES = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'gallery.html', 'merchandise.html', 'partnership.html'];
  for (const p of PAGES) {
    await page.goto('http://localhost:8931/' + p); await page.waitForTimeout(1100);
    out[p] = await page.evaluate(() => ({
      gameRefs: document.querySelectorAll('a[href="game.html"]').length,
      ball: !!document.querySelector('.hero-ball'),
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      mascotOk: [...document.images].every(i => i.complete !== false || i.loading === 'lazy'),
      activeNav: document.querySelector('.main-nav .nav-link.active')?.dataset.nav ||
        document.querySelector('.main-nav > a.active')?.dataset.nav,
    }));
    await page.screenshot({ path: `_all-${p.replace('.html', '')}-390.png` });
  }
  // desktop spot check of home + a community page
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const p of ['index.html', 'tobaladies.html']) {
    await page.goto('http://localhost:8931/' + p); await page.waitForTimeout(1100);
    out['desk-' + p] = await page.evaluate(() => ({
      gameRefs: document.querySelectorAll('a[href="game.html"]').length,
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    }));
    await page.screenshot({ path: `_all-desk-${p.replace('.html', '')}.png` });
  }
  return out;
}
