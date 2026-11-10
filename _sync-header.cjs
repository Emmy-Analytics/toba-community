const fs = require('fs');
const files = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'game.html', 'partnership.html'];
/* canonical shared-nav markup: one source, patched into every page */
const src = fs.readFileSync('index.html', 'utf8');
const hdr = /<button class="nav-explore[\s\S]*?<\/nav>/.exec(src)[0];
let patched = 0;
files.forEach(f => {
  if (f === 'index.html') return;
  let c = fs.readFileSync(f, 'utf8');
  const m = /<button class="nav-explore[\s\S]*?<\/nav>/.exec(c);
  if (!m) { console.log(f, 'NO HEADER'); return; }
  if (m[0] === hdr) { console.log(f, 'already canonical'); return; }
  fs.writeFileSync(f, c.replace(m[0], hdr));
  patched++;
  console.log(f, 'patched');
});
console.log('patched', patched);
