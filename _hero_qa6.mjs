import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
const root = process.cwd();
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer((req, res) => { let p = req.url.split('?')[0]; if (p === '/') p = '/index.html'; const f = join(root, decodeURIComponent(p)); if (!existsSync(f)) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': mime[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f)); });
await new Promise(r => server.listen(8942, r));
const b = await puppeteer.launch({ headless: 'new' });
const page = await b.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message));

/* ---- swipe test (touch) mobile 390 ---- */
await page.setViewport({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:8942/index.html', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 3500));
const swipe = {};
swipe.before = await page.evaluate(() => document.querySelector('.cut-stage .tier-main')?.src.slice(-18));
await page.touchscreen.touchStart(320, 500);
await page.touchscreen.touchMove(140, 500);
await page.touchscreen.touchEnd();
await new Promise(r => setTimeout(r, 800));
swipe.after = await page.evaluate(() => document.querySelector('.cut-stage .tier-main')?.src.slice(-18));
swipe.changed = swipe.before !== swipe.after;

/* ball alive mobile */
swipe.ballMoved = await page.evaluate(async () => {
  const b = document.querySelector('.hero-cut-img.cut-ball');
  if (!b) return false;
  const s1 = b.style.getPropertyValue('--bx') + '|' + b.style.getPropertyValue('--by');
  await new Promise(r => setTimeout(r, 1500));
  const s2 = b.style.getPropertyValue('--bx') + '|' + b.style.getPropertyValue('--by');
  return s1 !== s2;
});
await page.screenshot({ path: '_qa_swipe_mobile.png' });
console.log(JSON.stringify({ swipe, errs }, null, 1));
await b.close(); server.close();
