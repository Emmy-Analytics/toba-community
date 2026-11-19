/* Puppeteer: hit submitReview endpoint with a real browser ( Origin=null like file:// or via page fetch). */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
  const out = await page.evaluate(async () => {
    const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
    const r = [];
    // form-encoded POST via browser fetch
    try {
      const res = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'api=submitReview&name=QA+Browser&group=Tobaladies&rating=5&reviewText=Tes+browser&consent=true', redirect: 'follow' });
      r.push(['browser-fetch-post', res.status, (await res.text()).slice(0, 300)]);
    } catch (e) { r.push(['browser-fetch-post', 'ERR', e.message]); }
    // JSONP submit
    try {
      const jsonp = await new Promise((resolve) => {
        window.tobaSubmitCb = res => resolve(JSON.stringify(res));
        const s = document.createElement('script');
        s.src = URL + '?api=submitReview&name=QA+Jsonp&group=Tobaladies&rating=5&reviewText=Tes+jsonp&consent=true&callback=tobaSubmitCb';
        s.onerror = () => resolve('script-error');
        document.body.appendChild(s);
        setTimeout(() => resolve('timeout'), 20000);
      });
      r.push(['jsonp-submit', 0, jsonp]);
    } catch (e) { r.push(['jsonp-submit', 'ERR', e.message]); }
    return r;
  });
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
