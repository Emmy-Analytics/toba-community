// Targeted QA for Prompts 9-15 using real TOBI element IDs.
const out = {};
export default async function run(page, ui) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:8000/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);

  // 1. balloon first greeting
  out.balloon = await page.evaluate(() => {
    const b = document.getElementById('tobiBalloon');
    return b ? { hidden: b.hidden, text: (b.textContent || '').slice(0, 80) } : null;
  });

  // 2. click launcher -> panel opens with welcome
  await page.click('#tobiLauncher');
  await page.waitForTimeout(700);
  out.open = await page.evaluate(() => {
    const p = document.getElementById('tobiPanel');
    return {
      hidden: p.hidden, name: document.getElementById('tobiName').textContent,
      sub: document.getElementById('tobiSub').textContent,
      status: document.getElementById('tobiStatus').textContent,
      firstMsg: (document.querySelector('#tobiLog .tobi-bubble') || {}).textContent || ''
    };
  });

  // 3. schedule question (ID)
  await page.fill('#tobiInput', 'kapan jadwal main?');
  await page.press('#tobiInput', 'Enter');
  await page.waitForTimeout(1300);
  out.replyID = await page.evaluate(() => {
    const b = document.querySelectorAll('#tobiLog .tobi-bubble');
    return b[b.length - 1].textContent;
  });

  // 4. greeting / thanks / out-of-context variation (still ID)
  for (const q of ['halo', 'makasih ya', 'siapa presiden indonesia ya?']) {
    await page.fill('#tobiInput', q);
    await page.press('#tobiInput', 'Enter');
    await page.waitForTimeout(1100);
  }
  out.variations = await page.evaluate(() => {
    const b = [...document.querySelectorAll('#tobiLog .tobi-bubble')];
    return b.slice(-3).map(x => x.textContent.slice(0, 90));
  });

  // 5. switch EN
  await page.evaluate(() => {
    if (window.setLang) setLang('en');
    else { document.documentElement.lang = 'en'; document.dispatchEvent(new CustomEvent('toba:langchange')); }
  });
  await page.waitForTimeout(400);
  out.brEn = await page.evaluate(() => ({
    name: document.getElementById('tobiName').textContent,
    sub: document.getElementById('tobiSub').textContent,
  }));
  await page.fill('#tobiInput', 'when do you play?');
  await page.press('#tobiInput', 'Enter');
  await page.waitForTimeout(1300);
  out.replyEN = await page.evaluate(() => {
    const b = document.querySelectorAll('#tobiLog .tobi-bubble');
    return b[b.length - 1].textContent;
  });
  await page.screenshot({ path: '_qa_panel.png' });

  // 6. close panel, drag launcher, verify no accidental open + persistence
  await page.click('#tobiClose');
  await page.waitForTimeout(300);
  const box = await page.evaluate(() => {
    const r = document.getElementById('tobiLauncher').getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.mouse.move(box.x, box.y);
  await page.mouse.down();
  await page.mouse.move(box.x - 400, box.y + 220, { steps: 15 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  out.drag = await page.evaluate(() => {
    const l = document.getElementById('tobiLauncher');
    const r = l.getBoundingClientRect();
    const p = document.getElementById('tobiPanel');
    return {
      left: Math.round(r.left), top: Math.round(r.top),
      free: l.classList.contains('tobi-free'),
      stored: localStorage.getItem('tobi.pos.y'),
      panelOpenedByDrag: !p.hidden
    };
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  out.restored = await page.evaluate(() => {
    const r = document.getElementById('tobiLauncher').getBoundingClientRect();
    return { left: Math.round(r.left), top: Math.round(r.top), stored: localStorage.getItem('tobi.pos.y') };
  });

  // 7. mobile 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  for (const p of ['index.html', 'events.html', 'tobaladies.html']) {
    await page.goto('http://localhost:8000/' + p, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900);
    out['mob_' + p] = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      launcher: !!document.getElementById('tobiLauncher'),
      overflowPx: document.documentElement.scrollWidth - window.innerWidth,
    }));
  }
  return out;
}
