/* Final probe set: alternative field names incl 'email','wa','phone','team','kategori','ulasan','pesan','rating','review','isi','konten' etc. */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const qs = (o) => new URLSearchParams(o).toString();
const V = [
  qs({ api: 'submitReview', displayName: 'QA-B1', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true }),
  qs({ api: 'submitReview', name: 'QA-B2', group: 'Tobaladies', rating: 5, review: 'Tes', consent: true }),
  qs({ api: 'submitReview', name: 'QA-B3', kategori: 'Tobaladies', rating: 5, reviewText: 'Tes', persetujuan: true }),
  qs({ api: 'submitReview', name: 'QA-B4', team: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true }),
  qs({ api: 'submitReview', nama: 'QA-B5', group: 'Tobaladies', rating: 5, isi: 'Tes', setuju: true }),
  qs({ api: 'submitReview', name: 'QA-B6', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true, apiVersion: 2 }),
  qs({ api: 'submitReview', name: 'QA-B7', group: 'tobaladies', rating: 'lima', reviewText: 'Tes', consent: 'setuju' }),
  qs({ api: 'submitReview', name: 'QA-B8', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true, submit: 'kirim' }),
  qs({ api: 'reviews.submit', name: 'QA-B9', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true }),
  qs({ api: 'submitReview', name: 'QA-B10', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true, form: 'review' }),
];
(async () => {
  for (const b of V) {
    const r = await fetch(URL, { method: 'POST', body: b, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, redirect: 'follow' });
    const t = await r.text();
    const tag = t.startsWith('{') ? t.slice(0, 170) : 'HTML';
    if (!t.includes('Semua field wajib')) console.log('*** HIT:', b.slice(0, 90), '->', tag);
    else console.log('miss', b.slice(20, 60));
  }
})();
