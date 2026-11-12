export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await page.click('#joinCtaBtn');
  await page.waitForTimeout(400);
  await page.fill('#joinModal [name=nama]', 'Test User');
  await page.fill('#joinModal [name=phone]', '081212345678');
  await page.fill('#joinModal [name=ig]', '@test');
  await page.fill('#joinModal [name=domisili]', 'Jakarta Timur');
  await page.check('#joinModal [name=team][value=Tobaladies]');
  const popupPromise = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
  await page.click('#joinModal .join-submit');
  await page.waitForTimeout(800);
  const popup = await popupPromise;
  const popupUrl = popup ? popup.url() : null;
  await popup?.close().catch(() => { });
  const state = await page.evaluate(() => ({
    modalHidden: document.getElementById('joinModal').hidden,
    toastShown: !!document.querySelector('.toast.show, #joinToast.show'),
  }));
  return { popupUrl, state };
}
