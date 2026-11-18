const fs = require('fs');
for (const f of ['grup dina.svg', 'fuzisal.svg', 'yuki.svg', 'vina.svg', 'bola basket.svg']) {
  const h = fs.readFileSync('assets/img/cutout/' + f).slice(0, 400).toString();
  const w = h.match(/width="([\d.]+)"/);
  const ht = h.match(/height="([\d.]+)"/);
  const vb = h.match(/viewBox="([^"]+)"/);
  console.log(f, '| width=', w && w[1], '| height=', ht && ht[1], '| viewBox=', vb && vb[1]);
}
