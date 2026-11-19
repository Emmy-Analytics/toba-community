// Submit via FormData persis seperti browser form submission (no fetch custom)
// dan juga cek apakah ada endpoint baru (deployment terpisah utk reviews).
const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  // Apa yang terjadi jika TANPA api param sama sekali, POST semua field
  const qs = new URLSearchParams({ name: 'QA-NA1', group: 'Tobaladies', rating: '5', reviewText: 'Tes noapi', consent: 'true' });
  let r = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: qs.toString(), redirect: 'follow' });
  console.log('no api POST ->', (await r.text()).slice(0, 200));

  // GET dengan semua param, no api
  r = await fetch(u + '?' + qs.toString(), { redirect: 'follow' });
  const t = await r.text();
  const j = t.indexOf('{"');
  console.log('no api GET ->', j >= 0 ? t.slice(j, j + 200) : 'HTML len ' + t.length);

  // cek api=submit (bukan submitReview)
  r = await fetch(u + '?api=submit', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: 'name=QA-SB1&group=Tobaladies&rating=5&reviewText=Tes&consent=true', redirect: 'follow' });
  console.log('api=submit ->', (await r.text()).slice(0, 200));
})();
