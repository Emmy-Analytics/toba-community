export default async function run(page) {
  const out = {};
  for (const [w, h, key] of [[355, 740, 'mobile355'], [390, 844, 'mobile390'], [1280, 720, 'desktop1280']]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'domcontentloaded' });
    try { const s = page.locator('#introSkip, .invite-skip'); if (await s.count()) await s.first().click({ timeout: 2500 }); } catch { }
    await page.waitForTimeout(3500);
    out[key] = await page.evaluate(() => {
      const nav = document.querySelector('nav, .navbar, header');
      const h1 = [...document.querySelectorAll('h1, .hero-title')].find(e => /TOBA/i.test(e.textContent)) || document.querySelector('h1');
      const hr = h1 && h1.getBoundingClientRect();
      const nr = nav && nav.getBoundingClientRect();
      const ss = document.querySelector('.hero-cut-slideshow');
      const sr = ss && ss.getBoundingClientRect();
      const cta = document.querySelector('.hero-home a.btn, .hero-home button');
      const cr = cta && cta.getBoundingClientRect();
      return {
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        headlineTop: hr ? Math.round(hr.top) : null,
        gapFromNav: (hr && nr) ? Math.round(hr.top - nr.bottom) : null,
        slideshow: sr ? { w: Math.round(sr.width), h: Math.round(sr.height), left: Math.round(sr.left) } : null,
        ctaBottom: cr ? Math.round(cr.bottom) : null,
        viewportH: innerHeight,
      };
    });
    await page.screenshot({ path: `_project_archive/audit_final_${key}.png` });
  }
  return out;
}
