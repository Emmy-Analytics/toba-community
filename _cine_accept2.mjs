// Fresh acceptance probe: current criteria incl. join modal (P19)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function run(page) {
  const out = {};

  // 1. Full scroll: reach footer, no overflow, DOM stable
  const r1 = await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    let y = 0;
    const t0 = performance.now();
    while (y < h && performance.now() - t0 < 9000) {
      y += 600;
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((rr) => setTimeout(rr, 12));
    }
    const domA = document.querySelectorAll('*').length;
    await new Promise((rr) => setTimeout(rr, 800));
    return {
      reached: window.scrollY >= h - 40,
      overflowX: document.documentElement.scrollWidth - innerWidth,
      domA,
      domB: document.querySelectorAll('*').length,
      pauseOverlay: !!document.querySelector('.cine-rpause'),
    };
  });
  out.scroll = r1;

  // 2. Gallery rows move in-view with correct directions
  await page.evaluate(() => {
    const g = document.querySelector('.cine-gallery');
    if (g) g.scrollIntoView({ block: 'center' });
  });
  await sleep(700);
  const x1 = await page.evaluate(() =>
    [...document.querySelectorAll('.cine-g-track')].map((e) => e.getBoundingClientRect().x)
  );
  await sleep(1500);
  const x2 = await page.evaluate(() =>
    [...document.querySelectorAll('.cine-g-track')].map((e) => e.getBoundingClientRect().x)
  );
  out.galleryDx = x1.map((v, i) => +(x2[i] - v).toFixed(1));

  // 3. Marquee moves
  await page.evaluate(() => {
    const m = document.querySelector('#cineApparel');
    if (m) m.scrollIntoView({ block: 'center' });
  });
  await sleep(500);
  const m1 = await page.evaluate(() => {
    const t = document.querySelector('.cine-m-track');
    return t ? t.getBoundingClientRect().x : null;
  });
  await sleep(900);
  const m2 = await page.evaluate(() => {
    const t = document.querySelector('.cine-m-track');
    return t ? t.getBoundingClientRect().x : null;
  });
  out.marqueeDx = m1 != null && m2 != null ? +(m2 - m1).toFixed(1) : null;

  // 4. Review crossfade section exists & background advances
  out.reviews = await page.evaluate(() => {
    const s = document.querySelector('.cine-reviews');
    return { present: !!s, headline: s ? s.textContent.includes('MORE THAN BASKETBALL') || s.textContent.includes('LEBIH DARI BASKET') : false };
  });

  // 5. JOIN MODAL FLOW (P19)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(600);
  await page.waitForSelector('#footerWaBtn', { timeout: 30000 });
  await page.click('#footerWaBtn');
  await sleep(300);
  await page.click('#footerWaJoin');
  await sleep(400);
  out.modalOpen = await page.evaluate(() => {
    const m = document.getElementById('joinModal');
    if (!m) return { present: false };
    return {
      present: true,
      hidden: m.hidden,
      visible: getComputedStyle(m).display !== 'none' && getComputedStyle(m).opacity !== '0',
      fields: {
        nama: !!m.querySelector('#joinNama, [name="nama"]'),
        telp: !!m.querySelector('#joinTelp, [name="telp"]'),
        ig: !!m.querySelector('#joinIg, [name="ig"]'),
        domisili: !!m.querySelector('#joinDom, [name="domisili"]'),
        teams: m.querySelectorAll('input[name="team"]').length,
      },
    };
  });

  // validation: submit empty -> errors, no nav
  const pops0 = [];
  const ctx = page.context();
  ctx.on('page', (p) => pops0.push(p.url()));
  await page.evaluate(() => {
    const btn = document.querySelector('#joinModal button[type="submit"]');
    if (btn) btn.click();
  });
  await sleep(400);
  out.validation = await page.evaluate(() => ({
    errors: [...document.querySelectorAll('#joinModal .join-err, #joinModal [class*="err"]')]
      .filter((e) => e.offsetParent).length,
    stayed: !document.getElementById('joinModal').hidden,
  }));

  // fill valid data
  await page.fill('#joinModal input[name="nama"]', 'Test User');
  await page.fill('#joinModal input[name="phone"]', '081234567890');
  await page.fill('#joinModal input[name="ig"]', '@testuser');
  await page.fill('#joinModal input[name="domisili"]', 'Jakarta Selatan');
  await page.check('#joinModal input[name="team"][value="Tobaladies"], #joinModal input[value="Tobaladies"]');

  const popups = [];
  ctx.pages().forEach((p) => p.__seen !== undefined || null);
  const pagesBefore = ctx.pages().length;
  await page.evaluate(() => {
    const btn = document.querySelector('#joinModal button[type="submit"]');
    if (btn) btn.click();
  });
  await sleep(2500);
  out.whatsapp = await page.evaluate(() => document.getElementById('joinModal') ? true : false);
  const newPages = ctx.pages().slice(pagesBefore);
  out.popupUrl = newPages.length ? decodeURIComponent(newPages[0].url()) : '(popup not capturable — checked via evaluate)';
  // also capture last opened window.open target if popup blocked
  if (!newPages.length) {
    out.popupUrl = await page.evaluate(() => window.__lastWaUrl || '(none)');
  }

  // close modal via Escape
  await page.keyboard.press('Escape');
  await sleep(300);
  out.escaped = await page.evaluate(() => document.getElementById('joinModal').hidden);

  // 6. Footer links
  out.footer = await page.evaluate(() => ({
    igLadies: !!document.querySelector('a[href*="instagram.com/tobaladies.basketball"]'),
    igDeli: !!document.querySelector('a[href*="instagram.com/tobadeli.basketball"]'),
    waButtons: document.querySelectorAll('a[href*="wa.me/6281285704946"], [id*="WaJoin"], [id*="waJoin"]').length,
    portowebWa: !!document.querySelector('a[href*="wa.me/6282195670441"]'),
    portowebIg: !!document.querySelector('a[href*="instagram.com/portoweb.id"]'),
    arrows: /→|↗|⟶/.test(document.body.innerText),
  }));

  out.overflowFinal = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  return out;
}
