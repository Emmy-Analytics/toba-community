/* Dump isi sheet Reviews untuk melihat SEMUA kolom (termasuk data POST yang
   berhasil sebelumnya). Frontend perlu tahu nama kolom header. getSheet returns
   a Sheet object bridge — JSON.stringify di client hanya enum. Trick server:
   getSheet('Reviews') → kita tidak bisa memanggil method server-side berantai.
   TAPI: backend punya fungsi getColumns — dipanggil dengan Sheet? getColumns(sheetObject)? */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const blankFrame = p.frames().find(f => f.url().includes('/blank'));
  if (!blankFrame) { console.log('no blank frame'); await b.close(); return; }

  const call2 = (fnA, fnB, ...args) => blankFrame.evaluate((fnA, fnB, args) => new Promise(res => {
    try {
      google.script.run
        .withSuccessHandler(sheet => {
          try {
            google.script.run
              .withSuccessHandler(v => res('OK ' + JSON.stringify(v)))
              .withFailureHandler(e => res('B-FAIL ' + (e && (e.message || e))))
            [fnB](sheet);
          } catch (e) { res('B-ERR ' + e.message); }
        })
        .withFailureHandler(e => res('A-FAIL ' + (e && (e.message || e))))
      [fnA](...args);
    } catch (e) { res('ERR ' + e.message); }
    setTimeout(() => res('timeout 60s'), 60000);
  }), fnA, fnB, args);

  console.log('getColumns(getSheet(Reviews)) =>', (await call2('getSheet', 'getColumns', 'Reviews')).slice(0, 800));
  await b.close();
})();
