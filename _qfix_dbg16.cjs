/* Debug 16 — CDP pada .hero-cut-slideshow: siapa yang set grid-template-columns? */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  const client = await page.createCDPSession();
  await client.send('DOM.enable'); await client.send('CSS.enable');
  const { root } = await client.send('DOM.getDocument');
  const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector: '.hero-cut-slideshow' });
  const matched = await client.send('CSS.getMatchedStylesForNode', { nodeId });
  const out = [];
  for (const m of (matched.matchedCSSRules || [])) {
    const cssText = (m.rule.style && m.rule.style.cssText) || '';
    if (/grid-template-columns|display|grid/.test(cssText)) {
      out.push({ sel: m.rule.selectorText, css: cssText.replace(/\s+/g, ' ').slice(0, 300) });
    }
  }
  /* inline */
  const inline = await client.send('DOM.getAttributes', { nodeId });
  console.log(JSON.stringify({ rules: out, inlineAttrs: inline.attributes }, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
