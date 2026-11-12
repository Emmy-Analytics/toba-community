export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  const r = {};
  r.before = await page.evaluate(() => {
    const m = document.getElementById('joinModal');
    return {
      exists: !!m, hidden: m ? m.hidden : null, style: m ? m.getAttribute('style') : null, cls: m ? m.className : null,
      btn: !!document.getElementById('joinCtaBtn'), btnVisible: (() => { const b = document.getElementById('joinCtaBtn'); if (!b) return false; const s = getComputedStyle(b); return s.display !== 'none' && s.visibility !== 'hidden'; })()
    };
  });
  // dispatch real click
  await page.evaluate(() => document.getElementById('joinCtaBtn')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(400);
  await page.evaluate(() => document.getElementById('joinCtaBtn')?.click());
  await page.waitForTimeout(500);
  r.after = await page.evaluate(() => {
    const m = document.getElementById('joinModal');
    return { hidden: m.hidden, style: m.getAttribute('style'), cls: m.className, rect: m.getBoundingClientRect().height, display: getComputedStyle(m).display };
  });
  // close and reopen via footer
  await page.evaluate(() => { const c = document.querySelector('#joinModal .modal-close, #joinModal [data-close], #joinModal button'); c && c.click(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => document.getElementById('footerWaBtn')?.click());
  await page.waitForTimeout(400);
  r.footer = await page.evaluate(() => ({ hidden: document.getElementById('joinModal').hidden }));
  return r;
}
