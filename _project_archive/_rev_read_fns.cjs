/* Dump sheet Reviews: coba getSheetByName via SpreadsheetApp — tidak tersedia di sandbox.
   Alternatif: gunakan getSheet lalu serialisasi method yang tersedia di server-side
   bridge. Coba getSheet('Reviews').getDataRange() di dalam satu evaluate dengan
   chaining via google.script.run.withSuccessHandler tidak bisa — Sheet object tidak
   terserialisasi. Ganti pendekatan: cek apakah ada fungsi di backend yang membaca data. */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const blankFrame = p.frames().find(f => f.url().includes('/blank'));
  if (!blankFrame) { console.log('no blank frame'); await b.close(); return; }

  const call = (fn, ...args) => blankFrame.evaluate((fn, args) => new Promise(res => {
    try {
      google.script.run
        .withSuccessHandler(v => res('SUCCESS ' + JSON.stringify(v)))
        .withFailureHandler(e => res('FAIL ' + ((e && (e.message || e)) || '')))
      [fn](...args);
    } catch (e) { res('ERR ' + e.message); }
    setTimeout(() => res('timeout 60s'), 60000);
  }), fn, args);

  // Coba nama fungsi pembaca data yang umum
  for (const fn of ['getReviewsData', 'listReviews', 'readReviews', 'getAllReviews', 'getReviewData']) {
    const r = await call(fn);
    console.log(fn, '=>', String(r).slice(0, 300));
  }
  await b.close();
})();
