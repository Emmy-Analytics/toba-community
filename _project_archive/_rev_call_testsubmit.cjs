/* doPost might be checking for JSON body with keys 'name','group','rating','text'
   or similar. Let's use puppeteer to actually USE google.script.run inside the
   admin sandbox page to call testSubmitReview and see what fields it sends.
   Better: get the /blank page's google.script.run wrapper to call 'submitReview'.
   Since the function testSubmitReview exists, calling it will show the format.
   We cannot modify the backend. But we CAN observe what testSubmitReview does
   server-side by calling it and seeing the result. */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const blankFrame = p.frames().find(f => f.url().includes('/blank'));
  if (!blankFrame) { console.log('no blank frame'); await b.close(); return; }
  const out = await blankFrame.evaluate(() => new Promise(res => {
    const safe = (v) => { try { return JSON.stringify(v).slice(0, 600); } catch (e) { return String(v).slice(0, 600); } };
    try {
      google.script.run
        .withSuccessHandler(v => res('SUCCESS ' + safe(v)))
        .withFailureHandler(e => res('FAIL ' + safe(e && (e.message || e))))
        .testSubmitReview();
    } catch (e) { res('ERR ' + e.message); }
    setTimeout(() => res('timeout 45s'), 45000);
  }));
  console.log('testSubmitReview =>', out);
  await b.close();
})();
