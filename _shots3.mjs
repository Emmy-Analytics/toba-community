import puppeteer from 'puppeteer';
const B = 'http://127.0.0.1:8321/';
const b = await puppeteer.launch({ headless: 'new' });
const pages = ['tobaladies.html', 'tobadeli.html', 'gallery.html', 'merchandise.html', 'partnership.html'];
for (const p of pages) {
  const d = await b.newPage();
  await d.setViewport({ width: 1440, height: 900 });
  await d.goto(B + p, { waitUntil: 'networkidle2' });
  await d.evaluate(() => { document.getElementById('tobaIntro')?.remove(); document.querySelector('.tld-intro')?.remove(); document.getElementById('tdlIntro')?.remove(); });
  await new Promise(r => setTimeout(r, 2600));
  await d.screenshot({ path: '_fin2-' + p.replace('.html', '') + '-1440.png' });
  await d.close();
}
await b.close();
