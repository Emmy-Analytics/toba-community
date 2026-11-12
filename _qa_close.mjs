export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2200);
  await page.evaluate(() => document.getElementById('joinCtaBtn')?.click());
  await page.waitForTimeout(300);
  const open = await page.evaluate(() => !document.getElementById('joinModal').hidden);
  // escape via keyboard on the focused element (inside page)
  await page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
  await page.waitForTimeout(250);
  const closedEsc = await page.evaluate(() => document.getElementById('joinModal').hidden);
  // reopen, close via backdrop
  await page.evaluate(() => document.getElementById('joinCtaBtn').click());
  await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('#joinModal .join-backdrop')?.click());
  await page.waitForTimeout(250);
  const closedBackdrop = await page.evaluate(() => document.getElementById('joinModal').hidden);
  // reopen, close via X button
  await page.evaluate(() => document.getElementById('joinCtaBtn').click());
  await page.waitForTimeout(200);
  const closeBtnInfo = await page.evaluate(() => {
    const b = document.querySelector('#joinModal [data-join-close]:not(.join-backdrop)');
    return { exists: !!b, tag: b ? b.tagName : null };
  });
  await page.evaluate(() => document.querySelector('#joinModal [data-join-close]:not(.join-backdrop)')?.click());
  await page.waitForTimeout(250);
  const closedX = await page.evaluate(() => document.getElementById('joinModal').hidden);
  return { open, closedEsc, closedBackdrop, closedX, closeBtnInfo };
}
