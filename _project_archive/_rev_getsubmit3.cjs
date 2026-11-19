/* GET submitReview dengan callback via redirect manual untuk melihat JSON final. */
(async () => {
  const U = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
  const q = 'api=submitReview&name=' + encodeURIComponent('QA GETSUB2') + '&group=Tobaladies&rating=5&reviewText=' + encodeURIComponent('Tes GET submit 2') + '&consent=true&callback=tobaReviewsCallback';
  const r0 = await fetch(U + '?' + q, { redirect: 'manual' });
  const loc = r0.headers.get('location');
  console.log('status', r0.status, 'loc?', !!loc);
  if (loc) {
    const r1 = await fetch(loc, { redirect: 'follow' });
    const t1 = await r1.text();
    console.log('len', t1.length);
    const i = t1.indexOf('tobaReviewsCallback(');
    console.log(i >= 0 ? t1.slice(i, i + 400) : '(no jsonp; first 300: ' + t1.slice(0, 300).replace(/\n/g, ' ') + ')');
  }
})();
