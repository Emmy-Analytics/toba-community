/* Attempt charset variant + urlencoded with different key order/case, plus GET with all params in query for doPost? */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  // Try GET-style submit where all data is in query string (doPost unlikely, but try GET with full params)
  const qs = 'api=submitReview&name=QA+GETFULL&group=Tobaladies&rating=5&reviewText=Tes&consent=true';
  let r = await fetch(URL + '?' + qs, { redirect: 'follow' });
  const t1 = (await r.text());
  console.log('GET full ->', t1.includes('success') ? t1.slice(t1.indexOf('{'), t1.indexOf('{') + 300) : 'HTML error page');

  // POST with charset in content type and lowercase keys
  r = await fetch(URL, { method: 'POST', body: 'name=QA+LC&group=Tobaladies&rating=5&reviewtext=Tes&consent=true', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, redirect: 'follow' });
  console.log('POST lc ->', (await r.text()).slice(0, 200));

  // POST urlencoded with api param also in query string
  r = await fetch(URL + '?api=submitReview', { method: 'POST', body: 'name=QA+QS&group=Tobaladies&rating=5&reviewText=Tes&consent=true', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, redirect: 'follow' });
  console.log('POST qs ->', (await r.text()).slice(0, 200));
})();
