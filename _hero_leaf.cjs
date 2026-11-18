const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch();
  const p = await b.newPage();
  await p.setViewport({ width: 355, height: 800 });
  await p.goto('http://localhost:8787/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  const leaves = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('body *').forEach(e => {
      const r = e.getBoundingClientRect();
      if (r.width > 0 && r.right > 356 && e.children.length === 0) {
        let c = ''; try { c = e.className instanceof SVGAnimatedString ? e.className.baseVal : String(e.className); } catch (_) { }
        out.push(e.tagName + '.' + c.slice(0, 60) + ' | R:' + Math.round(r.right) + ' L:' + Math.round(r.left) + ' W:' + Math.round(r.width) + ' | text:' + (e.textContent || '').trim().slice(0, 40));
      }
    });
    return out;
  });
  console.log(leaves.join('\n') || 'NO LEAF OVERFLOW');
  await b.close();
})();
