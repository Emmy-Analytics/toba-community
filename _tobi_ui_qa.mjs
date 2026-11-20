// Prompt 9–15 final UI verification: desktop & mobile, EN & ID,
// launcher, balloon, panel open, chat, branding, schedule, drag.
const B = 'http://localhost:8000';
const pages = ['index.html', 'events.html', 'gallery.html', 'merchandise.html', 'partnership.html', 'tobaladies.html', 'tobadeli.html', 'game.html'];
const out = { desktop: [], mobile: [], chat: {}, schedule: {}, drag: {} };
const errors = [];

export default async function run(page, ui) {
  // ---------- DESKTOP (1280x800) ----------
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const p of pages) {
    await page.goto(B + '/' + p, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(700);
    const res = await page.evaluate(() => {
      const launcher = document.querySelector('.tobi-launcher, #tobiLauncher, [class*="tobi"][class*="launch"]');
      const panel = document.querySelector('.tobi-panel');
      const music = document.querySelector('#tobaMusicRoot');
      return {
        launcher: !!launcher,
        panel: !!panel,
        musicZ: music ? getComputedStyle(music).zIndex : null,
        name: (document.querySelector('#tobiName') || {}).textContent || null,
        sub: (document.querySelector('#tobiSub') || {}).textContent || null,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    });
    out.desktop.push({ page: p, ...res });
  }

  // ---------- INTERACTION on index.html ----------
  await page.goto(B + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);

  // balloon greeting
  out.chat.firstBalloon = await page.evaluate(() => {
    const b = document.querySelector('.tobi-balloon');
    return b ? { visible: !b.hidden && b.textContent.length > 0, text: b.textContent.slice(0, 60) } : null;
  });

  // open chat
  const lb = await page.evaluate(() => {
    const l = document.querySelector('.tobi-launcher, [class*="tobi"][class*="launch"]');
    if (l) l.click();
    return !!l;
  });
  await page.waitForTimeout(600);
  out.chat.panelOpens = await page.evaluate(() => {
    const p = document.querySelector('.tobi-panel');
    return p ? { hidden: p.hidden, welcome: p.textContent.includes('TOBI') || p.textContent.length > 40 } : null;
  });

  // TOBI branding in header
  out.chat.headerName = await page.evaluate(() => document.querySelector('#tobiName')?.textContent);
  out.chat.headerSub = await page.evaluate(() => document.querySelector('#tobiSub')?.textContent);
  await page.screenshot({ path: '_qa_tobi_panel.png' });

  // send a chat message about schedule (Indonesian default)
  await page.fill('.tobi-panel input[type="text"], .tobi-input, .tobi-panel input', 'kapan jadwal main?').catch(() => { });
  await page.keyboard.press('Enter').catch(() => { });
  await page.waitForTimeout(1200);
  out.schedule.idReply = await page.evaluate(() => {
    const msgs = document.querySelectorAll('.tobi-bubble');
    return msgs[msgs.length - 1]?.textContent || '';
  });

  // switch to EN
  await page.evaluate(() => {
    document.documentElement.lang = 'en';
    document.dispatchEvent(new CustomEvent('toba:langchange'));
  });
  await page.waitForTimeout(500);
  out.chat.enName = await page.evaluate(() => document.querySelector('#tobiName')?.textContent);
  await page.fill('.tobi-panel input[type="text"], .tobi-input, .tobi-panel input', 'when is the schedule?').catch(() => { });
  await page.keyboard.press('Enter').catch(() => { });
  await page.waitForTimeout(1200);
  out.schedule.enReply = await page.evaluate(() => {
    const msgs = document.querySelectorAll('.tobi-bubble');
    return msgs[msgs.length - 1]?.textContent || '';
  });

  // ---------- DRAG launcher ----------
  await page.evaluate(() => document.querySelector('.tobi-panel')?.closest('.tobi-root')?.querySelector('[aria-expanded]')?.click()
    || document.querySelector('.tobi-launcher')?.click());
  await page.waitForTimeout(400);
  const lpos1 = await page.evaluate(() => {
    const l = document.querySelector('.tobi-launcher, [class*="tobi"][class*="launch"]');
    const r = l.getBoundingClientRect(); return { x: r.x, y: r.y, top: l.style.top };
  });
  // simulate pointer drag via mouse
  const lbox = await page.evaluate(() => {
    const l = document.querySelector('.tobi-launcher, [class*="tobi"][class*="launch"]');
    const r = l.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.mouse.move(lbox.x, lbox.y);
  await page.mouse.down();
  await page.mouse.move(lbox.x, lbox.y + 250, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const lpos2 = await page.evaluate(() => {
    const l = document.querySelector('.tobi-launcher, [class*="tobi"][class*="launch"]');
    const r = l.getBoundingClientRect(); return { x: r.x, y: r.y, stored: localStorage.getItem('tobi.pos.y') };
  });
  out.drag = { before: lpos1, after: lpos2, moved: Math.abs((lpos2.y || 0) - (lpos1.y || 0)) > 50, persisted: !!lpos2.stored };

  // reload → position restored?
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  out.drag.restoredAfterReload = await page.evaluate(() => {
    const l = document.querySelector('.tobi-launcher, [class*="tobi"][class*="launch"]');
    const v = localStorage.getItem('tobi.pos.y');
    return { stored: v, topStyle: l?.style.top || getComputedStyle(l).top };
  });

  // ---------- MOBILE (390x844) ----------
  await page.setViewportSize({ width: 390, height: 844 });
  for (const p of ['index.html', 'events.html']) {
    await page.goto(B + '/' + p, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const res = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      launcher: !!document.querySelector('.tobi-launcher, [class*="tobi"][class*="launch"]'),
      musicVisible: (() => { const m = document.querySelector('#tobaMusicRoot'); return m ? getComputedStyle(m).display !== 'none' : null; })(),
    }));
    out.mobile.push({ page: p, ...res });
    await page.screenshot({ path: '_qa_mobile_' + p.replace('.html', '') + '.png' });
  }
  out.errors = errors;
  return out;
}
