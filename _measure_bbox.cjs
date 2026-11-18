/* Ukur alpha bbox tiap SVG cutout: fraksi konten vs kanvas */
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = __dirname;
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end('nf'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    res.end(d);
  });
}).listen(8931, () => console.log('srv up'));

(async () => {
  const files = fs.readdirSync(path.join(ROOT, 'assets/img/cutout')).filter(f => f.endsWith('.svg'));
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8931/index.html', { waitUntil: 'domcontentloaded' });
  const out = await page.evaluate(async (files) => {
    const res = [];
    for (const f of files) {
      const url = 'assets/img/cutout/' + encodeURIComponent(f);
      const im = new Image();
      await new Promise(r => { im.onload = r; im.onerror = r; im.src = url; });
      const vw = im.naturalWidth, vh = im.naturalHeight;
      const S = 256 / Math.max(vw, vh);
      const c = document.createElement('canvas');
      c.width = Math.round(vw * S); c.height = Math.round(vh * S);
      const ctx = c.getContext('2d');
      ctx.drawImage(im, 0, 0, c.width, c.height);
      let minX = c.width, minY = c.height, maxX = -1, maxY = -1;
      try {
        const data = ctx.getImageData(0, 0, c.width, c.height).data;
        for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
          if (data[(y * c.width + x) * 4 + 3] > 12) {
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          }
        }
      } catch (e) { res.push({ file: f, err: String(e) }); continue; }
      if (maxX < 0) { res.push({ file: f, empty: true }); continue; }
      const bx0 = minX / c.width, bx1 = (maxX + 1) / c.width, by0 = minY / c.height, by1 = (maxY + 1) / c.height;
      res.push({
        file: f, vw, vh, aspectCanvas: +(vw / vh).toFixed(3),
        bbox: { x0: +bx0.toFixed(3), x1: +bx1.toFixed(3), y0: +by0.toFixed(3), y1: +by1.toFixed(3) },
        contentW: +(bx1 - bx0).toFixed(3), contentH: +(by1 - by0).toFixed(3),
        contentAspect: +(((bx1 - bx0) * vw) / ((by1 - by0) * vh)).toFixed(3),
        padLeft: +bx0.toFixed(3), padRight: +(1 - bx1).toFixed(3), padTop: +by0.toFixed(3), padBottom: +(1 - by1).toFixed(3)
      });
    }
    return res;
  }, files);
  console.log(JSON.stringify(out, null, 1));
  fs.writeFileSync(path.join(ROOT, '_bbox.json'), JSON.stringify(out, null, 1));
  await browser.close();
  server.close();
})().catch(e => { console.error(e); process.exit(1); });
