const fs = require('fs');
let s = fs.readFileSync('script.js', 'utf8');
const re = /  \/\* --- PEWARNAAN KANAL ---[\s\S]*?it\.cfg\.lane = LANES\.big\.includes\(it\.cfg\.file\) \? 'big' : 'sup';\r?\n  \}\);/g;
const matches = s.match(re) || [];
console.log('blocks found:', matches.length);
let n = 0;
s = s.replace(re, m => (++n === 1 ? m : ''));
fs.writeFileSync('script.js', s);
console.log('kept 1, removed', n - 1);
