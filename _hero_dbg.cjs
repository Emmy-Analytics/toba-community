/* Debug hero grid state at 355px */
const path = require('path');
const puppeteer = require(path.join(process.cwd(), 'node_modules', 'puppeteer'));
const http = require('http');
const fs = require('fs');
const root = process.cwd();
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const srv = http.createServer((req, res) => {
  let p = req.url.split('?')[0]; if (p === '/') p = '/index.html';
  const f = path.join(root, p);
  if (fs.existsSync(f) && fs.statSync(f).isFile()) {
    res.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  } else { res.writeHead(404); res.end('nf'); }
});
srv.listen(8471, async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 355, height: 800 });
  await page.goto('http://localhost:8471/', { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const out = await page.evaluate(() => {
    const box = document.querySelector('.hero-cut-slideshow');
    const cs = getComputedStyle(box);
    const info = [...box.querySelectorAll('img')].map(el => {
      const st = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { slot: el.dataset.slot, size: el.dataset.size, on: el.classList.contains('cut-on'), disp: st.display, vis: st.visibility, h: el.style.height, w: Math.round(r.width), right: Math.round(r.right), iw: innerWidth };
    });
    return { cols: cs.gridTemplateColumns, inline: box.style.gridTemplateColumns, boxW: box.clientWidth, gap: cs.columnGap, imgs: info };
  });
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
  srv.close();
});
