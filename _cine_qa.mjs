export default async function run(page, ui) {
  // scroll ke section cinematic & ukur pergerakan track
  const el = await page.waitForSelector('.cine-gallery', { timeout: 8000 });
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const t1 = await page.evaluate(() => document.querySelector('.cine-g-r1 .cine-g-track').style.transform);
  await page.waitForTimeout(900);
  const t2 = await page.evaluate(() => document.querySelector('.cine-g-r1 .cine-g-track').style.transform);
  // marquee
  const m = await page.waitForSelector('#cineApparel');
  await m.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const m1 = await page.evaluate(() => document.querySelector('.cine-m-track').style.transform);
  // reviews: headline + bg + pause button
  const rv = await page.waitForSelector('#cineReviews');
  await rv.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  const rev = await page.evaluate(() => ({
    headline: document.querySelector('.cine-rheadline').textContent.trim(),
    bgCount: document.querySelectorAll('.cine-rbg-img').length,
    activeBg: !!document.querySelector('.cine-rbg-img.active'),
    cardsHidden: !document.querySelector('.cine-rcard'),
    pauseBtn: !!document.querySelector('.cine-rpause'),
  }));
  // language switch keeps everything alive
  await page.evaluate(() => { document.querySelector('.lang-btn[data-lang="id"]').click(); });
  await page.waitForTimeout(600);
  const afterLang = await page.evaluate(() => ({
    idHeadline: document.querySelector('.cine-rheadline')?.textContent.trim(),
    tracksStill4: document.querySelectorAll('.cine-g-track,.cine-m-track').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  return { galleryMoved: t1 !== t2, sample: [t1, t2], marqueeSample: m1, rev, afterLang };
}
