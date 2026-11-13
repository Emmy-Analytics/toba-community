import puppeteer from 'puppeteer';
const B = 'http://127.0.0.1:8099/';
const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 900, deviceScaleFactor: 1 });
await page.goto(B + 'index.html', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2500));
const data = await page.evaluate(() => {
  const items = [...document.querySelectorAll('.cine-m-item')];
  const first = items[0] ? getComputedStyle(items[0]) : null;
  const colors = [...new Set(items.map(i => getComputedStyle(i).color))];
  const marquee = document.querySelector('.cine-marquee');
  const merch = document.querySelector('.merch-section') || document.querySelector('#merchSection') || document.querySelector('[class*="merch"]');
  const heading = document.querySelector('.mw-ink')?.closest('h1,h2,h3');
  const gap = marquee && merch ? Math.round(merch.getBoundingClientRect().top - marquee.getBoundingClientRect().bottom) : null;
  // heading split colors
  const ink = document.querySelector('.mw-ink'); const acc = document.querySelector('.accent-orange');
  return {
    marqueeColors: colors, itemCount: items.length, gapMarqueeToMerch: gap,
    headingText: heading ? heading.textContent.trim() : null,
    inkColor: ink ? getComputedStyle(ink).color : null,
    accColor: acc ? getComputedStyle(acc).color : null,
    inkSize: ink ? getComputedStyle(ink).fontSize : null
  };
});
console.log('INDEX:', JSON.stringify(data, null, 1));
const marq = await page.$('.cine-marquee');
if (marq) await marq.screenshot({ path: '_qa_marquee_index.png' });
// gallery rows on gallery page with correct class detection
await page.goto(B + 'gallery.html', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2500));
const g = await page.evaluate(() => {
  const rowSel = ['.cine-g-row', '.cine-row', '.cine-g-r1', '.cine-track', '.cine-g-track'];
  let sel = rowSel.find(s => document.querySelector(s));
  if (!sel) { const all = [...document.querySelectorAll('[class*="cine"]')].slice(0, 30).map(e => e.className); return { noSel: true, classes: all }; }
  const rows = [...document.querySelectorAll(sel)].slice(0, 3);
  return rows.map(row => {
    const cards = [...row.querySelectorAll('[class*="card"],[class*="item"],img')];
    const rr = row.getBoundingClientRect();
    const left = Math.min(...cards.map(c => c.getBoundingClientRect().left));
    const right = Math.max(...cards.map(c => c.getBoundingClientRect().right));
    return { cards: cards.length, left: Math.round(left), right: Math.round(right), rowW: Math.round(rr.width) };
  });
});
console.log('GALLERY:', JSON.stringify(g));
await browser.close(); console.log('DONE');
