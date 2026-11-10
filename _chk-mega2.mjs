import puppeteer from 'puppeteer';
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
p.on('pageerror', e => console.log('PAGEERR:', e.message));
p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE:', m.text()) });
await p.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle2' });
// check whether the intro removal triggers settle and whether some other listener closes the mega
await p.evaluate(() => { document.getElementById('tobaIntro')?.remove() });
await new Promise(r => setTimeout(r, 3300));
// dispatch via real mouse event at coordinates
const btn = await p.$('#navExplore');
const box = await btn.boundingBox();
await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
await new Promise(r => setTimeout(r, 500));
const st = await p.evaluate(() => ({ open: document.getElementById('megaMenu').classList.contains('open'), hidden: document.getElementById('megaMenu').hidden, w: document.getElementById('megaMenu').getBoundingClientRect().width }));
console.log('AFTER MOUSE CLICK:', JSON.stringify(st));
await b.close();
