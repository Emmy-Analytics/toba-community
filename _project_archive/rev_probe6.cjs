// Uji POST dengan body JSON string di postData (e.postData.contents) + api di query
const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  const json = JSON.stringify({ api: 'submitReview', name: 'QA-PC1', group: 'Tobaladies', rating: 5, reviewText: 'Tes postData', consent: true });
  let r = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: json, redirect: 'follow' });
  console.log('json as text/plain ->', (await r.text()).slice(0, 200));

  r = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: json, redirect: 'follow' });
  console.log('json as json ->', (await r.text()).slice(0, 200));

  // field Indonesian names
  const qs = new URLSearchParams({ api: 'submitReview', nama: 'QA-IN1', kelompok: 'Tobaladies', rating: '5', ulasan: 'Tes indo', setuju: 'true' });
  r = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: qs.toString(), redirect: 'follow' });
  console.log('indo names ->', (await r.text()).slice(0, 200));

  // singular 'review' field
  const qs2 = new URLSearchParams({ api: 'submitReview', name: 'QA-RV1', group: 'Tobaladies', rating: '5', review: 'Tes rv', consent: 'true' });
  r = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: qs2.toString(), redirect: 'follow' });
  console.log('review field ->', (await r.text()).slice(0, 200));
})();
