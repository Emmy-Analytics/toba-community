/* Dump isi sheet Reviews langsung via getSheet + getDataRange (melihat header & data). */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const blankFrame = p.frames().find(f => f.url().includes('/blank'));
  if (!blankFrame) { console.log('no blank frame'); await b.close(); return; }
  const out = await blankFrame.evaluate(() => new Promise(res => {
    try {
      google.script.run
        .withSuccessHandler(v => {
          try {
            const dr = v.getDataRange();
            const vals = dr.getValues();
            res('SHEET ' + JSON.stringify(vals).slice(0, 3000));
          } catch (e) { res('SHEET-ERR ' + e.message); }
        })
        .withFailureHandler(e => res('FAIL ' + (e && (e.message || e))))
        .getSheet('Reviews');
    } catch (e) { res('ERR ' + e.message); }
    setTimeout(() => res('timeout 60s'), 60000);
  }));
  console.log(String(out).slice(0, 3000));
  await b.close();
})();
