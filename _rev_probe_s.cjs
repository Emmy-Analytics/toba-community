/* Maybe doPost requires header Content-Type absent (Apps Script parses e.parameter regardless) — or doPost checks e.parameter.api === undefined but reads properties differently. Try doPost WITHOUT 'api' in body but action-specific property 'submitReview=true'? Also try GET with query params through doPost? doPost never gets GET. Try doPost with ONLY urlencoded including newline? Or doPost expects fields under e.parameters arrays. Last resort: try trailing slash /exec? with 'reviewId'? Just probe a couple more shapes then stop. */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  // no content-type
  let r = await fetch(URL, { method: 'POST', body: 'api=submitReview&name=QA-N1&group=Tobaladies&rating=5&reviewText=Tes&consent=true', redirect: 'follow' });
  console.log('noct ->', (await r.text()).slice(0, 160));
  // text/plain
  r = await fetch(URL, { method: 'POST', body: 'api=submitReview&name=QA-N2&group=Tobaladies&rating=5&reviewText=Tes&consent=true', headers: { 'Content-Type': 'text/plain' }, redirect: 'follow' });
  console.log('textplain ->', (await r.text()).slice(0, 160));
  // JSON to /exec?alt=json ?
  r = await fetch(URL + '?api=submitReview', { method: 'POST', body: JSON.stringify({ name: 'QA-N3', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true }), headers: { 'Content-Type': 'application/json; charset=utf-8' }, redirect: 'follow' });
  console.log('json2 ->', (await r.text()).slice(0, 160));
  // multipart with api
  const fd = new FormData(); fd.append('api', 'submitReview'); fd.append('name', 'QA-N4'); fd.append('group', 'Tobaladies'); fd.append('rating', '5'); fd.append('reviewText', 'Tes'); fd.append('consent', 'true');
  r = await fetch(URL, { method: 'POST', body: fd, redirect: 'follow' });
  console.log('mp2 ->', (await r.text()).slice(0, 160));
})();
