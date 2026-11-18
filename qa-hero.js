const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  const results = [];
  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');

  for (const vw of [360, 375, 390, 430, 1366]) {
    const vh = vw < 700 ? 850 : 800;
    const page = await browser.newPage();
    await page.setViewport({ width: vw, height: vh, isMobile: vw < 700, hasTouch: vw < 700 });
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 }).catch(e => console.log('nav:', e.message));
    await new Promise(r => setTimeout(r, 3500));

    const r = await page.evaluate(() => {
      const out = {};
      const stage = document.querySelector('.hero-home .hero-cut-slideshow');
      const ball = document.querySelector('.hero-cut-img.cut-ball, .hero-cut-slideshow .hero-cut-img.cut-p3');
      const cta = document.querySelector('.hero-home .btn, .hero-home a[class*="btn"]');
      const shots = document.querySelectorAll('.hero-cut-img');
      const rect = el => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
      out.stage = rect(stage);
      out.ball = rect(ball);
      out.ballLive = ball ? ball.classList.contains('cut-ball-live') : false;
      out.ballVar = ball ? ball.style.getPropertyValue('--bx') : null;
      out.shots = [...shots].map(s => ({ cls: s.className.slice(0, 40), ...rect(s) }));
      out.cta = rect(cta);
      out.overlapCTA = out.ball && out.cta &&
        !(out.ball.x + out.ball.w < out.cta.x || out.ball.x > out.cta.x + out.cta.w ||
          out.ball.y + out.ball.h < out.cta.y || out.ball.y > out.cta.y + out.cta.h);
      out.ballInStage = out.ball && out.stage &&
        out.ball.y >= out.stage.y - 2 &&
        out.ball.y + out.ball.h <= out.stage.y + out.stage.h + 2;
      out.hscroll = document.documentElement.scrollWidth > window.innerWidth + 1;
      out.group = document.querySelector('.cut-group') ? rect(document.querySelector('.cut-group')) : null;
      return out;
    });

    // sample ball movement over ~1.2s
    let moved = false, pos1 = null;
    for (let i = 0; i < 6; i++) {
      const p = await page.evaluate(() => {
        const b = document.querySelector('.hero-cut-img.cut-ball, .hero-cut-slideshow .hero-cut-img.cut-p3');
        if (!b) return null;
        const m = getComputedStyle(b).transform;
        return m && m !== 'none' ? m : null;
      });
      if (i === 0) pos1 = p; else if (p && p !== pos1) moved = true;
      await new Promise(r2 => setTimeout(r2, 200));
    }
    r.ballAnimates = moved;

    // drag-throw test
    if (r.ball) {
      const cx = r.ball.x + r.ball.w / 2, cy = r.ball.y + r.ball.h / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx - 120, cy - 60, { steps: 10 });
      await page.mouse.up();
      await new Promise(r2 => setTimeout(r2, 500));
      const t = await page.evaluate(() => {
        const b = document.querySelector('.hero-cut-img.cut-ball, .hero-cut-slideshow .hero-cut-img.cut-p3');
        return b ? { bx: b.style.getPropertyValue('--bx'), by: b.style.getPropertyValue('--by') } : null;
      });
      r.afterThrow = t;
      r.throwWorked = t && t.bx !== r.ballVar;
    }

    await page.screenshot({ path: `qa-hero-${vw}.png`, fullPage: false });
    results.push({ vw, ...r });
    await page.close();
  }

  for (const r of results) {
    console.log(`\n=== ${r.vw}px ===`);
    console.log('ball:', JSON.stringify(r.ball));
    console.log('stage:', JSON.stringify(r.stage));
    console.log('live:' + r.ballLive, 'animates:' + r.ballAnimates, 'inStage:' + r.ballInStage, 'overlapCTA:' + r.overlapCTA, 'throwWorked:' + r.throwWorked, 'hscroll:' + r.hscroll);
    if (r.vw < 700) console.log('group:', JSON.stringify(r.group), 'shots:', r.shots.length);
    r.shots.forEach(s => console.log('  shot:', s.cls, Math.round(s.w) + 'x' + Math.round(s.h), 'x=' + Math.round(s.x)));
  }
  await browser.close();
})();
