/* The 'ALL' probe failing means doPost isn't reading e.parameter at all — likely it reads e.postData.contents JSON with DIFFERENT required keys, or expects specific structure. Also possible: doPost routes on e.parameter.api but validates e.postData JSON. Try JSON bodies with MANY key variants in one go. */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const all = { name: 'QA-ALLJ', displayName: 'QA-ALLJ', nickname: 'QA-ALLJ', nama: 'QA-ALLJ', email: 'qa@test.id', group: 'Tobaladies', community: 'Tobaladies', category: 'Tobaladies', kategori: 'Tobaladies', rating: 5, reviewText: 'Tes lengkap', review: 'Tes lengkap', message: 'Tes lengkap', ulasan: 'Tes lengkap', consent: true, agree: true, setuju: true, persetujuan: true };
(async () => {
  // 1) JSON with everything
  let r = await fetch(URL, { method: 'POST', body: JSON.stringify(all), headers: { 'Content-Type': 'application/json' }, redirect: 'follow' });
  console.log('json-all ->', (await r.text()).slice(0, 300));
  // 2) qs + api in query, JSON body
  r = await fetch(URL + '?api=submitReview', { method: 'POST', body: JSON.stringify(all), headers: { 'Content-Type': 'application/json' }, redirect: 'follow' });
  console.log('json-all-qs ->', (await r.text()).slice(0, 300));
  // 3) text/plain JSON
  r = await fetch(URL, { method: 'POST', body: JSON.stringify(all), headers: { 'Content-Type': 'text/plain' }, redirect: 'follow' });
  console.log('json-plain ->', (await r.text()).slice(0, 300));
  // 4) Do POST /dev? Not public. 5) Maybe doPost expects e.parameter.payload JSON string:
  r = await fetch(URL, { method: 'POST', body: 'api=submitReview&payload=' + encodeURIComponent(JSON.stringify(all)), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, redirect: 'follow' });
  console.log('payload ->', (await r.text()).slice(0, 300));
  // 6) body as query string of JSON? data=
  r = await fetch(URL, { method: 'POST', body: 'api=submitReview&data=' + encodeURIComponent(JSON.stringify(all)), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, redirect: 'follow' });
  console.log('data ->', (await r.text()).slice(0, 300));
})();
