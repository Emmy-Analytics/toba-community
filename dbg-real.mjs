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
await new Promise(r => server.listen(8961, r));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('console', m => { if (m.text().includes('TOBA')) console.log('APP:', m.text()); });
page.on('request', r => { if (r.url().includes('script.google.com')) console.log('REQ:', r.url().slice(0, 120)); });
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8961/gallery.html', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 20000));
console.log('final cards:', await page.evaluate(() => document.querySelectorAll('.gallery-item').length),
  '| count:', await page.evaluate(() => document.getElementById('galleryCount')?.textContent),
  '| status:', (await page.evaluate(() => document.getElementById('galleryStatus')?.textContent || '')).slice(0, 80));
await browser.close();
server.close();
