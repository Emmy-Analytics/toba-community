// Tes JSONP GET submit + GET reviews untuk konfirmasi pola baca
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  for (const q of ['api=reviews&callback=cb1', 'api=publishedReviews&callback=cb2', 'api=submitReview&name=QA+GET9&group=Tobaladies&rating=5&reviewText=Tes+GET&consent=true&callback=cb3']) {
    const r = await fetch(URL + '?' + q, { redirect: 'follow' });
    const t = await r.text();
    console.log('GET', q.slice(0, 60));
    console.log('  ->', res_ok(t));
  }
  function res_ok(t) { return t.startsWith('cb') ? t.slice(0, 400) : 'HTML(len ' + t.length + ')' }
})();
