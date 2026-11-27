import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/gallery.html';
  const file = path.join(ROOT, p);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('nf'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise(r => server.listen(8941, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8941/gallery.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  window.tobaGalleryCallback({ success: true, photos: ['Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies', 'Tobadeli', 'Tobaladies'].map((c, i) => ({ photoId: 'M' + i, community: c, title: 'F' + i, caption: 'Momen ' + i, photographer: 'Pro', displayOrder: i + 1, archiveFileId: 'F' + i })) });
});
await page.waitForFunction(() => document.querySelectorAll('.hl-panel').length === 5, { timeout: 10000 });
await new Promise(r => setTimeout(r, 500));
await page.click('.hl-panel[data-idx="1"]');
await new Promise(r => setTimeout(r, 400));
await page.mouse.move(30, 500);
await new Promise(r => setTimeout(r, 700));
const dbg = await page.evaluate(() => {
  const el = document.querySelector('.hl-panel[data-idx="1"]');
  const img = el.querySelector('img');
  return {
    className: el.className,
    imgFilter: getComputedStyle(img).filter,
    ruleActive: [...document.styleSheets].some(ss => {
      try { return [...ss.cssRules].some(r => r.selectorText && r.selectorText.includes('.hl-panel.active img')); } catch (e) { return false; }
    }),
    inlineStyle: img.getAttribute('style') || 'none'
  };
});
console.log(JSON.stringify(dbg, null, 2));
await browser.close();
server.close();
