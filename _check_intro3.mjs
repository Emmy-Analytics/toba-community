export default async function (page) {
  await page.evaluate(() => { try { sessionStorage.clear() } catch (e) { } });
  await page.reload();
  await page.waitForTimeout(3400);
  await page.screenshot({ path: '_intro_full_copy.png' });
  await page.waitForTimeout(2400);
  await page.screenshot({ path: '_intro_after.png' });
  const data = await page.evaluate(() => {
    const c = document.querySelector('.obi-copy');
    const f = document.querySelector('.obi-figure');
    const k = document.querySelector('.obi-kocak');
    return {
      kocakOpacity: k ? getComputedStyle(k).opacity : 'gone',
      copyVisible: c ? getComputedStyle(c).opacity : 'no-copy-el',
      figureOpacity: f ? getComputedStyle(f).opacity : 'gone'
    };
  });
  return data;
}
