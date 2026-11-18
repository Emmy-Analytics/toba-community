/* Try GET JSONP-style submit variants + probe doGet param names */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const qs = [
  'api=submitReview&callback=tobaCb',
  'api=submit&callback=tobaCb',
  'api=submitReview&name=QA+G1&group=Tobaladies&rating=5&reviewText=Tes&consent=true&callback=tobaCb',
  'api=reviews&callback=tobaCb',
  'api=publishedReviews&callback=tobaCb',
  'api=testPublishedReviewsApi&callback=tobaCb'
];
(async () => {
  for (const q of qs) {
    try {
      const res = await fetch(URL + '?' + q, { redirect: 'follow' });
      const t = await res.text();
      console.log('GET', q.slice(0, 70));
      console.log('  ->', res.status, t.slice(0, 300).replace(/\n/g, ' '));
    } catch (e) { console.log('ERR', q, e.message); }
  }
})();
