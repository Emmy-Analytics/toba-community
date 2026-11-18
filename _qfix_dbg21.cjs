/* Debug 21 — fetch style.css text from page (URL relative fix) dan hitung jumlah hero-cut-slideshow */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const d = await page.evaluate(async () => {
    const links = [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href);
    let txt = '';
    for (const href of links) {
      try { const r = await fetch(href); txt += (await r.text()) + '\n'; } catch (e) { txt += 'FETCHFAIL:' + href + '\n'; }
    }
    let i = -1; const idxs = [];
    while ((i = txt.indexOf('hero-cut-slideshow', i + 1)) >= 0) idxs.push(i);
    return { links, len: txt.length, occurrences: idxs.length, head: txt.slice(0, 100) };
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
