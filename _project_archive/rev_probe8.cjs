// Uji field 'nama','group' dsb tapi rating numeric string + reviewText alternatif
// Coba juga apakah backend memakai parameter 'data' (JSON string) atau 'payload'
const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  const data = JSON.stringify({ name: 'QA-DT1', group: 'Tobaladies', rating: 5, reviewText: 'Tes data', consent: true });
  const variants = [
    ['data param', 'application/x-www-form-urlencoded;charset=utf-8', 'api=submitReview&data=' + encodeURIComponent(data)],
    ['payload param', 'application/x-www-form-urlencoded;charset=utf-8', 'api=submitReview&payload=' + encodeURIComponent(data)],
    ['json body no api', 'application/json', data],
    ['reviewText only no consent key', 'application/x-www-form-urlencoded;charset=utf-8', 'api=submitReview&name=QA-NC1&group=Tobaladies&rating=5&reviewText=Tes'],
  ];
  for (const [label, ct, body] of variants) {
    const r = await fetch(u, { method: 'POST', headers: { 'Content-Type': ct }, body, redirect: 'follow' });
    console.log(label, '->', (await r.text()).slice(0, 200));
  }
})();
