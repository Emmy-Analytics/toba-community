/* Try e.parameter style but with lowercase 'consent' vs 'setuju'... Actually, maybe doPost validates: name, email, message? Try required fields: name, email, rating, message, consent? or includes 'category'? Try broad: include ALL plausible keys at once and see if it passes */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const all = {
  api: 'submitReview', action: 'submitReview', name: 'QA-ALL', displayName: 'QA-ALL', nickname: 'QA-ALL', nama: 'QA-ALL',
  email: 'qa@test.id', phone: '0812', whatsapp: '0812',
  group: 'Tobaladies', community: 'Tobaladies', category: 'Tobaladies', kategori: 'Tobaladies', team: 'Tobaladies', komunitas: 'Tobaladies',
  rating: '5', score: '5', bintang: '5', penilaian: '5',
  reviewText: 'Tes lengkap', review: 'Tes lengkap', message: 'Tes lengkap', text: 'Tes lengkap', ulasan: 'Tes lengkap', isi: 'Tes lengkap', content: 'Tes lengkap',
  consent: 'true', agree: 'true', setuju: 'true', persetujuan: 'true', permission: 'true', allowed: 'true'
};
const qs = new URLSearchParams(all).toString();
(async () => {
  const r = await fetch(URL, { method: 'POST', body: qs, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, redirect: 'follow' });
  const t = await r.text();
  console.log('ALL ->', t.startsWith('{') ? t.slice(0, 400) : 'HTML');
})();
