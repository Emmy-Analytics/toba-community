/* extract error message from GET submit attempt */
const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec?api=submitReview&name=QA+G9&group=Tobaladies&rating=5&reviewText=Tes&consent=true&callback=tobaCb';
fetch(u, { redirect: 'follow' }).then(r => r.text()).then(t => {
  const m = t.match(/errorMessage[^<]*>([^<]{0,300})/);
  const e2 = t.match(/Error:?[^<]{0,300}/);
  console.log('MSG:', m && m[1]);
  console.log('ALT:', e2 && e2[0]);
});
