/* REV QA: 6 viewports × open/close/scroll/pagebottom/panel-size + audio attempt */
const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const srv = http.createServer((req, res) => {
  let p = req.url.split('?')[0]; if (p === '/') p = '/index.html';
  const fp = path.join(ROOT, decodeURIComponent(p));
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(res);
}).listen(8909);

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const VIEWPORTS = [
    { name: 'm355', w: 355, h: 800, mobile: true },
    { name: 'm375', w: 375, h: 812, mobile: true },
    { name: 'm393', w: 393, h: 852, mobile: true },
    { name: 'm430', w: 430, h: 932, mobile: true },
    { name: 'd1366', w: 1366, h: 768, mobile: false },
    { name: 'd1440', w: 1440, h: 900, mobile: false },
  ];
  const results = [];

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    if (vp.mobile) await page.setViewport({ width: vp.w, height: vp.h, isMobile: true, hasTouch: true });
    else await page.setViewport({ width: vp.w, height: vp.h });
    await page.goto('http://localhost:8909/index.html', { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2500));

    // 1. page scrollable to bottom BEFORE opening panel
    const scroll = await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(r => setTimeout(r, 400));
      const bottomReachable = Math.abs(window.scrollY + window.innerHeight - document.documentElement.scrollHeight) < 40;
      return { reachable: bottomReachable, maxY: document.documentElement.scrollHeight - window.innerHeight, at: Math.round(window.scrollY) };
    });

    // 2. open panel — measure overlap with visible content
    await page.click('#tobaMusicFab');
    await new Promise(r => setTimeout(r, 400));
    const panel = await page.evaluate(() => {
      const p = document.getElementById('tobaMusicPanel');
      const r = p.getBoundingClientRect();
      return { open: !p.hidden, h: Math.round(r.height), top: Math.round(r.top), bottom: Math.round(r.bottom), vh: window.innerHeight, listScrollable: (() => { const l = document.getElementById('tmList'); return l.scrollHeight > l.clientHeight; })(), closeVisible: (() => { const x = document.getElementById('tmClose'); const xr = x.getBoundingClientRect(); return xr.width > 0 && xr.bottom > 0 && xr.top < window.innerHeight; })() };
    });
    // can we still scroll page with panel open?
    const scrollOpen = await page.evaluate(async () => {
      const y0 = window.scrollY;
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 300));
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(r => setTimeout(r, 300));
      return { moved: window.scrollY !== y0 || window.scrollY > 100, now: Math.round(window.scrollY) };
    });
    await page.screenshot({ path: '_rev_' + vp.name + '_panel.png' });

    // 3. close panel
    await page.click('#tmClose');
    await new Promise(r => setTimeout(r, 300));
    const closed = await page.evaluate(() => document.getElementById('tobaMusicPanel').hidden);

    // 4. audio attempt (user gesture via click Play)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('#tobaMusicFab');
    await new Promise(r => setTimeout(r, 300));
    await page.click('#tmPlay');
    await new Promise(r => setTimeout(r, 12000));
    const audio = await page.evaluate(() => ({
      status: document.getElementById('tmStatus').textContent.slice(0, 80),
      playing: document.getElementById('tmPlay').textContent.includes('⏸')
    }));
    await page.screenshot({ path: '_rev_' + vp.name + '_audio.png' });
    await page.close();
    results.push({ vp: vp.name, scrollBottomBefore: scroll.reachable, panel, scrollWithPanelOpen: scrollOpen.moved, closed, audio });
  }
  require('fs').writeFileSync('_rev_qa_out.json', JSON.stringify(results, null, 1));
  await browser.close(); srv.close();
})().catch(e => { console.error('FATAL', e.message); srv.close(); process.exit(1); });
