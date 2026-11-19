// Uji apakah ada endpoint kedua (deployment /v2) untuk Reviews — coba beberapa
// pola URL yang umum: exec dengan param api=reviews terbukti jalan, jadi backend
// DOGET punya handler reviews. Mungkin submitReview hanya lewat POST dengan
// e.postData.type 'application/x-www-form-urlencoded' — Apps Script kadang
// mengubahnya ke multipart/form-data. Coba juga kirim 'api' HANYA di query,
// body hanya field:
const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  const r = await fetch(u + '?api=submitReview', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: 'name=QA-QB1&group=Tobaladies&rating=5&reviewText=Tes+qb&consent=true', redirect: 'follow' });
  console.log('api in query, fields in body ->', (await r.text()).slice(0, 200));
})();
