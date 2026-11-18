/* POST test to Apps Script submitReview using Node fetch (no redirect drop) */
let BODY = process.argv[2] || ('api=submitReview&name=' + encodeURIComponent('QA Frontend Node') +
  '&group=' + encodeURIComponent('Tobaladies') +
  '&rating=5&reviewText=' + encodeURIComponent('Tes integrasi frontend reviews dari QA script.') +
  '&consent=true');
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', 'Content-Length': String(Buffer.byteLength(BODY)) },
    body: BODY,
    redirect: 'follow'
  });
  console.log('status', res.status);
  const txt = await res.text();
  console.log(txt.slice(0, 1200));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
