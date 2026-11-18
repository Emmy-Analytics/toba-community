/* Debug 7: parsing lokal style.css — temukan kemana grid-template-columns hilang */
const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');
/* strip komentar */
const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
/* tokenize blocks sederhana + lacak @media nesting */
let i = 0; const stack = []; const hits = [];
while (i < clean.length) {
  const open = clean.indexOf('{', i);
  if (open < 0) break;
  const sel = clean.slice(i, open).trim().replace(/\s+/g, ' ');
  if (/^@media/.test(sel)) { stack.push(sel); i = open + 1; continue; }
  if (/^@/.test(sel)) { /* @keyframes dsb — skip body-nya seadanya */ }
  const close = clean.indexOf('}', open);
  const body = clean.slice(open + 1, close);
  if (/hero-cut-slideshow\s*$/.test(sel) && /grid-template-columns/.test(body)) {
    hits.push({ sel, media: stack.join(' >> '), cols: body.match(/grid-template-columns:[^;]+/)[0] });
  }
  if (sel === '' && stack.length) { stack.pop(); }
  i = close + 1;
}
console.log(JSON.stringify(hits, null, 1));
