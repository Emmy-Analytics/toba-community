import puppeteer from 'puppeteer';
const B = 'http://127.0.0.1:8321/';
const b = await puppeteer.launch({ headless: 'new' });
// desktop home + events grid
const d = await b.newPage();
await d.setViewport({ width: 1440, height: 900 });
await d.goto(B + 'index.html', { waitUntil: 'networkidle2' });
await d.evaluate(() => { document.getElementById('tobaIntro')?.remove() });
await new Promise(r => setTimeout(r, 2500));
await d.screenshot({ path: '_fin2-home-1440.png' });
// events mobile peek
const m = await b.newPage();
await m.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await m.goto(B + 'events.html', { waitUntil: 'networkidle2' });
await m.evaluate(() => { document.getElementById('tobaIntro')?.remove() });
await new Promise(r => setTimeout(r, 2200));
const grid = await m.$('.event-grid');
grid && await m.evaluate(el => el.scrollIntoView({ block: 'start' }), grid);
await new Promise(r => setTimeout(r, 1000));
await m.screenshot({ path: '_fin2-events-390.png' });
await b.close();
