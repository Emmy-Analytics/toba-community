/* Baca isi sheet Reviews via getSheet + JSON stringify dari server-side:
   kirim fungsi serialisasi — tidak bisa. Pakai trik: getSheet lalu panggil
   v.getDataRange.getValues() tidak mungkin. Namun Sheet object bridge punya
   method server-side — stringify hanya menampilkan nama. Coba: kirim balik
   lewat withSuccessHandler bertingkat tidak bisa.
   SATU-SATUNYA cara: SheetApp? Coba SpreadsheetApp.flush atau fitur lain:
   sebenarnya kita butuh HEADER KOLOM sheet Reviews untuk tahu nama field.
   Alternatif: api=reviews GET sudah memberi nama field yang di-return backend.
   doPost kemungkinan membaca e.parameter dengan nama yang sama: displayName,
   group, reviewText, rating, consent, status? Sudah dicoba...
   Coba sekali lagi dengan URLSearchParams TANPA api param dan content-type
   multipart — SUDAH.
   Terakhir: coba testSubmitReview dengan callback bertingkat untuk membaca
   isi Sheet setelah submit supaya kita tahu format baris yang tersimpan. */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const blankFrame = p.frames().find(f => f.url().includes('/blank'));
  if (!blankFrame) { console.log('no blank frame'); await b.close(); return; }

  // Panggil doGet via gs.run tidak bisa. Tapi kita bisa memanggil getSheet lalu
  // menggunakan google.script.run.url — coba fetch API method: FormData via Fetch
  // Tidak. Coba: panggil testSubmitReview dan lihat apakah menambah baris baru,
  // dengan snapshot api=reviews SEBELUM dan SESUDAH.
  const before = await fetch('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec?api=reviews&callback=cb').then(r => r.text());
  console.log('BEFORE:', before.slice(0, 200));
  await blankFrame.evaluate(() => new Promise(res => {
    google.script.run.withSuccessHandler(v => res()).testSubmitReview();
    setTimeout(res, 40000);
  }));
  const after = await fetch('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec?api=reviews&callback=cb').then(r => r.text());
  console.log('AFTER:', after.slice(0, 400));
  await b.close();
})();
