/* Try the userCodeAppPanel URL WITH the full query string (the iframe src is set to
   userCodeAppPanel without query, so Apps Script's doGet probably doesn't see params there).
   But the sandbox iframe is what the browser renders. The real question is what the
   FINAL page shows. Load it in a browser via puppeteer to see the rendered result. */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec?api=submitReview&name=QA+Browser&group=Tobaladies&rating=5&reviewText=Tes+browser&consent=true&callback=tobaReviewsCallback', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));
  const txt = await p.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('BODY TEXT:', txt);
  await b.close();
})();
