// Fix mojibake in HTML files: latin1-decoded UTF-8 sequences back to real chars.
const fs = require('fs');
const files = ['index.html', 'tobadeli.html', 'tobaladies.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html', 'game.html'];
const map = {
  'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â¹': '', 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â': '\u2014', 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢': '\u2019',
  'ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ': '\u201C', 'ÃƒÂ¢Ã¢â€šÂ¬\u009D': '\u201D', 'Ã¢â‚¬â€': '\u2014',
  'Ã¢â‚¬â„¢': '\u2019', 'Ã¢â‚¬Å"': '\u201C', 'Ã¢â‚¬\u009D': '\u201D', 'Ã¢â‚¬Â¦': '\u2026',
  'â€”': '\u2014', 'â€™': '\u2019', 'â€œ': '\u201C', 'â€\u009D': '\u201D',
  'â€¦': '\u2026', 'Ã—': '\u00D7', 'Â\xa0': ' ', 'Ã©': '\u00E9'
};
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  // repeatedly fold double-encoded sequences
  for (let i = 0; i < 3; i++) for (const [k, v] of Object.entries(map)) s = s.split(k).join(v);
  if (s !== before) { fs.writeFileSync(f, s); console.log('fixed', f); }
  else console.log('clean ', f);
}
