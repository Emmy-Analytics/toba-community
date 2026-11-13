/* Final QA sweep for Prompts 36-46 — computed checks + screenshots */
const puppeteer = require('puppeteer');
const PAGES = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html'];
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const out = {};
  for (const p of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://127.0.0.1:8099/' + p, { waitUntil: 'networkidle2', timeout: 45000 }).catch(e => { out[p] = { fatal: String(e).slice(0, 120) }; });
    if (out[p]) { await page.close(); continue; }
    await new Promise(r => setTimeout(r, 2200));
    const r = await page.evaluate(() => {
      const cs = el => el ? getComputedStyle(el) : null;
      const res = {};
      // 40/41 merch heading + marquee color
      const ink = document.querySelector('.mw-ink');
      const acc = document.querySelector('.accent-orange');
      const merch = document.querySelector('.merch-heading');
      const mItems = [...document.querySelectorAll('.cine-m-item')];
      res.marqueeColors = [...new Set(mItems.map(m => cs(m).color))];
      res.mItemSample = mItems[0] ? mItems[0].textContent.trim().slice(0, 30) : null;
      res.heading = merch ? merch.textContent.trim().slice(0, 40) : null;
      res.inkColor = ink ? cs(ink).color : null;
      res.accColor = acc ? cs(acc).color : null;
      // 42 gallery track
      const track = document.querySelector('.cine-g-track, .g-track, .gallery-track, [data-gallery-track]');
      if (track) { const rr = track.getBoundingClientRect(); res.gallery = { cls: track.className.slice(0, 50), w: Math.round(rr.width), sw: track.scrollWidth, vw: innerWidth, kids: track.children.length }; }
      // 39 gap marquee -> merch block
      const mq = document.querySelector('.cine-marquee');
      const mh = document.querySelector('.merch-heading');
      if (mq && mh) { res.gapMQtoHeading = Math.round(mh.getBoundingClientRect().top - mq.getBoundingClientRect().bottom); }
      if (mq) { const rr = mq.getBoundingClientRect(); res.marquee = { h: Math.round(rr.height), overflowHidden: cs(mq).overflow === 'hidden', items: mq.querySelectorAll('.cine-m-item').length }; }
      // 44/45/46 footer
      const soc = document.querySelector('.footer-social');
      if (soc) { const ks = [...soc.children]; res.social = ks.map(k => { const rr = k.getBoundingClientRect(); return { tag: k.tagName, txt: k.textContent.trim().slice(0, 28), h: Math.round(rr.height), href: (k.getAttribute('href') || k.querySelector('a')?.getAttribute('href') || '').slice(0, 42) }; }); }
      const pw = document.querySelector('.pw-ig');
      if (pw) { const svg = pw.querySelector('svg') || (pw.closest('a') && pw.closest('a').querySelector('svg')); const rr = pw.getBoundingClientRect(); res.pwIG = { box: Math.round(rr.width) + 'x' + Math.round(rr.height), svg: svg ? getComputedStyle(svg).width + ' color:' + getComputedStyle(svg).color : null }; }
      res.waToba = !!document.querySelector('footer a[href*="wa.me/6281285704946"]');
      return res;
    });
    out[p] = r;
    await page.close();
  }
  // Screenshots: index hero desktop + merch + gallery desktop
  const shots = [
    ['index.html', 1366, 900, '_qaF_hero_desktop.png'],
    ['index.html', 390, 844, '_qaF_hero_390.png'],
    ['merchandise.html', 390, 844, '_qaF_merch_390.png'],
    ['merchandise.html', 1366, 900, '_qaF_merch_desktop.png'],
    ['gallery.html', 1366, 900, '_qaF_gallery_desktop.png'],
  ];
  for (const [p, w, h, path] of shots) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.goto('http://127.0.0.1:8099/' + p, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2500));
    await page.screenshot({ path });
    if (p === 'merchandise.html') { await page.evaluate(() => { const el = document.querySelector('.merch-heading') || document.querySelector('footer'); el && el.scrollIntoView({ block: 'center' }); }); await new Promise(r => setTimeout(r, 800)); await page.screenshot({ path: path.replace('.png', '_scrolled.png') }); }
    await page.close();
  }
  await browser.close();
  require('fs').writeFileSync('_qaF_result.json', JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
})();
