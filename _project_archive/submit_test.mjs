// Test submit dengan nama field alternatif yang belum dicoba
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const qs = (o) => new URLSearchParams(o).toString();
const bodies = [
  ['displayName only', qs({ api: 'submitReview', displayName: 'QA-DC1', group: 'Tobaladies', rating: '5', reviewText: 'Tes displayName', consent: 'true' })],
  ['nickname', qs({ api: 'submitReview', nickname: 'QA-DC2', group: 'Tobaladies', rating: '5', reviewText: 'Tes nickname', consent: 'true' })],
  ['name+message', qs({ api: 'submitReview', name: 'QA-DC3', group: 'Tobaladies', rating: '5', message: 'Tes message', consent: 'true' })],
  ['nama+ulasan', qs({ api: 'submitReview', nama: 'QA-DC4', kelompok: 'Tobaladies', rating: '5', ulasan: 'Tes ulasan', setuju: 'true' })],
  ['all common non-empty', qs({ api: 'submitReview', name: 'QA-DC5', displayName: 'QA-DC5', nickname: 'QA-DC5', nama: 'QA-DC5', group: 'Tobaladies', rating: '5', reviewText: 'Tes semua', review: 'Tes semua', message: 'Tes semua', ulasan: 'Tes semua', text: 'Tes semua', content: 'Tes semua', consent: 'true', agree: 'true', setuju: 'true' })],
  ['no api param', qs({ name: 'QA-DC6', group: 'Tobaladies', rating: '5', reviewText: 'Tes noapi', consent: 'true' })],
  ['type=review', qs({ type: 'review', api: 'submitReview', name: 'QA-DC7', group: 'Tobaladies', rating: '5', reviewText: 'Tes type', consent: 'true' })],
];
(async () => {
  for (const [label, b] of bodies) {
    const r = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: b, redirect: 'follow' });
    const t = await r.text();
    console.log(label, '->', t.startsWith('{') ? t.slice(0, 200) : 'HTML(len ' + t.length + ')');
  }
})();
