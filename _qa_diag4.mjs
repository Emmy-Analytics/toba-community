export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  // 1. identify "hidden" sections
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('main section')]
      .filter(s => { const cs = getComputedStyle(s); const r = s.getBoundingClientRect(); return cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0 || r.height < 2; })
      .map(s => ({ id: s.id, cls: s.className, disp: getComputedStyle(s).display, vis: getComputedStyle(s).visibility, op: getComputedStyle(s).opacity, h: Math.round(s.getBoundingClientRect().height) }))
  );
  // 2. diagnose submit handler
  const sub = await page.evaluate(async () => {
    document.getElementById('joinCtaBtn')?.click();
    await new Promise(r => setTimeout(r, 300));
    const f = document.querySelector('#joinModal form');
    const info = { formFound: !!f, html: f ? f.outerHTML.slice(0, 400) : null };
    f.querySelector('[name=nama]').value = 'Test';
    f.querySelector('[name=phone]').value = '+62812';
    f.querySelector('[name=ig]').value = '@test';
    f.querySelector('[name=domisili]').value = 'Jakarta';
    const radios = [...f.querySelectorAll('[name=team]')];
    info.radios = radios.map(r => ({ v: r.value, c: r.checked }));
    if (radios[0]) { radios[0].checked = true; radios[0].dispatchEvent(new Event('change', { bubbles: true })); }
    info.errBefore = document.getElementById('joinErr')?.hidden;
    let captured = [];
    const ow = window.open; window.open = u => { captured.push(u); return null; };
    f.dispatchEvent(new Event('submit', { cancelable: true }));
    window.open = ow;
    await new Promise(r => setTimeout(r, 400));
    info.captured = captured;
    info.errAfter = document.getElementById('joinErr')?.hidden;
    info.errText = document.getElementById('joinErr')?.textContent.trim();
    info.modalHidden = document.getElementById('joinModal').hidden;
    // check listeners on form
    info.formHTMLFull = f.outerHTML.length;
    return info;
  });
  return { hidden, sub };
}
