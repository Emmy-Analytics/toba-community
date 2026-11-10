import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
for (const w of [320, 1440]) {
  await page.setViewport({ width: w, height: w < 700 ? 800 : 900 });
  await page.goto('http://127.0.0.1:8471/index.html', { waitUntil: 'networkidle2' }).catch(() => { });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => { document.querySelectorAll('.obi-skip,.tld-skip,.tdl-skip').forEach(b => b && b.click && b.click()); });
  await page.evaluate(() => { document.querySelector('.lang-btn[data-lang="id"]')?.click(); });
  await new Promise(r => setTimeout(r, 1100));
  const d = await page.evaluate(() => {
    const h1 = document.querySelector('.hero h1');
    const r = h1?.getBoundingClientRect();
    const sub = document.querySelector('.hero-subtitle')?.getBoundingClientRect();
    const act = document.querySelector('.hero-actions')?.getBoundingClientRect();
    return { h1: r && { top: Math.round(r.top), visible: r.top < innerHeight }, subTop: sub && Math.round(sub.top), actTop: act && Math.round(act.top), vh: innerHeight };
  });
  console.log(`${w}px: h1top=${d.h1?.top} visible=${d.h1?.visible} subTop=${d.subTop} actionsTop=${d.actTop} viewportH=${d.vh}`);
  await page.screenshot({ path: `_lay-${w}.png`, fullPage: false });
}
await browser.close();
