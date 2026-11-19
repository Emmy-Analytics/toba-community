// Uji JSONP submitReview — mungkin backend menangani submit via doGet JSONP juga
// (backend existing memakai JSONP utk api=reviews & api=hero).
const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  const variants = [
    'api=submitReview&callback=tobaSubmitCb&name=QA-JP1&group=Tobaladies&rating=5&reviewText=Tes+jsonp&consent=true',
    'api=submitReview&callback=tobaSubmitCb&displayName=QA-JP2&group=Tobaladies&rating=5&reviewText=Tes+jsonp2&consent=true',
  ];
  for (const q of variants) {
    const r = await fetch(u + '?' + q, { redirect: 'follow' });
    const t = await r.text();
    console.log(q.slice(0, 55), '->', t.slice(0, 220));
     console.log('---');
  }
})();
