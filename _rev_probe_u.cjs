/* doPost seems to always answer "Semua field wajib diisi." regardless of body — maybe it only reads e.postData.contents as JSON and requires keys name, group, rating, reviewText, consent... but our JSON failed. Maybe it requires 'nova' internal key or checks e.parameter['name'] when content-type is form... Everything failed, so maybe doPost is guarded by a token/origin check that fails BEFORE validation, and the message is a red herring default. Try adding fields via e.parameter while content-type=multipart AND api in query — done. Try 'Content-Type: application/x-www-form-urlencoded' with fields AND include 'submitReview' as a bare key? Try posting to URL+'?api=submitReview' with form data — done (combo1). 

New idea: maybe doPost expects data in 'e.postData.contents' parsed JSON with keys: nama,namaPanggilan? Let's try the Apps Script "Web App POST from HTML form" pattern that Google requires: form must POST with enctype text/plain? Actually known quirk: Apps Script web apps need 'Content-Type: text/plain' OR the classic no-cors fetch. Node fetch works. Hmm.

Try JSON with keys exactly: { nama, kelompok, rating, ulasan, izin }:  */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  const bodies = [
    JSON.stringify({ nama: 'QA-1', kelompok: 'Tobaladies', rating: 5, ulasan: 'Tes', izin: true }),
    JSON.stringify({ nama: 'QA-2', kelompok: 'Tobaladies', rating: 5, ulasan: 'Tes', izinPublikasi: true }),
    JSON.stringify({ reviewer: 'QA-3', aktivitas: 'Tobaladies', rating: 5, komentar: 'Tes', consent: true }),
    JSON.stringify({ name: 'QA-4', activity: 'Tobaladies', rating: 5, comment: 'Tes', consent: true }),
    JSON.stringify({ user: 'QA-5', group: 'Tobaladies', rating: 5, reviewText: 'Tes', consent: true, source: 'website' }),
  ];
  for (const b of bodies) {
    const r = await fetch(URL, { method: 'POST', body: b, headers: { 'Content-Type': 'application/json' }, redirect: 'follow' });
    const t = await r.text();
    console.log(t.startsWith('{') ? t.slice(0, 160) : 'HTML', '<=', b.slice(0, 60));
  }
})();
