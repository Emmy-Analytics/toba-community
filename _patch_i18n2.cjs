/* Lanjutan patch: sisa key yang gagal di putaran pertama (dash unicode asli di file). */
const fs = require('fs');
let src = fs.readFileSync('i18n.js', 'utf8');
const D = '\u2014';

const edits = [
  // EN
  ["'home.call.lede':'Ask about schedules, how to join, or partnership ideas " + D + " we answer when we can.'",
    "'home.call.lede':'Want to play, find basketball friends, or have a collab idea? Go for it, tell us. It might turn into something great!'"],
  ["'story.circle.lede':'One community, two groups " + D + " each with its own character, growing and playing together under TOBA.'",
    "'story.circle.lede':'Different characters, one passion. Tobadeli and Tobaladies grow together within one community, TOBA.'"],
  ["'story.ladies.d':'Tongkrongan Basket Ladies " + D + " a place where women players meet, grow, and enjoy the game.'",
    "'story.ladies.d':'Tongkrongan Basket Ladies, a place where women players meet, grow, and enjoy the game.'"],
  ["'story.deli.d':'Tongkrongan Basket Dekat Kali " + D + " the men\u2019s group, grown from the courts around BKT and Brickhouse The East.'",
    "'story.deli.d':'Tongkrongan Basket Dekat Kali, the men\u2019s group, grown from the courts around BKT and Brickhouse The East.'"],
  ["'events.note':' the TOBA Weekly Fun Game happens every Saturday, 18.00\u201320.00 WIB at '",
    "'events.note':' the TOBA Weekly Fun Game happens every Saturday, 18.00 to 20.00 WIB at '"],
  // ID (hanya di bagian id:{})
  ["'home.call.lede':'Ada ide atau mau kolaborasi? Hubungi kami " + D + " biasanya kami balas cepat.'",
    "'home.call.lede':'Mau ikut main, cari teman basket, atau punya ide kolaborasi? Gas, ceritakan ke kami. Siapa tahu bisa jadi sesuatu yang seru!'"],
  ["'story.bridge.p':'Kebiasaan itu terus jalan, circle-nya terus tumbuh " + D + " dan semua itu berawal dari satu orang. Kenali pendirinya di bawah.'",
    "'story.bridge.p':'Ada yang punya ide, lalu mulai membangun sesuatu yang lebih besar. Kenali sosok di balik perjalanan TOBA.'"],
  ["'story.circle.lede':'Satu komunitas, dua kelompok " + D + " dengan karakter masing-masing, yang sama-sama tumbuh dan bermain bersama di TOBA.'",
    "'story.circle.lede':'Beda karakter, satu passion. Tobadeli dan Tobaladies tumbuh bersama dalam satu komunitas, TOBA.'"],
  ["'tl.story.p3':'Nilainya sederhana: datang, main, saling angkat. Setiap sesi latihan, friendly game, dan momen kebersamaan dibangun untuk membuat anggotanya makin percaya diri dan berkembang.",
    "'tl.story.p3':'Datang, Main, Saling Dukung. Dari latihan sampai friendly game, setiap sesi jadi kesempatan untuk makin percaya diri dan berkembang bersama.'"],
  ["'tl.story.p4':'Di dalam ekosistem TOBA Community, Tobaladies adalah sisi perempuan yang tumbuh bersama Tobadeli " + D + " dua tim, satu tongkrongan, satu lapangan.'",
    "'tl.story.p4':'Tobaladies adalah sisi perempuan dalam TOBA Community. Bersama Tobadeli, kami tumbuh dalam satu komunitas dan satu kecintaan terhadap basket.'"],
  ["'story.ladies.d':'Tongkrongan Basket Ladies " + D + " tempat pemain perempuan bertemu, berkembang, dan menikmati permainan.'",
    "'story.ladies.d':'Tongkrongan Basket Ladies, tempat pemain perempuan bertemu, berkembang, dan menikmati permainan.'"],
  ["'story.deli.d':'Tongkrongan Basket Dekat Kali " + D + " kelompok basket laki-laki yang tumbuh dari lingkungan BKT dan Brickhouse The East.'",
    "'story.deli.d':'Tongkrongan Basket Dekat Kali, kelompok basket laki-laki yang tumbuh dari lingkungan BKT dan Brickhouse The East.'"],
  ["'comm.lede':'Rutinitas kami simpel: latihan skill, fun game akhir pekan, dan sesekali sparring bareng kelompok lain. Semua level welcome " + D + " yang penting datang dan main.'",
    "'comm.lede':'Latihan skill, fun game akhir pekan, dan sesekali sparring. Semua level welcome. Yang penting berani datang dan mulai main.'"],
];

let ok = 0; const missed = [];
for (const [a, b] of edits) {
  const idx = src.indexOf("id:{");
  // coba di seluruh file dulu; jika bentrok dengan EN, batasi ke bagian id:{}
  if (src.includes(a)) { src = src.replace(a, b); ok++; continue; }
  missed.push(a.slice(0, 55));
}
fs.writeFileSync('i18n.js', src);
console.log('applied:', ok, 'missed:', missed.length);
missed.forEach(m => console.log('MISS:', m));
