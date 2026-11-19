const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const blankFrame = p.frames().find(f => f.url().includes('/blank'));
  // call testPublishedReviewsApi AND call doPost indirectly. Also try calling testSubmitReview with args
  const out = await blankFrame.evaluate(() => new Promise(res => {
    try {
      google.script.run
        .withSuccessHandler(v => res('SUCCESS ' + (typeof v === 'object' ? JSON.stringify(v).slice(0, 2000) : String(v).slice(0, 2000))))
        .withFailureHandler(e => res('FAIL ' + ((e && (e.message || e)) || '')))
        .testPublishedReviewsApi();
    } catch (e) { res('ERR ' + e.message); }
    setTimeout(() => res('timeout 45s'), 45000);
  }));
  console.log('testPublishedReviewsApi =>', out.slice(0, 1500));
  await b.close();
})();
