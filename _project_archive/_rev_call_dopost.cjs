const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const blankFrame = p.frames().find(f => f.url().includes('/blank'));
  // Call doPost directly with a mock event object — this reveals the exact expected fields!
  const out = await blankFrame.evaluate(() => new Promise(res => {
    try {
      const mockEvent = { parameter: { api: 'submitReview', name: 'QA DOPOST', displayName: 'QA DOPOST', group: 'Tobaladies', rating: '5', reviewText: 'Tes doPost mock', consent: 'true' }, postData: { type: 'application/x-www-form-urlencoded', contents: 'api=submitReview&name=QA+DOPOST&group=Tobaladies&rating=5&reviewText=Tes&consent=true' } };
      const result = doPost(mockEvent);
      res('RESULT ' + (typeof result === 'object' ? (result.getContent && result.getContent() || JSON.stringify(result)) : ''));
    } catch (e) { res('ERR ' + e.message); }
    setTimeout(() => res('timeout 45s'), 45000);
  }));
  console.log('doPost mock =>', out.slice(0, 1500));
  await b.close();
})();
