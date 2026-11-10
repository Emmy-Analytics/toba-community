const fs = require('fs');
let s = fs.readFileSync('shot-challenge.js', 'utf8');
// every settle/init call should reposition, not clear the score
s = s.split('reset();').join('reposition();');
// restore the button's reset binding
s = s.replace(
  "mount.querySelector('#shotReset').addEventListener('click', () => { reposition(); });",
  "mount.querySelector('#shotReset').addEventListener('click', () => { reset(); });"
);
fs.writeFileSync('shot-challenge.js', s);
console.log('settles reposition; button resets');
