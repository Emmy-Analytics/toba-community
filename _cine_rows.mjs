export default async function run(page) {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  // scroll gallery into view
  await page.evaluate(() => {
    const el = document.querySelector('.cine-g-row');
    el.scrollIntoView({ block: 'center' });
  });
  await sleep(2500); // let IO activate + tracks start
  const rows = {};
  for (const [name, sel] of [['r1(28s,rtl)', '.cine-g-r1 .cine-g-track'], ['r2(38s,ltr)', '.cine-g-r2 .cine-g-track'], ['r3(48s,rtl)', '.cine-g-r3 .cine-g-track']]) {
    const a = await page.evaluate(s => document.querySelector(s).getBoundingClientRect().x, sel);
    await sleep(1500);
    const b = await page.evaluate(s => document.querySelector(s).getBoundingClientRect().x, sel);
    rows[name] = { dx: +(b - a).toFixed(1), dir: b < a ? 'leftward OK' : b > a ? 'rightward OK' : 'STUCK' };
  }
  // bottom reach check
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await sleep(600);
  const bottom = await page.evaluate(() => ({ y: window.scrollY, max: document.documentElement.scrollHeight - innerHeight }));
  return JSON.stringify({ rows, bottom }, null, 1);
}
