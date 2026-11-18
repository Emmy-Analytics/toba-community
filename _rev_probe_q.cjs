/* doGet-routing seems active for api=reviews. Maybe doPost requires param api in QUERY STRING plus fields in POST body. Try combos with api in query + fields in body + specific header X-Requested-With etc. Also try POST to /dev fallback? Try 'api=submitReview' in query AND body. */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const F = 'name=QA+X&group=Tobaladies&rating=5&reviewText=Tes&consent=true';
(async () => {
  const combos = [
    [URL + '?api=submitReview', F],
    [URL + '?api=submitReview&name=QA+Q2&group=Tobaladies&rating=5&reviewText=Tes&consent=true', ''],
    [URL, 'api=submitReview&' + F],
    [URL + '?action=submitReview', F],
    [URL, 'action=submitReview&' + F],
  ];
  let i = 0;
  for (const [u, b] of combos) {
    const r = await fetch(u, { method: 'POST', body: b, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, redirect: 'follow' });
    const t = await r.text();
    console.log('combo', ++i, '->', t.startsWith('{') ? t.slice(0, 180) : 'HTML(len ' + t.length + ')');
  }
  // GET routing probes: which api values return JSON at all
  for (const api of ['reviews', 'review', 'published', 'publishedReviews', 'listReviews', 'getReviews']) {
    const r = await fetch(URL + '?api=' + api + '&callback=cb', { redirect: 'follow' });
    const t = await r.text();
    console.log('GET api=' + api, '->', t.startsWith('cb(') ? t.slice(0, 120) : 'HTML');
  }
})();
