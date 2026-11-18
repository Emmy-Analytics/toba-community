const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const tries = [
  'api=submitReview&name=QA+N1&group=Tobaladies&rating=5&reviewText=Tes&consent=true',
  'api=submitReview&displayName=QA+N2&group=Tobaladies&rating=5&reviewText=Tes&consent=true',
  'api=submitReview&nama=QA+N3&group=Tobaladies&rating=5&review=Tes&consent=true',
  'api=submitReview&action=submitReview&name=QA+N4&category=Tobaladies&rating=5&reviewText=Tes&consent=true',
  'name=QA+N5&group=Tobaladies&rating=5&reviewText=Tes&consent=true',
  'api=submitReview&payload=' + encodeURIComponent(JSON.stringify({ name: 'QA+N6', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true }))
];
(async () => {
  for (const b of tries) {
    try {
      const res = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: b, redirect: 'follow' });
      const t = await res.text();
      console.log('BODY:', b.slice(0, 80));
      console.log('  ->', res.status, t.slice(0, 200).replace(/\n/g, ' '));
    } catch (e) { console.log('ERR', b.slice(0, 60), e.message); }
  }
})();
