const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  // multipart/form-data POST (puppeteer-like FormData)
  const fd = new FormData();
  fd.append('api', 'submitReview');
  fd.append('name', 'QA-FD1');
  fd.append('group', 'Tobaladies');
  fd.append('rating', '5');
  fd.append('reviewText', 'Tes multipart');
  fd.append('consent', 'true');
  let r = await fetch(u, { method: 'POST', body: fd, redirect: 'follow' });
  console.log('multipart ->', (await r.text()).slice(0, 200));

  // no Content-Type at all (Apps Script sees e.parameter)
  r = await fetch(u, { method: 'POST', body: 'api=submitReview&name=QA-NT1&group=Tobaladies&rating=5&reviewText=Tes&consent=true', redirect: 'follow' });
  console.log('no ct ->', (await r.text()).slice(0, 200));

  // JSON body with api param in query string
  r = await fetch(u + '?api=submitReview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"name":"QA-JQ1","group":"Tobaladies","rating":5,"reviewText":"Tes jsonq","consent":true}', redirect: 'follow' });
  console.log('json+qsapi ->', (await r.text()).slice(0, 200));
})();
