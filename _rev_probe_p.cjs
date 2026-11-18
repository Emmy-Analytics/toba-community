/* Brute-force common Apps Script doPost shapes for submitReview, single node run with many variants */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const P = (o) => new URLSearchParams(o).toString();
const variants = [
  ['a1 urlenc', P({ api: 'submitReview', name: 'QA1', group: 'Tobaladies', rating: '5', reviewText: 'Tes', consent: 'true' })],
  ['a2 urlenc nama', P({ api: 'submitReview', nama: 'QA2', group: 'Tobaladies', rating: '5', reviewText: 'Tes', consent: 'true' })],
  ['a3 urlenc nickname', P({ api: 'submitReview', nickname: 'QA3', group: 'Tobaladies', rating: '5', reviewText: 'Tes', consent: 'true' })],
  ['a4 json', JSON.stringify({ api: 'submitReview', name: 'QA4', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true })],
  ['a5 urlenc param', P({ parameter: JSON.stringify({ name: 'QA5', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true }) })],
  ['a6 qs only', ''],
];
(async () => {
  for (const [l, b] of variants.slice(0, 5)) {
    for (const ct of ['application/x-www-form-urlencoded', 'application/json']) {
      try {
        const r = await fetch(URL, { method: 'POST', body: b, headers: { 'Content-Type': ct }, redirect: 'follow' });
        const t = await r.text();
        console.log(l, '|', ct, '->', t.startsWith('{') ? t.slice(0, 160) : 'HTML');
      } catch (e) { console.log(l, ct, 'ERR', e.message); }
    }
  }
})();
