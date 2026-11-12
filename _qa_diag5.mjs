export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  // A) scroll down slowly to bottom; check reveal sections become visible
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
  });
  await page.waitForTimeout(1200);
  const revealed = await page.evaluate(() =>
    [...document.querySelectorAll('main section.reveal, main .reveal')].map(s => ({
      cls: s.className.split(' ').slice(0, 2).join(' '), op: getComputedStyle(s).opacity,
      h: Math.round(s.getBoundingClientRect().height)
    })).filter(x => parseFloat(x.op) === 0 && x.h > 2)
  );
  const stuckInvisible = revealed.length;
  // B) valid-phone submit
  const sub = await page.evaluate(async () => {
    document.getElementById('joinCtaBtn')?.click();
    await new Promise(r => setTimeout(r, 300));
    const f = document.querySelector('#joinModal form');
    f.querySelector('[name=nama]').value = 'Test User';
    f.querySelector('[name=phone]').value = '081212345678';
    f.querySelector('[name=ig]').value = '@test';
    f.querySelector('[name=domisili]').value = 'Jakarta Timur';
    f.querySelector('[name=team][value=Tobaladies]').checked = true;
    f.querySelector('[name=team][value=Tobaladies]').dispatchEvent(new Event('change', { bubbles: true }));
    let captured = [];
    const ow = window.open; window.open = u => { captured.push(u); return null; };
    f.dispatchEvent(new Event('submit', { cancelable: true }));
    await new Promise(r => setTimeout(r, 400));
    window.open = ow;
    return { url: captured[0], err: document.getElementById('joinErr')?.hidden, modalClosed: document.getElementById('joinModal').hidden };
  });
  return { stuckInvisible, revealed: revealed.slice(0, 8), sub };
}
