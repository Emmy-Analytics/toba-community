// Cari parameter POST yang benar: variant dengan field persis seperti kolom sheet (displayName, group, rating, reviewText, consent) via qs API + JSON — plus test with trailing fields all
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  // 1. qs api di URL + body fields persis nama kolom
  let r = await fetch(URL + '?api=submitReview', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: 'displayName=QA+Q1&group=Tobaladies&rating=5&reviewText=Tes+qsapi&consent=true', redirect: 'follow' });
  console.log('qsapi+display ->', (await r.text()).slice(0, 200));
  // 2. JSON body persis kolom + api di query
  r = await fetch(URL + '?api=submitReview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayName: 'QA-Q2', group: 'Tobaladies', rating: 5, reviewText: 'Tes json qs', consent: true }), redirect: 'follow' });
  console.log('jsonqs ->', (await r.text()).slice(0, 200));
  // 3. form-data (multipart) + api di query
  const fd = new FormData();
  fd.append('displayName', 'QA-Q3'); fd.append('group', 'Tobaladies'); fd.append('rating', '5'); fd.append('reviewText', 'Tes fd'); fd.append('consent', 'true');
  r = await fetch(URL + '?api=submitReview', { method: 'POST', body: fd, redirect: 'follow' });
  console.log('fdqs ->', (await r.text()).slice(0, 200));
})();
