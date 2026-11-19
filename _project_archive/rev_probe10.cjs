// Backend diketahui sukses sebelumnya. Mungkin sukses itu dicapai lewat
// submitTest yang mengisi SHEET langsung atau endpoint dev. Satu pola yang
// BELUM dicoba: field wajib backend mungkin = (nickname/namaPanggilan,
// kelompok, rating, ulasan/pesan, persetujuan) — kombinasi sangat spesifik.
// Coba matriks luas satu kali.
const u = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
const post = async (b) => {
  const r = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: b, redirect: 'follow' });
  return (await r.text()).slice(0, 120);
};
(async () => {
  // Cobalah rating sebagai int dan consent boolean via JSON lengkap dengan SEMUA alias sekaligus
  const r = await fetch(u, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, redirect: 'follow',
    body: JSON.stringify({ api: 'submitReview', name: 'QA-X1', displayName: 'QA-X1', nickname: 'QA-X1', nama: 'QA-X1', namaPanggilan: 'QA-X1', group: 'Tobaladies', kelompok: 'Tobaladies', rating: 5, reviewText: 'Tes x', review: 'Tes x', ulasan: 'Tes x', message: 'Tes x', pesan: 'Tes x', consent: true, agree: true, setuju: true, persetujuan: true })
  });
  console.log('json all-alias ->', (await r.text()).slice(0, 150));
  console.log('done');
})();
