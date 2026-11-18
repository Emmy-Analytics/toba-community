const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch();
  const p = await b.newPage();
  await p.setViewport({ width: 355, height: 800 });
  await p.goto('http://localhost:8787/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  const info = await p.evaluate(() => {
    const out = [];
    // top-level elements that extend past viewport
    [...document.body.children].forEach(e => {
      const r = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      out.push(`BODYCHILD ${e.tagName}.${(e.className + '').slice(0, 50)} L:${Math.round(r.left)} R:${Math.round(r.right)} W:${Math.round(r.width)} pos:${s.position} ovfX:${s.overflowX} display:${s.display}`);
    });
    out.push(`doc scrollWidth:${document.documentElement.scrollWidth} body scrollWidth:${document.body.scrollWidth}`);
    // walk: for each element, check scrollWidth of its children vs itself, to find which child creates the width
    const widen = [];
    document.querySelectorAll('body *').forEach(e => {
      const r = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      // elements positioned/overflowing that could set scroll area: skip those inside overflow hidden parents
      let par = e.parentElement, clipped = false;
      while (par && par !== document.body) {
        const ps = getComputedStyle(par);
        if (/(hidden|clip)/.test(ps.overflowX)) { clipped = true; break; }
        par = par.parentElement;
      }
      if (!clipped && r.right > 356 && e.children.length > 0) {
        widen.push(`${e.tagName}.${(e.className + '').slice(0, 60)} L:${Math.round(r.left)} R:${Math.round(r.right)} pos:${s.position} ovfX:${s.overflowX}`);
      }
    });
    out.push('--- WIDENERS (unclipped) ---');
    out.push(widen.slice(0, 30).join('\n'));
    return out.join('\n');
  });
  console.log(info);
  await b.close();
})();
