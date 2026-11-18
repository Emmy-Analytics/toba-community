/* FINAL QA — desktop 1440: hero foto tampil, tidak overlap, tidak hscroll */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 8000));
  const data = await page.evaluate(() => {
    const b = document.querySelector('.hero-cut-slideshow');
    const imgs = [...b.querySelectorAll('img')];
    const on = imgs.filter(im => im.classList.contains('cut-on') && im.getBoundingClientRect().width > 4);
    const rects = on.map(im => {
      const r = im.getBoundingClientRect();
      return { tag: (im.className.match(/slot-[abc]|cut-ball/) || ['?']).join(','), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    });
    let overlaps = [];
    for (let i = 0; i < on.length; i++) for (let j = i + 1; j < on.length; j++) {
      const a = on[i].getBoundingClientRect(), c = on[j].getBoundingClientRect();
      const ox = Math.min(a.right, c.right) - Math.max(a.x, c.x);
      const oy = Math.min(a.bottom, c.bottom) - Math.max(a.y, c.y);
      if (ox > 4 && oy > 4) overlaps.push(ox.toFixed(0) + 'x' + oy.toFixed(0));
    }
    return { visible: on.length, rects, overlaps, hscroll: document.documentElement.scrollWidth > innerWidth + 2 };
  });
  console.log(JSON.stringify(data, null, 1));
  await page.screenshot({ path: '_qa_after_1440.png' });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
