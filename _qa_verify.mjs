import puppeteer from 'puppeteer';

const B = 'http://127.0.0.1:8099/';
const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });

// --- Merch page: marquee color, spacing, heading
await page.goto(B + 'merchandise.html', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1500));
const data = await page.evaluate(() => {
  const item = document.querySelector('.cine-m-item');
  const cs = item ? getComputedStyle(item) : null;
  const heading = document.querySelector('.merch-section .section-heading h2') || document.querySelector('.merch-section h2');
  const headingHTML = heading ? heading.innerHTML.trim() : null;
  const hColor = heading ? getComputedStyle(heading).color : null;
  const marquee = document.querySelector('.cine-marquee');
  const merchSection = document.querySelector('.merch-section');
  const label = document.querySelector('.merch-section .section-eyebrow') || document.querySelector('.merch-label');
  const gap = marquee && merchSection ? merchSection.getBoundingClientRect().top - marquee.getBoundingClientRect().bottom : null;
  const ig = document.querySelector('.pw-ig');
  const igInfo = ig ? { w: ig.getBoundingClientRect().width, stroke: getComputedStyle(ig).color, vis: getComputedStyle(ig).visibility, disp: getComputedStyle(ig).display } : null;
  return {
    marqueeColor: cs ? cs.color : null, headingHTML, hColor, gap, igInfo,
    itemCount: document.querySelectorAll('.cine-m-item').length
  };
});
console.log('MERCH:', JSON.stringify(data, null, 1));

// screenshot marquee + merch top
const marq = await page.$('.cine-marquee');
if (marq) await marq.screenshot({ path: '_qa_marquee_color.png' });
const merch = await page.$('.merch-section');
if (merch) await merch.screenshot({ path: '_qa_merch_block.png' });

// --- Footer of index: porto icon, social group
await page.goto(B + 'index.html', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1200));
const f = await page.evaluate(() => {
  const ig = document.querySelector('.pw-ig');
  const r = ig ? ig.getBoundingClientRect() : null;
  const links = [...document.querySelectorAll('.footer-social .footer-slink')].map(a => a.textContent.trim());
  const gapBetween = (() => { const l = [...document.querySelectorAll('.footer-social .footer-slink')].map(a => a.getBoundingClientRect()); let g = []; for (let i = 1; i < l.length; i++)g.push(Math.round(l[i].top - l[i - 1].bottom)); return g; })();
  return {
    igRect: r ? { w: Math.round(r.width), h: Math.round(r.height) } : null,
    igColor: ig ? getComputedStyle(ig).color : null,
    socialLinks: links, socialGaps: gapBetween
  };
});
console.log('FOOTER:', JSON.stringify(f, null, 1));
const foot = await page.$('.footer-social');
if (foot) await foot.screenshot({ path: '_qa_footer_social.png' });
const credit = await page.$('.pw-credit');
if (credit) await credit.screenshot({ path: '_qa_porto_credit.png' });

// --- Gallery rows fill check
await page.goto(B + 'gallery.html', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const g = await page.evaluate(() => {
  const rows = [...document.querySelectorAll('.cine-g-row')].slice(0, 3).map(row => {
    const cards = [...row.querySelectorAll('.cine-g-card')];
    const rr = row.getBoundingClientRect();
    const left = Math.min(...cards.map(c => c.getBoundingClientRect().left));
    const right = Math.max(...cards.map(c => c.getBoundingClientRect().right));
    return { cards: cards.length, left: Math.round(left), right: Math.round(right), rowW: Math.round(rr.width) };
  });
  return rows;
});
console.log('GALLERY:', JSON.stringify(g));
await browser.close();
console.log('DONE');
