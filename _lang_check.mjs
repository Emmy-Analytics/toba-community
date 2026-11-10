import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 320, height: 800 });
await page.goto('http://127.0.0.1:8471/index.html?lang=id', { waitUntil: 'networkidle2' }).catch(() => { });
await new Promise(r => setTimeout(r, 1200));
// clear stored language, reload with ?lang=id
await page.evaluate(() => localStorage.removeItem('toba-lang') || localStorage.clear());
await page.goto('http://127.0.0.1:8471/index.html?lang=id', { waitUntil: 'networkidle2' }).catch(() => { });
await new Promise(r => setTimeout(r, 1200));
const txt = await page.evaluate(() => document.querySelector('.hero h1')?.textContent.trim().slice(0, 60));
console.log('clean-profile ?lang=id hero:', txt);
await page.screenshot({ path: '_lang-id-clean.png', clip: { x: 0, y: 0, width: 320, height: 700 } });
await browser.close();
