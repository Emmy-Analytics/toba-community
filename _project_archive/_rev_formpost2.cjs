/* The classic HTML form POST returns a blank page — typical when Apps Script's
   doPost is protected by ContentService + XFrameOptions. Use puppeteer to look at
   the actual response inside the frame (may need to dump HTML not just text). */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  const resp = await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec?api=submitReview&name=QA+X&group=Tobaladies&rating=5&reviewText=Tes&consent=true&callback=tobaReviewsCallback', { waitUntil: 'networkidle0', timeout: 60000 });
  console.log('STATUS:', resp.status());
  // walk into the iframe
  const frame = p.frames().find(f => f !== p.mainFrame());
  if (frame) {
    const inner = await frame.evaluate(() => document.documentElement.outerHTML.slice(0, 2000));
    console.log('INNER:', inner);
  } else { console.log('no child frame'); }
  await b.close();
})();
