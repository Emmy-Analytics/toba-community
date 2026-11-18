/* Debug 14 — CDP: getMatchedStylesForNode untuk img.cut-p1 */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));

  const client = await page.createCDPSession();
  await client.send('DOM.enable');
  await client.send('CSS.enable');
  const { root } = await client.send('DOM.getDocument');
  const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector: '.hero-cut-img.cut-p1' });
  const matched = await client.send('CSS.getMatchedStylesForNode', { nodeId });

  const widthRules = [];
  for (const m of (matched.matchedCSSRules || [])) {
    const t = m.rule.selectorText || '';
    for (const p of (m.rule.style.cssProperties || m.rule.style.cssText ? [] : [])) { }
    const cssText = m.rule.style.cssText || '';
    if (/width|max-width|max-height/.test(cssText)) {
      widthRules.push({ sel: t, media: m.rule.mediaBlocks ? undefined : undefined, css: cssText.split(';').filter(x => /width|max-height|max-width/.test(x)).join(';').trim() });
    }
  }
  console.log(JSON.stringify(widthRules, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
