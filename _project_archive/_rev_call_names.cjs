const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const blankFrame = p.frames().find(f => f.url().includes('/blank'));
  if (!blankFrame) { console.log('no blank frame'); await b.close(); return; }
  const safe = (v) => { try { return JSON.stringify(v).slice(0, 3000); } catch (e) { return String(v).slice(0, 3000); } };
  // Call doPost-like submit via google.script.run.submitReview? Try a few names
  const names = ['submitReview', 'handleReviewSubmit', 'saveReview', 'addReview', 'processReviewSubmit', 'submitReviewForm', 'doSubmitReview'];
  for (const n of names) {
    const out = await blankFrame.evaluate((fn) => new Promise(res => {
      try {
        google.script.run
          .withSuccessHandler(v => res('SUCCESS ' + (typeof v === 'object' ? JSON.stringify(v) : v)))
          .withFailureHandler(e => res('FAIL ' + ((e && (e.message || e)) || '')))
        [fn]({ name: 'QA RSR', group: 'Tobaladies', rating: 5, reviewText: 'Tes google.script.run', consent: true, status: 'PENDING' });
      } catch (e) { res('ERR ' + e.message); }
      setTimeout(() => res('timeout 30s'), 30000);
    }), n);
    console.log(n, '=>', out.slice(0, 400));
    if (!out.startsWith('FAIL') && !out.startsWith('ERR')) break;
  }
  await b.close();
})();
