  const fs = require('fs');
const files = ['index.html', 'tobadeli.html', 'tobaladies.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html', 'game.html'];
const MARK = '<span class="brand-mark"><img src="assets/crocodile-head-trans.png" alt=""></span>';
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const n = s.split(MARK).length - 1;
  s = s.split(MARK).join('');
  fs.writeFileSync(f, s);
  console.log(f, 'removed:', n);
}
