const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  const r = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: 'api=submitReview&name=QA+P1&group=Tobaladies&rating=5&reviewText=Tes+probe&consent=true', redirect: 'follow' });
  const t = await r.text();
  const i = t.indexOf('{"');
  console.log('post json idx:', i);
  console.log(i >= 0 ? t.slice(i, i + 250) : 'HTML len ' + t.length + ' tail: ' + t.slice(-300));
})();
