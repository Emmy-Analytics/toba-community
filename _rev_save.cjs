const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec?api=submitReview&name=QA+G9&group=Tobaladies&rating=5&reviewText=Tes&consent=true&callback=tobaCb';
fetch(u, { redirect: 'follow' }).then(r => r.text()).then(t => {
  fs.writeFileSync('_rev_getsubmit.html', t);
});
const fs = require('fs');
