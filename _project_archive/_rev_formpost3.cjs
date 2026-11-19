/* Walk one level deeper: /blank inside that iframe actually loads the real app html */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec?api=submitReview&name=QA+X&group=Tobaladies&rating=5&reviewText=Tes&consent=true&callback=tobaReviewsCallback', { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  for (const f of p.frames()) {
    try {
      const t = await f.evaluate(() => document.body ? document.body.innerText.slice(0, 600) : '(no body)');
      console.log('FRAME', f.url().slice(0, 90), '=>', t.slice(0, 400));
    } catch (e) { console.log('FRAME err', f.url().slice(0, 60), e.message); }
  }
  await b.close();
})();
