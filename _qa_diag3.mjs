export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  // Open modal
  await page.evaluate(() => document.getElementById('joinCtaBtn')?.click());
  await page.waitForTimeout(300);
  const step1 = await page.evaluate(() => {
    const jm = document.getElementById('joinModal');
    return { hidden: jm.hidden, cssDisplay: getComputedStyle(jm).display, cls: jm.className };
  });
  // Try Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const step2 = await page.evaluate(() => {
    const jm = document.getElementById('joinModal');
    return { hidden: jm.hidden, cssDisplay: getComputedStyle(jm).display, inViewport: jm.getBoundingClientRect().width };
  });
  // If not closed, force-check: maybe CSS .join-modal[hidden] absent so always displayed? check style rule
  const step3 = await page.evaluate(() => {
    const sheets = [...document.styleSheets];
    let rules = [];
    for (const s of sheets) {
      try { for (const r of s.cssRules) { if (r.selectorText && r.selectorText.includes('join-modal')) rules.push(r.cssText); } } catch (_) { }
    }
    return rules;
  });
  return { step1, step2, step3 };
}
