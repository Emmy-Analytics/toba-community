/* Backend membaca sheet via SpreadsheetApp, bukan sheet param. Coba baca header
   kolom lewat 'doGet' debug: banyak backend menyediakan api=debug/info. Coba
   beberapa api GET dan lihat output JSON mana yang mengandung nama kolom. */
(async () => {
  const U = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
  for (const api of ['info', 'debug', 'columns', 'schema', 'headers', 'ping', 'status', 'reviewsAdmin', 'adminReviews', 'allReviews', 'rawReviews']) {
    try {
      const r = await fetch(U + '?api=' + api + '&callback=cb', { redirect: 'follow' });
      const t = await r.text();
      console.log(api, '->', t.startsWith('cb(') ? t.slice(0, 250) : 'HTML(len ' + t.length + ')');
    } catch (e) { console.log(api, 'ERR', e.message); }
  }
})();
