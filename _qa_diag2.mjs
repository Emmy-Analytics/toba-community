export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  const diag = await page.evaluate(() => {
    const out = {};
    out.modalCount = document.querySelectorAll('#joinModal').length;
    out.scripts = [...document.querySelectorAll('script')].map(s => (s.src ? 'SRC:' + s.src.split('/').pop() : s.textContent.slice(0, 60).replace(/\n/g, ' ')));
    // instrument hidden setter
    const jm = document.getElementById('joinModal');
    const proto = Object.getPrototypeOf(jm);
    const desc = Object.getOwnPropertyDescriptor(proto, 'hidden');
    Object.defineProperty(proto, 'hidden', { get() { return desc.get.call(this); }, set(v) { window.__hiddenSets = (window.__hiddenSets || []); window.__hiddenSets.push(v); desc.set.call(this, v); } });
    return out;
  });
  await page.evaluate(() => document.getElementById('joinCtaBtn')?.click());
  await page.waitForTimeout(300);
  const openState = await page.evaluate(() => ({ hidden: document.getElementById('joinModal').hidden, sets: window.__hiddenSets }));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const escState = await page.evaluate(() => ({ hidden: document.getElementById('joinModal').hidden, sets: window.__hiddenSets }));
  await page.evaluate(() => document.querySelector('#joinModal .join-x')?.click());
  await page.waitForTimeout(300);
  const xState = await page.evaluate(() => ({ hidden: document.getElementById('joinModal').hidden, sets: window.__hiddenSets, vis: getComputedStyle(document.getElementById('joinModal')).display }));
  return { diag, openState, escState, xState };
}
