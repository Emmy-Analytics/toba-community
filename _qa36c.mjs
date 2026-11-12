export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const r = await page.evaluate(async () => {
    const btn = document.getElementById('joinCtaBtn');
    btn.click();
    await new Promise(res => setTimeout(res, 300));
    const m = document.getElementById('joinModal');
    const modalOpen = !m.hidden;
    const errs = [];
    // try footer button too
    if (!modalOpen) {
      const fb = document.getElementById('footerWaBtn');
      fb.click();
      await new Promise(res => setTimeout(res, 200));
    }
    return { modalOpen: !m.hidden, hasBtn: !!btn, hasFb: !!document.getElementById('footerWaBtn') };
  });
  // real user click
  await page.mouse.click(10, 10);
  await page.getByRole('button', { name: /Hubungi TOBA|Contact/i }).first().click().catch(e => r.realClickErr = e.message);
  await page.waitForTimeout(300);
  r.modalAfterRealClick = await page.evaluate(() => !document.getElementById('joinModal').hidden);
  // scroll test instant
  const s = await page.evaluate(async () => {
    window.scrollTo({ top: 999999, behavior: 'instant' });
    await new Promise(res => setTimeout(res, 100));
    const f = document.querySelector('footer').getBoundingClientRect();
    return { footerTop: Math.round(f.top), vh: window.innerHeight, scrollY: Math.round(window.scrollY), maxScroll: document.body.scrollHeight - window.innerHeight };
  });
  r.scroll = s;
  return r;
}
