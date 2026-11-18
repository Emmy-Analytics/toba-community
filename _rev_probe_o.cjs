/* Maybe doPost expects a specific top-level key. Try 'review' object inside JSON, plus test with 'nama','komunitas','rating','ulasan','persetujuan' EXACT */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const tries = [
  ['ind-1', 'nama=QA+I1&komunitas=Tobaladies&rating=5&ulasan=Tes&persetujuan=ya'],
  ['ind-2', 'nama=QA+I2&grup=Tobaladies&rating=5&ulasan=Tes&persetujuan=true'],
  ['json-review', JSON.stringify({ review: { name: 'QA+I3', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true } })],
  ['json-fields', JSON.stringify({ fields: { name: 'QA+I4', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true } })],
  ['form-1', 'Name=QA+C1&Group=Tobaladies&Rating=5&ReviewText=Tes&Consent=true'],
  ['form-2', 'nama=QA+C2&kelompok=Tobaladies&penilaian=5&teks=Tes&setuju=true']
];
(async () => {
  for (const [l, b] of tries) {
    const r = await fetch(URL, { method: 'POST', body: b, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, redirect: 'follow' });
    console.log(l, '->', (await r.text()).slice(0, 200).replace(/\n/g, ' '));
  }
})();
