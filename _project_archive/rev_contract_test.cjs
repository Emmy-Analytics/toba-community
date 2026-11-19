/* Tes sementara kontrak param submitReview — file sementara, dibersihkan setelah tes. */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const qs = require('querystring');
(async () => {
  const variants = [
    ['qsapi+display', '?api=submitReview', { displayName: 'QA-BN5', group: 'Tobaladies', rating: '5', review_text: 'Tes qsapi', consent: 'true' }],
    ['noapi+display', '', { displayName: 'QA-BN6', group: 'Tobaladies', rating: '5', review_text: 'Tes noapi', consent: 'true' }],
    ['qsapi+name+reviewtext', '?api=submitReview', { name: 'QA-BN7', group: 'Tobaladies', rating: '5', reviewText: 'Tes BN7', consent: 'true' }],
    ['qsapi+review_text+name', '?api=submitReview', { name: 'QA-BN8', group: 'Tobaladies', rating: '5', review_text: 'Tes BN8', consent: 'true' }],
  ];
  for (const [label, q, fields] of variants) {
    const r = await fetch(URL + q, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: qs.stringify(fields), redirect: 'follow' });
    console.log(label, '->', (await r.text()).slice(0, 200));
  }
})();
