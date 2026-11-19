// FINAL guess set: mungkin field wajib = (nickname/namaPanggilan, group/kelompok, rating, review/ulasan, consent) via qs 'api=submitReview' DI BODY, dengan content-type text/plain (Apps Script quirk untuk no-cors browser)
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const bodies = [
  ['text/plain full', 'text/plain;charset=utf-8', 'api=submitReview&name=QA+TP1&group=Tobaladies&rating=5&reviewText=Tes+textplain&consent=true'],
  ['text/plain display', 'text/plain;charset=utf-8', 'api=submitReview&displayName=QA+TP2&group=Tobaladies&rating=5&reviewText=Tes&consent=true'],
  ['urlencoded + api query + all', 'application/x-www-form-urlencoded;charset=utf-8', 'name=QA+TP3&nickname=QA+TP3&displayName=QA+TP3&group=Tobaladies&rating=5&reviewText=Tes&review=Tes&consent=true&agree=true&setuju=true&persetujuan=true&izin=true&website=&honeypot=&email=&phone='],
];
(async () => {
  for (const [label, ct, body] of bodies) {
    const r = await fetch(URL, { method: 'POST', headers: { 'Content-Type': ct }, body, redirect: 'follow' });
    const t = await r.text();
    console.log(label, '->', t.startsWith('{') ? t.slice(0, 250) : 'HTML(len ' + t.length + ')');
  }
})();
