const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch();
  const p = await b.newPage();
  await p.setViewport({ width: 355, height: 800 });
  await p.goto('http://localhost:8787/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  const info = await p.evaluate(() => {
    const box = document.getElementById('heroCutShow');
    const out = [];
    let e = box;
    while (e && e !== document.documentElement) {
      const r = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      out.push(`${e.tagName}.${(e.className + '').slice(0, 50)} L:${r.left.toFixed(1)} R:${r.right.toFixed(1)} W:${r.width.toFixed(1)} pos:${s.position} transform:${s.transform} margin:${s.marginLeft}/${s.marginRight} width:${s.width} ml:${s.marginLeft}`);
      e = e.parentElement;
    }
    return out.join('\n');
  });
  console.log(info);
  await b.close();
})();
