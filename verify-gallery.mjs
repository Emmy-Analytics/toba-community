export default async function run(page, ui) {
  // wait for photos to load from the API
  await page.waitForFunction(() => document.querySelectorAll('.gallery-item').length > 0, null, { timeout: 25000 });
  const r1 = await page.evaluate(() => ({
    cards: document.querySelectorAll('.gallery-item').length,
    heroShots: document.querySelectorAll('.gh-shot').length,
    state: (window.galleryState || 'n/a'),
    masterCount: (window.galleryPhotos || []).length
  }));

  // filter sequence test: All -> Tobaladies -> Tobadeli -> All
  const seq = [];
  const clickFilter = async (name) => {
    await page.locator(`#galleryFilters [data-filter="${name}"]`).click();
    await page.waitForTimeout(300);
    seq.push({ filter: name, cards: await page.evaluate(() => document.querySelectorAll('.gallery-item').length) });
  };
  await clickFilter('Tobaladies');
  await clickFilter('Tobadeli');
  await clickFilter('All');
  await clickFilter('Tobaladies');
  await clickFilter('All');

  // search test
  await page.fill('#gallerySearch', 'zzz-no-match-zzz');
  await page.waitForTimeout(500);
  const searchState = await page.evaluate(() => ({
    emptyStateText: (document.querySelector('.gallery-state') || {}).textContent || '',
    hasClearBtn: !!document.getElementById('galleryClearSearch')
  }));
  await page.click('#galleryClearSearch');
  await page.waitForTimeout(300);
  const afterClear = await page.evaluate(() => document.querySelectorAll('.gallery-item').length);

  // screenshot desktop
  await page.screenshot({ path: 'gallery-desktop.png', fullPage: false });

  // mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  await page.screenshot({ path: 'gallery-mobile.png' });

  return { initial: r1, filterSequence: seq, searchState, cardsAfterClear: afterClear, mobileOverflow };
}
