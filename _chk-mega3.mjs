import puppeteer from 'puppeteer';
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle2' });
// remove intro but keep page intact, then click via page.click (trusted CDP click like a real user)
await p.evaluate(() => { document.getElementById('tobaIntro')?.remove() });
await new Promise(r => setTimeout(r, 500));
await p.click('#navExplore');
await new Promise(r => setTimeout(r, 500));
let st = await p.evaluate(() => ({ open: document.getElementById('megaMenu').classList.contains('open'), hidden: document.getElementById('megaMenu').hidden }));
console.log('fresh page click:', JSON.stringify(st));
// also check on a non-home page (no intro exists there at all)
await p.goto('http://127.0.0.1:8321/gallery.html', { waitUntil: 'networkidle2' });
await p.click('#navExplore');
await new Promise(r => setTimeout(r, 500));
st = await p.evaluate(() => ({ open: document.getElementById('megaMenu').classList.contains('open'), hidden: document.getElementById('megaMenu').hidden }));
console.log('gallery page click:', JSON.stringify(st));
await b.close();
