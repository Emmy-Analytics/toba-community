/* Screenshot hero cutout at all required widths */
const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const srv = http.createServer((req, res) => {
  let p = req.url.split('?')[0]; if (p === '/') p = '/index.html';
  const fp = path.join(ROOT, decodeURIComponent(p));
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(res);
}).listen(8911);
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const VS = [355, 375, 393, 430, 1366, 1440, 1920];
  for (const w of VS) {
    const page = await browser.newPage();
    if (w < 761) await page.setViewport({ width: w, height: Math.round(w * 2.16), isMobile: true, hasTouch: true });
    else await page.setViewport({ width: w, height: Math.round(w * 0.56) });
    await page.goto('http://localhost:8911/index.html', { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 6500));  // biarkan komposisi stabil
    await page.screenshot({ path: '_hero_' + w + '.png' });
    await page.close();
  }
  await browser.close(); srv.close();
  console.log('done');
})().catch(e => { console.error('FATAL', e.message); srv.close(); process.exit(1); });
