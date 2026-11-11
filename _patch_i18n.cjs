/* Patch copywriting (Bagian 11-14) + penghapusan panah/em dash (Bagian 13)
   pada dictionary EN & ID di i18n.js — terarah per key. */
const fs = require('fs');
let src = fs.readFileSync('i18n.js', 'utf8');

const enEdits = [
  // Bagian 11 — contact & CTA umum (EN)
  ["'home.call.eyebrow':'QUESTIONS OR COLLABS?'", "'home.call.eyebrow':'GOT AN IDEA OR A COLLAB?'"],
  ["'home.call.h':'Just talk to us'", "'home.call.h':'Let\\u2019s talk with TOBA!'"],
  ["'home.call.lede':'Ask about schedules, how to join, or partnership ideas \\u2014 we answer when we can.'", "'home.call.lede':'Want to play, find basketball friends, or have a collab idea? Go for it, tell us. It might turn into something great!'"],
  ["'home.call.cta':'Contact TOBA'", "'home.call.cta':'Talk to TOBA!'"],
  ["'home.merch.link':'See the collection'", "'home.merch.link':'View the collection'"],
  // Bagian 12A — Home storytelling (EN)
  ["'story.h':'The story behind the name TOBA.'", "'story.h':'From the Court, Into a Family.'"],
  ["'story.lead':'TOBA comes from Tongkrongan Basket. It started from a simple habit: gathering, looking for people to play with, training, and enjoying basketball together.'", "'story.lead':'TOBA started with friends who kept meeting at the courts around BKT, East Jakarta. It began as fun games, then grew into a community. Everything started here.'"],
  ["'story.bridge.h':'Then one person turned the habit into a home.'", "'story.bridge.h':'It All Started With One Person.'"],
  ["'story.circle.h':'One community, two groups.'", "'story.circle.h':'One TOBA, Two Families.'"],
  ["'story.circle.lede':'One community, two groups \\u2014 each with its own character, growing and playing together under TOBA.'", "'story.circle.lede':'Different characters, one passion. Tobadeli and Tobaladies grow together within one community, TOBA.'"],
  // Bagian 12B — Tobaladies (EN) — hero/aktivitas via comm.* yang dipakai kedua halaman,
  // storytelling Tobaladies:
  ["'tl.story.lead':'Tobaladies lahir dari kebutuhan sederhana yang sering diabaikan: perempuan di Jakarta Timur butuh tempat untuk main basket tanpa harus merasa jadi penonton. Dari satu lapangan di sekitar BKT, para pemain perempuan mulai kumpul, latihan, dan mengisi lapangan dengan suara mereka sendiri.'", "'tl.story.lead':'Tobaladies was born because women in East Jakarta also needed a place to play basketball. From the courts around BKT, players started gathering, training, and building their own community.'"],
  ["'tl.story.p1':'Nama Tobaladies diambil dari Tongkrongan Basket Ladies. Pendeknya: tongkrongan basket untuk perempuan. Tidak lebih rumit dari itu. Semua yang dilakukan di sini berawal dari satu tujuan, yaitu punya tempat untuk bermain dengan bebas.'", "'tl.story.p1':'The name Tobaladies comes from Tongkrongan Basket Ladies. Simple, because we wanted a place to meet, grow, and enjoy basketball together.'"],
  // Bagian 13 — EN: hilangkan em dash dekoratif
  ["'story.ladies.d':'Tongkrongan Basket Ladies \\u2014 a place where women players meet, grow, and enjoy the game.'", "'story.ladies.d':'Tongkrongan Basket Ladies, a place where women players meet, grow, and enjoy the game.'"],
  ["'story.deli.d':'Tongkrongan Basket Dekat Kali \\u2014 the men\\u2019s group, grown from the courts around BKT and Brickhouse The East.'", "'story.deli.d':'Tongkrongan Basket Dekat Kali, the men\\u2019s group, grown from the courts around BKT and Brickhouse The East.'"],
  ["'events.note':' the TOBA Weekly Fun Game happens every Saturday, 18.00\\u201320.00 WIB at '", "'events.note':' the TOBA Weekly Fun Game happens every Saturday, 18.00 to 20.00 WIB at '"],
];

const idEdits = [
  // Bagian 11 — contact & CTA umum (ID)
  ["'home.call.eyebrow':'ADA PERTANYAAN ATAU KERJASAMA?'", "'home.call.eyebrow':'PUNYA IDE ATAU MAU KOLAB?'"],
  ["'home.call.h':'Hubungi kami langsung'", "'home.call.h':'Yuk, ngobrol bareng TOBA!'"],
  ["'home.call.lede':'Ada ide atau mau kolaborasi? Hubungi kami \\u2014 biasanya kami balas cepat.'", "'home.call.lede':'Mau ikut main, cari teman basket, atau punya ide kolaborasi? Gas, ceritakan ke kami. Siapa tahu bisa jadi sesuatu yang seru!'"],
  ["'home.call.cta':'Hubungi kami'", "'home.call.cta':'Yuk, Hubungi TOBA!'"],
  // Bagian 12A — Home storytelling (ID)
  ["'story.h':'Cerita di balik nama TOBA.'", "'story.h':'Dari Lapangan, Jadi Keluarga.'"],
  ["'story.lead':'TOBA berasal dari Tongkrongan Basket. Berawal dari kebiasaan sederhana: berkumpul, mencari teman main, latihan, dan menikmati basket bersama. Satu komunitas yang tumbuh jadi dua kelompok.'", "'story.lead':'TOBA berawal dari teman-teman yang sering ketemu di lapangan sekitar BKT, Jakarta Timur. Awalnya cuma fun game, lama-lama jadi komunitas. Dari sini, semuanya dimulai.'"],
  ["'story.bridge.h':'Lalu satu orang mengubah kebiasaan itu jadi rumah.'", "'story.bridge.h':'Semua Berawal dari Satu Orang.'"],
  ["'story.bridge.p':'Kebiasaan itu terus jalan, circle-nya terus tumbuh \\u2014 dan semua itu berawal dari satu orang. Kenali pendirinya di bawah.'", "'story.bridge.p':'Ada yang punya ide, lalu mulai membangun sesuatu yang lebih besar. Kenali sosok di balik perjalanan TOBA.'"],
  ["'story.circle.h':'Satu komunitas, dua kelompok.'", "'story.circle.h':'Satu TOBA, Dua Keluarga.'"],
  ["'story.circle.lede':'Satu komunitas, dua kelompok \\u2014 dengan karakter masing-masing, yang sama-sama tumbuh dan bermain bersama di TOBA.'", "'story.circle.lede':'Beda karakter, satu passion. Tobadeli dan Tobaladies tumbuh bersama dalam satu komunitas, TOBA.'"],
  // Bagian 12B — Tobaladies (ID)
  ["'tl.story.lead':'Tobaladies lahir dari kebutuhan sederhana yang sering diabaikan: perempuan di Jakarta Timur butuh tempat untuk main basket tanpa harus merasa jadi penonton. Dari satu lapangan di sekitar BKT, para pemain perempuan mulai kumpul, latihan, dan mengisi lapangan dengan suara mereka sendiri.'", "'tl.story.lead':'Tobaladies lahir karena perempuan di Jakarta Timur juga butuh tempat untuk main basket. Dari lapangan sekitar BKT, para pemain mulai berkumpul, latihan, dan membangun komunitas sendiri.'"],
  ["'tl.story.p1':'Nama Tobaladies diambil dari Tongkrongan Basket Ladies. Pendeknya: tongkrongan basket untuk perempuan. Tidak lebih rumit dari itu. Semua yang dilakukan di sini berawal dari satu tujuan, yaitu punya tempat untuk bermain dengan bebas.'", "'tl.story.p1':'Tobaladies berasal dari Tongkrongan Basket Ladies. Sederhana, karena kami ingin punya tempat untuk bertemu, berkembang, dan menikmati basket bersama.'"],
  ["'tl.story.p3':'Nilainya sederhana: datang, main, saling angkat. Setiap sesi latihan, friendly game, dan momen kebersamaan dibangun untuk membuat anggotanya makin percaya diri dan berkembang.'", "'tl.story.p3':'Datang, Main, Saling Dukung. Dari latihan sampai friendly game, setiap sesi jadi kesempatan untuk makin percaya diri dan berkembang bersama.'"],
  ["'tl.story.p4':'Di dalam ekosistem TOBA Community, Tobaladies adalah sisi perempuan yang tumbuh bersama Tobadeli \\u2014 dua tim, satu tongkrongan, satu lapangan.'", "'tl.story.p4':'Tobaladies adalah sisi perempuan dalam TOBA Community. Bersama Tobadeli, kami tumbuh dalam satu komunitas dan satu kecintaan terhadap basket.'"],
  // Bagian 13 — ID: hilangkan em dash dekoratif
  ["'story.ladies.d':'Tongkrongan Basket Ladies \\u2014 tempat pemain perempuan bertemu, berkembang, dan menikmati permainan.'", "'story.ladies.d':'Tongkrongan Basket Ladies, tempat pemain perempuan bertemu, berkembang, dan menikmati permainan.'"],
  ["'story.deli.d':'Tongkrongan Basket Dekat Kali \\u2014 kelompok basket laki-laki yang tumbuh dari lingkungan BKT dan Brickhouse The East.'", "'story.deli.d':'Tongkrongan Basket Dekat Kali, kelompok basket laki-laki yang tumbuh dari lingkungan BKT dan Brickhouse The East.'"],
  ["'comm.lede':'Rutinitas kami simpel: latihan skill, fun game akhir pekan, dan sesekali sparring bareng kelompok lain. Semua level welcome \\u2014 yang penting datang dan main.'", "'comm.lede.women':'Latihan skill, fun game akhir pekan, dan sesekali sparring. Semua level welcome. Yang penting berani datang dan mulai main.'"],
];

let okEn = 0, missEn = [];
for (const [a, b] of enEdits) { if (src.includes(a)) { src = src.replace(a, b); okEn++; } else missEn.push(a.slice(0, 60)); }
let okId = 0, missId = [];
for (const [a, b] of idEdits) {
  // ID edits live in the id: section — replace only after the "id:{" marker
  const idx = src.indexOf('id:{');
  const head = src.slice(0, idx), tail = src.slice(idx);
  if (tail.includes(a)) { src = head + tail.replace(a, b); okId++; } else missId.push(a.slice(0, 60));
}
fs.writeFileSync('i18n.js', src);
console.log('EN applied:', okEn, 'missing:', missEn.length, missEn);
console.log('ID applied:', okId, 'missing:', missId.length, missId);
