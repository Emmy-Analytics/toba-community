const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export default async function run(page) {
  const msgs = [];
  page.on('console', (m) => msgs.push(m.type() + ': ' + m.text()));
  page.on('pageerror', (e) => msgs.push('PAGEERROR: ' + e.message));
  await sleep(3000);
  await page.click('#footerWaBtn');
  await sleep(200);
  await page.click('#footerWaJoin');
  await sleep(400);
  // Patch closeModal visibility to log who closes it
  await page.evaluate(() => {
    const jm = document.getElementById('joinModal');
    const origHidden = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'hidden');
    window._log = [];
    jm.addEventListener('hidden' in jm ? 'bogus' : 'bogus', () => { });
    // monkey-patch: wrap property set via setter unavailable; instead poll
    window._poll = setInterval(() => {
      if (jm.hidden) window._log.push('HIDDEN at ' + new Error().stack);
      clearInterval(window._poll); window._poll = setInterval(() => { }, 1e9);
    }, 100);
  });
  await page.evaluate(() => document.querySelector('#joinModal button[type="submit"]')?.click());
  await sleep(600);
  const res = await page.evaluate(() => {
    const err = document.getElementById('joinErr');
    return {
      modalHidden: document.getElementById('joinModal').hidden,
      errHidden: err ? err.hidden : null,
      errText: err ? err.textContent : null,
      log: (window._log || []).length,
    };
  });
  console.log('RESULT:', JSON.stringify(res, null, 1));
  console.log('CONSOLE:', msgs.join('\n'));
}
