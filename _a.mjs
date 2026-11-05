export default async function run(page) {
  const out = {};
  // MAIN TOBA final scene + skip
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => { sessionStorage.clear(); localStorage.setItem('toba-lang', 'id'); });
  await page.goto(page.url(), { waitUntil: 'load' });
  await page.waitForTimeout(3300);
  await page.screenshot({ path: '_qa-obi-final.png' });
  out.obiFinal = await page.evaluate(() => {
    const copy = document.querySelector('.obi-copy');
    const fig = document.querySelector('.obi-figure');
    return { copyOp: getComputedStyle(copy).opacity, figOp: getComputedStyle(fig).opacity, dark: false };
  });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.click('.obi-skip');
  await page.waitForTimeout(900);
  out.obiSkip = !(await page.evaluate(() => !!document.getElementById('tobaIntro')));
  out.heroIn = await page.evaluate(() => document.querySelector('.hero-home')?.classList.contains('in'));
  // mobile main intro
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '_qa-obi-mob.png' });
  out.obiMob = await page.evaluate(() => ({ o: document.documentElement.scrollWidth > document.documentElement.clientWidth, present: !!document.getElementById('tobaIntro') }));
  // Tobaladies regression: intro still shows, own key, own visuals
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => sessionStorage.clear());
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/tobaladies.html', { waitUntil: 'load' });
  await page.waitForTimeout(700);
  out.tldShows = await page.evaluate(() => !!document.querySelector('.tld-intro'));
  out.noObiHere = await page.evaluate(() => !document.getElementById('tobaIntro'));
  // lang switch works during/after intro (home)
  await page.goto(page.url(), { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const sk = page.locator('.obi-skip');
  if (await sk.count()) await sk.click().catch(() => { });
  await page.waitForTimeout(700);
  await page.click('.lang-btn[data-lang="en"]');
  await page.waitForTimeout(600);
  out.lang = await page.evaluate(() => document.querySelector('.hero-home h1')?.innerText.slice(0, 20));
  return out;
}
