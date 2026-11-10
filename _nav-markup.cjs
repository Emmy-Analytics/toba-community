const fs = require('fs');
const closeSvg = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const chev = '<span class="chev" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></span>';
const groups = [['01', 'nav.g1'], ['02', 'nav.g2'], ['03', 'nav.g3'], ['04', 'nav.g4']];
const files = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'game.html', 'partnership.html'];
let n = 0;
files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/<button class="drawer-close" type="button" aria-label="Close">&#10005;<\/button>/g,
    '<button class="drawer-close" type="button" aria-label="Tutup navigasi">' + closeSvg + '</button>');
  groups.forEach(([num, key]) => {
    const rx = new RegExp('<p class="mega-label" data-i18n="' + key + '">([^<]*)</p>', 'g');
    c = c.replace(rx, (m, txt) =>
      '<button class="mega-label" type="button" data-i18n="' + key + '" aria-expanded="false"><span class="num" aria-hidden="true">' + num + '</span>' + txt + chev + '</button>');
  });
  fs.writeFileSync(file, c);
  n++;
});
console.log('markup updated on', n, 'files');
