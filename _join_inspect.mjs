const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export default async function run(page) {
  await sleep(3000);
  await page.click('#footerWaBtn');
  await sleep(300);
  await page.click('#footerWaJoin');
  await sleep(500);
  const snap = () => page.evaluate(() => {
    const m = document.getElementById('joinModal');
    if (!m) return { exists: false };
    const cs = getComputedStyle(m);
    const inp = m.querySelector('input[name="nama"]');
    const err = m.querySelector('#joinErr');
    return {
      hidden: m.hidden, disp: cs.display, op: cs.opacity,
      inpVisible: inp ? inp.offsetParent !== null : null,
      panelRect: m.querySelector('.join-panel')?.getBoundingClientRect(),
      errShown: err ? !err.hidden && err.textContent.slice(0, 60) : null,
      bodyOverflow: document.body.style.overflow,
    };
  });
  console.log('OPEN:', JSON.stringify(await snap()));
  // empty submit
  await page.evaluate(() => document.querySelector('#joinModal button[type="submit"]')?.click());
  await sleep(400);
  console.log('AFTER EMPTY SUBMIT:', JSON.stringify(await snap()));
  // fill
  try {
    await page.fill('#joinModal input[name="nama"]', 'Test User', { timeout: 5000 });
    console.log('FILL OK');
  } catch (e) { console.log('FILL FAIL:', String(e).split('\n')[0]); }
}
