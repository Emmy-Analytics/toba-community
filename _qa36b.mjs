export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('main section')].filter(s => getComputedStyle(s).display === 'none')
      .map(s => s.className || s.id)
  );
  const modal = await page.evaluate(async () => {
    const btn = document.getElementById('joinCtaBtn');
    if (!btn) return 'no btn';
    btn.click();
    await new Promise(r => setTimeout(r, 200));
    const m = document.getElementById('joinModal');
    return { hidden: m.hidden, disp: getComputedStyle(m).display };
  });
  // scroll integrity: can we reach the footer
  const scrollOk = await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 600));
    const f = document.querySelector('footer').getBoundingClientRect();
    return { bottomVisible: f.bottom <= window.innerHeight + 5, top: Math.round(f.top) };
  });
  return { hidden, modal, scrollOk };
}
