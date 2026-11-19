/* The admin blank html confirms doPost is a separate route. Since the published
   GET api=reviews works and returns fields displayName, group, reviewText, rating,
   the doPost probably accepts those EXACT names via urlencoded (tried) OR maybe
   it checks 'e.parameter.reviewText' but our request was fine...
   FINAL alternative: maybe doPost EXPECTS multipart FormData from a browser form.
   Puppeteer: real <form> multipart POST directly at /exec, capture the response body. */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  const resp = await p.goto('about:blank');
  await p.setContent(`<form id=f method=POST action="https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec">
   <input name=api value=submitReview><input name=name value="QA FORM MP"><input name=group value=Tobaladies>
   <input name=rating value=5><input name=reviewText value="Tes multipart form"><input name=consent value=true>
   <input type=submit></form>`);
  await Promise.all([
    p.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(e => console.log('nav err', e.message)),
    p.evaluate(() => document.getElementById('f').submit()),
  ]);
  await new Promise(r => setTimeout(r, 6000));
  const frames = p.frames();
  for (const f of frames) {
    try {
      const txt = await f.evaluate(() => document.body ? document.body.innerText.slice(0, 500) : '(empty)');
      if (txt && txt.trim()) console.log('FRAME', f.url().slice(0, 70), '=>', txt.slice(0, 300));
    } catch (e) { }
  }
  await b.close();
})();
