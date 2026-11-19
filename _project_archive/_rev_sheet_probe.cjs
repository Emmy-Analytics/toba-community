/* Satu kali: dump sumber Code.gs backend lewat fungsi editor? Tidak bisa dari sandbox.
   Alternatif terdekat: getSheet sudah ada. Coba baca header row lewat sheet object
   yang dikembalikan getSheet dengan method getRange di dalam success handler. */
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
            const names = [];
            for (const k of ['getRange', 'getDataRange', 'getLastRow', 'getLastColumn', 'getName', 'getParent']) {
              try { names.push(k + ':' + typeof v[k]); } catch (e) { }
            }
            let data = '';
            try { data = JSON.stringify(v.getRange(1, 1, 5, 12).getValues()); } catch (e) { data = 'range-err ' + e.message; }
            res('OK ' + names.join(', ') + ' DATA ' + data);
          } catch (e) { res('INNER-ERR ' + e.message); }
        })
        .withFailureHandler(e => res('FAIL ' + (e && (e.message || e))))
        .getSheet('Reviews');
    } catch (e) { res('ERR ' + e.message); }
    setTimeout(() => res('timeout 60s'), 60000);
  }));
  console.log(String(out).slice(0, 3000));
  await b.close();
})();
