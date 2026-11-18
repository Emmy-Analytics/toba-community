const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const tries = [
  'api=submitReview&name=QA+P1&group=Tobaladies&rating=5&reviewText=Tes&consent=true',
  'api=submitReview&name=QA+P2&group=Tobaladies&rating=5&reviewText=Tes&consent=true',
  'name=QA+P3&group=Tobaladies&rating=5&reviewText=Tes&consent=true',
  'displayName=QA+P4&group=Tobaladies&rating=5&reviewText=Tes&consent=true'
];
(async () => {
  for (const b of tries) {
    const r = await fetch(URL, { method: 'POST', body: new URLSearchParams(b).toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, redirect: 'follow' });
    console.log('POST:', b.slice(0, 70));
    console.log('  ->', (await r.text()).slice(0, 300).replace(/\n/g, ' '));
  }
})();
