const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec?api=submitReview&name=QA+G9&group=Tobaladies&rating=5&reviewText=Tes&consent=true&callback=tobaCb';
fetch(u, { redirect: 'follow' }).then(r => r.text()).then(t => {
  const i = t.indexOf('errorMessage');
  console.log('SNIP:', t.slice(i, i + 400));
  const j = t.indexOf('font-family:monospace');
  console.log('TAIL:', t.slice(t.lastIndexOf('font-family:monospace') - 50, t.lastIndexOf('font-family:monospace') + 400));
});
