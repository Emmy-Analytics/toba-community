/* Debug 8 — LAPORAN MEDIA NESTING REAL: temukan blok @media yang tidak ditutup */
const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');
/* hapus komentar dulu */
const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
const lines = clean.split('\n');
const stack = [];  /* { line, sel } */
let errors = [];
lines.forEach((l, idx) => {
  /* count braces outside strings (approx) */
  for (let k = 0; k < l.length; k++) {
    const ch = l[k];
    if (ch === '{') {
      const sel = l.slice(0, k).trim();
      stack.push({ line: idx + 1, sel: sel || '(cont)' });
    } else if (ch === '}') {
      stack.pop();
      if (stack.length < 0) errors.push('extra } at line ' + (idx + 1));
    }
  }
});
console.log('UNCLOSED at end of file:', stack.length);
stack.forEach(s => console.log('  open @ line', s.line, ':', s.sel.slice(0, 100)));
