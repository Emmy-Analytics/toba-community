const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const blankFrame = p.frames().find(f => f.url().includes('/blank'));
  // Call doPost via google.script.run with mock event - it should be exposed
  const out = await blankFrame.evaluate(() => new Promise(res => {
    try {
      const mockEvent = { parameter: { api: 'submitReview', name: 'QA DOPOST GS', displayName: 'QA DOPOST GS', group: 'Tobaladies', rating: '5', reviewText: 'Tes doPost via gsrun', consent: 'true' }, postData: { type: 'application/x-www-form-urlencoded', contents: 'api=submitReview&name=QA+DOPOST+GS&group=Tobaladies&rating=5&reviewText=Tes&consent=true' } };
      google.script.run
        .withSuccessHandler(v => res('SUCCESS ' + (typeof v === 'object' ? JSON.stringify(v).slice(0, 3000) : String(v).slice(0, 3000))))
        .withFailureHandler(e => res('FAIL ' + ((e && (e.message || e)) || '')))
        .doPost(mockEvent);
    } catch (e) { res('ERR ' + e.message); }
    setTimeout(() => res('timeout 45s'), 45000);
  }));
  console.log('doPost via gsrun =>', out.slice(0, 2000));
  await b.close();
})();
