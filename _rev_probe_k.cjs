const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
/* doPost likely expects e.postData.contents JSON or specific param names. Try JSON with different keys. */
const tries = [
  JSON.stringify({ action: 'submitReview', displayName: 'QA+K1', category: 'Tobaladies', rating: 5, review: 'Tes', consent: true }),
  JSON.stringify({ name: 'QA+K2', komunitas: 'Tobaladies', rating: 5, ulasan: 'Tes', setuju: true }),
  JSON.stringify({ nama: 'QA+K3', grup: 'Tobaladies', rating: 5, review: 'Tes' }),
  'api=submitReview&json=' + encodeURIComponent(JSON.stringify({ name: 'QA+K4', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true }))
];
(async () => {
  for (const b of tries) {
    const r = await fetch(URL, { method: 'POST', body: b, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, redirect: 'follow' });
    console.log('POST:', b.slice(0, 90));
    console.log('  ->', (await r.text()).slice(0, 300).replace(/\n/g, ' '));
  }
})();
