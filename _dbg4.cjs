const fs = require('fs');
let s = fs.readFileSync('shot-challenge.js', 'utf8');
s = s.replace('const move = e => {',
    'const move = e => { (window.__shotLog=window.__shotLog||[]).push("MOVE "+Math.round(pos(e).x)+","+Math.round(pos(e).y));');
fs.writeFileSync('shot-challenge.js', s);
console.log('move instrumented');
