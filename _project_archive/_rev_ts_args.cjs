/* Satu kali: dump isi lengkap response testSubmitReview (bisa null karena void).
   Coba juga kirim argumen objek lengkap ke testSubmitReview untuk melihat bentuk
   parameter yang diharapkan backend. */
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

  // 1) testSubmitReview dengan argumen payload lengkap — lihat responsnya
  console.log('with payload =>', await call('testSubmitReview',
    { displayName: 'QA TS1', name: 'QA TS1', group: 'Tobaladies', rating: 5, reviewText: 'Tes payload lengkap', consent: true, status: 'PENDING' }));

  // 2) getSheet — mungkin mengekspos struktur sheet Reviews
  console.log('getSheet reviews =>', (await call('getSheet', 'Reviews')).slice(0, 1500));
  console.log('getColumns Reviews =>', (await call('getColumns', 'Reviews')).slice(0, 800));
  await b.close();
})();
