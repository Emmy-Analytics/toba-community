const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const tries = [
  ['JSON simple', JSON.stringify({ name: 'QA+J1', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true }), 'application/json'],
  ['JSON w api', JSON.stringify({ api: 'submitReview', name: 'QA+J2', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true }), 'application/json'],
  ['JSON text/plain', JSON.stringify({ name: 'QA+J3', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true }), 'text/plain'],
  ['FormData', null, null]
];
(async () => {
  for (const [label, body, ct] of tries) {
    try {
      const opt = { method: 'POST', redirect: 'follow', headers: {} };
      if (body !== null) { opt.body = body; if (ct) opt.headers['Content-Type'] = ct; }
      else { const fd = new FormData(); fd.append('api', 'submitReview'); fd.append('name', 'QA+F1'); fd.append('group', 'Tobaladies'); fd.append('rating', '5'); fd.append('reviewText', 'Tes'); fd.append('consent', 'true'); opt.body = fd; }
      const res = await fetch(URL, opt);
      const t = await res.text();
      console.log(label, '->', res.status, t.slice(0, 200).replace(/\n/g, ' '));
    } catch (e) { console.log('ERR', label, e.message); }
  }
})();
