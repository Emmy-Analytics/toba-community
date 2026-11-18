const path = require('path');
const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
(async () => {
  const root = process.cwd();
  const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
  const server = http.createServer((req, res) => {
    const p = path.join(root, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
    fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end(); } else { res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(d); } });
  });
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;
  const browser = await puppeteer.launch({ headless: 'new' });
  const viewports = [
    { n: '355', w: 355, h: 800 },
    { n: '375', w: 375, h: 812 },
    { n: '393', w: 393, h: 852 },
    { n: '430', w: 430, h: 932 },
    { n: '1366', w: 1366, h: 768 },
    { n: '1440', w: 1440, h: 900 },
    { n: '1920', w: 1920, h: 1080 },
  ];
  const out = [];
  for (const v of viewports) {
    const page = await browser.newPage({ viewport: { width: v.w, height: v.h } });
    await page.setViewport({ width: v.w, height: v.h });
    const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    await page.goto('http://127.0.0.1:' + port + '/index.html', { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 3000));
    const r = await page.evaluate(() => {
      const box = document.getElementById('heroCutShow');
      if (!box) return { err: 'no box' };
      const cs = getComputedStyle(box);
      const shots = [...box.querySelectorAll('img')].filter(el => {
        const st = getComputedStyle(el);
        return st.display !== 'none' && st.visibility !== 'hidden' && el.classList.contains('cut-on');
      });
      const tops = {};['a', 'b', 'c'].forEach(s => { tops[s] = [...box.querySelectorAll('[data-slot="slot-' + s + '"]')].pop(); });
      const rects = {}, vis = {};
      for (const [s, el] of Object.entries(tops)) {
        if (!el) { rects[s] = null; vis[s] = false; continue; }
        const st = getComputedStyle(el);
        vis[s] = st.display !== 'none' && st.visibility !== 'hidden';
        rects[s] = vis[s] ? el.getBoundingClientRect() : null;
      }
      const hero = document.querySelector('.hero, .hero-section, section.hero') || box.closest('section');
      const heroR = hero ? hero.getBoundingClientRect() : null;
      const ctaR = (document.querySelector('.hero .btn, .hero-cta, .hero .cta') || {}).getBoundingClientRect ? document.querySelector('.hero .btn, .hero-cta, .hero .cta').getBoundingClientRect() : null;
      function overlap(a, b) { if (!a || !b) return 0; const x = Math.min(a.right, b.right) - Math.max(a.left, b.left); const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); return (x > 0 && y > 0) ? { x, y } : 0; }
      return {
        cols: cs.gridTemplateColumns,
        visible: vis,
        widths: Object.fromEntries(Object.entries(rects).map(([s, r]) => [s, r ? Math.round(r.width) : 0])),
        heights: Object.fromEntries(Object.entries(rects).map(([s, r]) => [s, r ? Math.round(r.height) : 0])),
        ovAC: rects.a && rects.b ? overlap(rects.a, rects.b) : false, ovBC: rects.c && rects.b ? overlap(rects.c, rects.b) : false,
        ctaOverlap: (overlap(rects.b, ctaR) || overlap(rects.a, ctaR) || overlap(rects.c, ctaR)) ? true : false,
        overflowX: rects ? Object.entries(rects).some(([s, r]) => r && (r.left < 0 || r.right > innerWidth)) : null,
        badEls: (function(){ const bad=[]; document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.width>0&&(r.left<-0.5||r.right>innerWidth+0.5)){let c=''; try{c=(e.className instanceof SVGAnimatedString)?e.className.baseVal:String(e.className);}catch(_){} bad.push(e.tagName+'.'+c.slice(0,70)+' L:'+Math.round(r.left)+' R:'+Math.round(r.right));}}); return bad.slice(0,10); })(),
        heroBottomGap: rects.b && heroR ? Math.round(heroR.bottom - rects.b.bottom) : null,
        ctaOverlap: overlap(rects.b, ctaR) || overlap(rects.a, ctaR) || overlap(rects.c, ctaR) ? true : false,
        visBot: rects ? Math.max(0, ...Object.entries(rects).filter(([s, r]) => vis[s] && r).map(([s, r]) => r.bottom)) : null,
        visList: ['a', 'b', 'c'].filter(s => vis[s]),
        imgs: shots.length
      };
    });
    await page.screenshot({ path: path.join(root, '_hero_' + v.n + '.png'), fullPage: false });
    out.push({ vp: v.n, pageErrors: errs.length, ...r });
    await page.close();
  }
  await browser.close();
  server.close();
  require('fs').writeFileSync(path.join(root, '_hero_qa_out.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out.filter(o=>o.overflowX||o.ctaOverlap).map(o=>({vp:o.vp,bad:o.badEls})),null,1));
  console.table(out.map(o => ({ vp: o.vp, cols: (o.cols || '').slice(0, 40), visA: o.visible && o.visible.a, visB: o.visible && o.visible.b, visC: o.visible && o.visible.c, wB: o.widths && o.widths.b, wA: o.widths && o.widths.a, ov: !!(o.ovAC || o.ovBC), ovlX: o.overflowX, cta: o.ctaOverlap, imgs: o.imgs })));
})().catch(e => { console.error('FAIL', e); process.exit(1); });
