/* doPost membaca apa? Kita punya bukti: 'Semua field wajib diisi.' (baris diketahui).
   PENTING: baris 1387 error 'Callback tidak valid' untuk GET JSONP submit — artinya
   doGet punya cabang submitReview yang memanggil getCallbackError... Berarti doGet
   MENANGANI api=submitReview juga! JSONP GET submit mungkin valid tapi callback
   harus terdaftar. Error 'Callback tidak valid' berarti whitelist callback.
   Coba GET submitReview dengan callback=tobaReviewsCallback (nama yang kemungkinan
   di-whitelist backend). */
(async () => {
  const U = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
  const cbs = ['tobaReviewsCallback', 'tobaHeroCallback', 'tobaMusicCallback', 'callback', 'cb'];
  for (const cb of cbs) {
    const q = 'api=submitReview&name=' + encodeURIComponent('QA GETSUB') + '&group=Tobaladies&rating=5&reviewText=' + encodeURIComponent('Tes GET submitReview') + '&consent=true&callback=' + cb;
    const r = await fetch(U + '?' + q, { redirect: 'follow' });
    const t = await r.text();
    console.log(cb, '->', t.startsWith(cb) || t.startsWith('{') ? t.slice(0, 300) : 'HTML(err: ' + (t.match(/Error:[^<]+/) || ['?'])[0].slice(0, 90) + ')');
  }
})();
