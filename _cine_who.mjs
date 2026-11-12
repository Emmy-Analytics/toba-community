export default async function run(page) {
  await page.evaluate(() => {
    const g = document.querySelector('.cine-gallery');
    if (g) g.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(1200);
  const res = await page.evaluate(() => {
    const out = [];
    for (const ss of document.styleSheets) {
      let rules; try { rules = ss.cssRules; } catch (e) { continue; }
      const walk = (rs, sheetName) => {
        for (const r of rs) {
          if (r.cssRules) { walk(r.cssRules, sheetName); continue; }
          const sel = r.selectorText || '';
          if (/cine-(g|m)-track/.test(sel)) {
            out.push({ sheet: sheetName, sel, css: r.style ? r.style.cssText.slice(0, 200) : String(r.cssText).slice(0, 200) });
          }
        }
      };
      walk(rules, ss.href || 'inline');
    }
    const rows = [...document.querySelectorAll('.cine-g-track')].map(t => {
      const cs = getComputedStyle(t);
      return { dir: t.dataset.dir, anim: cs.animationName, dur: cs.animationDuration, tf: cs.transform.slice(0, 40), inline: t.getAttribute('style') };
    });
    return { rules: out, rows };
  });
  await page.waitForTimeout(1500);
  const rows2 = await page.evaluate(() => [...document.querySelectorAll('.cine-g-track')].map(t => ({
    dir: t.dataset.dir, tf: getComputedStyle(t).transform.slice(0, 40), inline: t.getAttribute('style')
  })));
  return JSON.stringify({ rules: res.rules, rowsAt1: res.rows, rowsAt2: rows2 }, null, 1);
}
