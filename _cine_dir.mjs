export default async function run(page) {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  await page.evaluate(() => { document.querySelector('.cine-g-row').scrollIntoView({ block: 'center' }); });
  await sleep(2000);
  const snap = () => page.evaluate(() => [...document.querySelectorAll('.cine-g-track, .cine-m-track')].map(tr => ({
    dir: tr.dataset.dir, speed: tr.dataset.speed,
    tf: getComputedStyle(tr).transform,
    x: +tr.getBoundingClientRect().x.toFixed(1)
  })));
  const a = await snap();
  await sleep(1500);
  const b = await snap();
  return JSON.stringify(a.map((s, i) => ({ ...s, dx: +(b[i].x - s.x).toFixed(1) })), null, 1);
}
