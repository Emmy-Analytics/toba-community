// Coba GET api=submitReview TANPA callback (doGet mungkin handle submitReview GET)
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  for (const q of ['api=submitReview', 'api=submitReview&name=QA+NC1&group=Tobaladies&rating=5&reviewText=Tes&consent=true']) {
    const r = await fetch(URL + '?' + q, { redirect: 'follow' });
    const t = await r.text();
    const isJson = t.startsWith('{') || t.startsWith('cb');
    console.log('GET', q.slice(0, 60), '->', isJson ? t.slice(0, 250) : 'HTML(len ' + t.length + ')');
  }
})();
