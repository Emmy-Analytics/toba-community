// Pola terakhir yang umum dipakai: body dikirim sebagai string raw TANPA Content-Type
// header sama sekali, sehingga Apps Script membacanya lewat e.postData.contents
// dan parse manual — ATAU backend membaca parameter dengan nama berbeda.
// Coba: body JSON dengan postData, api di query string.
const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  const json = JSON.stringify({ name: 'QA-Z1', group: 'Tobaladies', rating: 5, reviewText: 'Tes z', consent: true });
  const cases = [
    ['qs api + raw json', u + '?api=submitReview', { 'Content-Type': 'text/plain;charset=utf-8' }, json],
    ['qs api + no ct', u + '?api=submitReview', {}, json],
    ['qs api + urlenc fields', u + '?api=submitReview', { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, 'name=QA-Z2&group=Tobaladies&rating=5&reviewText=Tes+z2&consent=true'],
  ];
  for (const [label, url, headers, body] of cases) {
    const r = await fetch(url, { method: 'POST', headers, body, redirect: 'follow' });
    console.log(label, '->', (await r.text()).slice(0, 160));
  }
})();
