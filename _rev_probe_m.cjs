const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const tries = [
  'name=QA+M1&email=a@b.c&group=Tobaladies&rating=5&reviewText=Tes&consent=true',
  'api=submitReview&name=QA+M2&nickname=QA&group=Tobaladies&rating=5&reviewText=Tes&consent=true&kategori=Tobaladies&pesan=Tes',
  'name=QA+M3&group=Tobaladies&rating=5&review=Tes&consent=true&activity=Tobaladies',
  'action=submitReview&name=QA+M4&group=Tobaladies&rating=5&reviewText=Tes&consent=true'
];
(async () => {
  for (const b of tries) {
    const r = await fetch(URL, { method: 'POST', body: b, headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, redirect: 'follow' });
    console.log('POST:', b.slice(0, 80));
    console.log('  ->', (await r.text()).slice(0, 300).replace(/\n/g, ' '));
  }
})();
