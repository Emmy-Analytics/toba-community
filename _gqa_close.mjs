export default async function ({ page, log }) {
  const r = {};
  // open modal via footer button
  await page.evaluate(() => document.getElementById('footerWaBtn').scrollIntoView());
  await page.click('#footerWaBtn');
  await page.waitForTimeout(200);
  r.openFooter = await page.evaluate(() => !document.getElementById('joinModal').hidden);

  // close via X
  await page.click('.join-x');
  await page.waitForTimeout(100);
  r.closedX = await page.evaluate(() => document.getElementById('joinModal').hidden);

  // open via delegated homepage CTA
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('#joinCtaBtn').catch(() => { });
  await page.waitForTimeout(300);
  r.openCta = await page.evaluate(() => !document.getElementById('joinModal').hidden);

  // close via Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  r.closedEsc = await page.evaluate(() => document.getElementById('joinModal').hidden);

  // open again, close via backdrop
  await page.click('#footerWaBtn');
  await page.waitForTimeout(150);
  await page.click('.join-backdrop', { position: { x: 10, y: 10 } }).catch(() => { });
  await page.mouse.click(10, 10);
  await page.waitForTimeout(150);
  r.closedBackdrop = await page.evaluate(() => document.getElementById('joinModal').hidden);

  // body scroll restored
  r.bodyOverflow = await page.evaluate(() => document.body.style.overflow || '(none)');
  log(JSON.stringify(r));
}
