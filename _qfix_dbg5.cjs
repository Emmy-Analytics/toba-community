/* Debug 5: kolom 9-px berasal dari mana — dump semua declared grid-template-columns pada box */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const data = await page.evaluate(() => {
    /* iterate CSSOM of the local sheet only */
    const sheet = [...document.styleSheets].find(s => (s.href || '').includes('style.css'));
    const hits = [];
    const walk = (rules, media) => {
      for (const r of rules) {
        if (r.cssRules) { walk(r.cssRules, r.conditionText || media); continue; }
        const t = r.style && r.style.gridTemplateColumns;
        if (t && r.selectorText && /hero-cut/.test(r.selectorText)) {
          hits.push({ sel: r.selectorText, media: media || '-', cols: t });
        }
      }
    };
    try { walk(sheet.cssRules, null); } catch (e) { return { err: String(e) }; }
    return hits;
  });
  console.log(JSON.stringify(data, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
