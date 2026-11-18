/* Probe doPost: maybe it expects multipart/form-data or specific nested key. Try multipart. */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  // multipart
  const fd = new FormData();
  fd.append('name', 'QA+MP1');
  fd.append('group', 'Tobaladies');
  fd.append('rating', '5');
  fd.append('reviewText', 'Tes multipart');
  fd.append('consent', 'true');
  let r = await fetch(URL, { method: 'POST', body: fd, redirect: 'follow' });
  console.log('multipart ->', (await r.text()).slice(0, 200));

  // Maybe doPost reads e.parameter.api only for routing but requires e.postData JSON with specific keys incl "review"
  const bodies = [
    JSON.stringify({ name: 'QA+J9', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true, action: 'submit' }),
    JSON.stringify({ displayName: 'QA+J10', group: 'Tobaladies', rating: '5', reviewText: 'Tes', consent: 'true', type: 'review' }),
  ];
  for (const b of bodies) {
    r = await fetch(URL + '?api=submitReview', { method: 'POST', body: b, headers: { 'Content-Type': 'application/json' }, redirect: 'follow' });
    console.log('json+qs ->', (await r.text()).slice(0, 200));
  }
})();
