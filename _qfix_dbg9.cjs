/* Debug 9 — POSISI BARIS @media tempat mobile grid didefinisikan + konteks nesting */
const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');
const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
const lines = clean.split('\n');
const stack = [];
lines.forEach((l, idx) => {
  for (let k = 0; k < l.length; k++) {
    if (l[k] === '{') stack.push({ line: idx + 1, sel: l.slice(0, k).trim() });
    else if (l[k] === '}') stack.pop();
  }
  if (/grid-template-columns: 1fr 1\.15fr 1fr/.test(l)) {
    console.log('FOUND at line', idx + 1);
    console.log('NESTING STACK:');
    stack.forEach(s => console.log('   ', s.line, ':', s.sel.slice(0, 90)));
  }
});
