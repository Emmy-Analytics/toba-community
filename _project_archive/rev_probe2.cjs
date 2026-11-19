const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const bodies = [
  ['json strict', 'application/json', JSON.stringify({ api: 'submitReview', name: 'QA-J1', group: 'Tobaladies', rating: 5, reviewText: 'Tes json', consent: true })],
  ['form no api', 'application/x-www-form-urlencoded;charset=utf-8', 'name=QA-F1&group=Tobaladies&rating=5&reviewText=Tes&consent=true'],
  ['api in body', 'application/x-www-form-urlencoded;charset=utf-8', 'api=submitReview&name=QA-B1&group=Tobaladies&rating=5&reviewText=Tes&consent=true'],
  ['text/plain api in body', 'text/plain;charset=utf-8', 'api=submitReview&name=QA-TP1&group=Tobaladies&rating=5&reviewText=Tes&consent=true'],
];
(async () => {
  for (const [label, ct, body] of bodies) {
    const r = await fetch(URL, { method: 'POST', headers: { 'Content-Type': ct }, body, redirect: 'follow' });
    const t = await r.text();
    console.log(label, '->', t.slice(0, 200));
  }
})();
