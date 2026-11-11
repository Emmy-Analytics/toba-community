/* Bagian 13: bersihkan panah & em dash dekoratif pada copy tampil (bukan komentar). */
const fs = require('fs');
let s = fs.readFileSync('i18n.js', 'utf8');
const reps = [
  // ann.line (EN & ID)
  ["'ann.line':'EAST JAKARTA BASKETBALL COMMUNITY \u2014 WANT TO PLAY? JOIN US.'",
    "'ann.line':'EAST JAKARTA BASKETBALL COMMUNITY. WANT TO PLAY? JOIN US.'"],
  ["'ann.line':'KOMUNITAS BASKET DI JAKARTA TIMUR. GAS MAIN? GAS.'",
    "'ann.line':'KOMUNITAS BASKET DI JAKARTA TIMUR. GAS MAIN? GAS.'"],
  // story.kicker (EN & ID)
  ["'story.kicker':'TOBA \u2014 TONGKRONGAN BASKET'", "'story.kicker':'TOBA. TONGKRONGAN BASKET'"],
  // founder.eyebrow (EN & ID)
  ["'founder.eyebrow':'FOUNDER \u2014 THE STORY BEHIND TOBA'", "'founder.eyebrow':'FOUNDER. THE STORY BEHIND TOBA'"],
  ["'founder.eyebrow':'FOUNDER \u2014 CERITA DI BALIK TOBA'", "'founder.eyebrow':'FOUNDER. CERITA DI BALIK TOBA'"],
  // merch / brand note EN
  ["'merch.hero.lede':'Official TOBA apparel and merch \u2014 this catalog is still a demo, prices may change.'",
    "'merch.hero.lede':'Official TOBA apparel and merch. This catalog is still a demo, prices may change.'"],
  ["'brand.note':'TOBA stands for Tongkrongan Basket \u2014 not a place, a crew. Bukan soal asal mana, tapi soal ketemu teman yang sama-sama suka basket.'",
    "'brand.note':'TOBA stands for Tongkrongan Basket, not a place, a crew. Bukan soal asal mana, tapi soal ketemu teman yang sama-sama suka basket.'"],
  // merch ID
  ["'merch.hero.lede':'Koleksi apparel dan merchandise resmi TOBA. Katalog masih demo \u2014 harga bisa berubah.'",
    "'merch.hero.lede':'Koleksi apparel dan merchandise resmi TOBA. Katalog masih demo, harga bisa berubah.'"],
  // story.lead EN masih ada em dash? cek juga beberapa
];
let ok = 0, miss = [];
for (const [a, b] of reps) { if (s.includes(a)) { s = s.replace(a, b); ok++ } else miss.push(a.slice(0, 55)) }
fs.writeFileSync('i18n.js', s);
console.log('applied:', ok, 'missed:', miss.length); miss.forEach(m => console.log('MISS:', m));

// script.js: alt founder "name — role" → koma
let j = fs.readFileSync('script.js', 'utf8');
const jn = j.replace("alt=\"${t('founder.name')} \u2014 ${t('founder.role')}\"", "alt=\"${t('founder.name')}, ${t('founder.role')}\"");
if (jn !== j) { fs.writeFileSync('script.js', jn); console.log('script.js alt fixed') } else console.log('script.js alt: no change/already clean');
