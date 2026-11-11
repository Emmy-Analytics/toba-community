/* Bagian 14: key CTA maskulin Tobadeli + hero/aktivitas copy (EN & ID). */
const fs = require('fs');
let s = fs.readFileSync('i18n.js', 'utf8');

const enAdd = "'deli.cta1':'Join the Squad','deli.cta2':'View Game Schedule','deli.link':'Hit the Court','deli.meet':'Meet Tobadeli',";
const idAdd = "'deli.cta1':'Join the Squad','deli.cta2':'Lihat Jadwal Main','deli.link':'Turun ke Lapangan','deli.meet':'Kenali Tobadeli',";

// sisip setelah 'comm.cta1' di masing-masing blok (pertama = en, kedua = id)
const marker = "'comm.cta1':";
let first = s.indexOf(marker);
let second = s.indexOf(marker, first + 10);
if (first < 0 || second < 0) { console.log('marker not found', first, second); process.exit(1) }
// sisip SEBELUM marker: en dulu, lalu id (sisip dari belakang agar indeks aman)
s = s.slice(0, second) + idAdd + s.slice(second);
s = s.slice(0, first) + enAdd + s.slice(first);

// Bagian 12C: lede & aktivitas Tobadeli berbeda dari Tobaladies — pakai tPair di script.js,
// di sini hanya perbaiki comm.lede EN agar setara:
s = s.replace("'comm.lede':'Our routine is simple: skill training, weekend fun games, and the occasional sparring with other groups. Every level is welcome \u2014 just show up and play.'",
    "'comm.lede':'Skill training, weekend fun games, and occasional sparring. Every level welcome. Show up and play.'");

fs.writeFileSync('i18n.js', s);
console.log('deli CTA keys added (en+id)');
